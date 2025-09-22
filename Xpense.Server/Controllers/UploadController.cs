using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Xpense.Server.Models;
namespace Xpense.Server.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {

        [HttpPost("UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            string itemDescription = "";
            double? itemTotalPrice = 0.0;
            double? total = 0.0;
            string merchantName = "";
            DateTimeOffset? transactionDate = null;
            List<LineItem> items = new List<LineItem>();
            //use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentIntelligenceClient` instances
            string key = "9tOCdgXvNnBKSgFAWxckvcwr8SxUsqco8vvI19hfOldeFQlfA9cQJQQJ99BIACYeBjFXJ3w3AAALACOGMiMD";
;
            string endpoint = "https://soumis-di.cognitiveservices.azure.com/";
            AzureKeyCredential credential = new AzureKeyCredential(key);
            DocumentIntelligenceClient client = new DocumentIntelligenceClient(new Uri(endpoint), credential);


            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var path = Path.Combine("wwwroot/uploads", file.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            string str = "";
            using (var stream = file.OpenReadStream())
            {

                Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-receipt", BinaryData.FromStream(stream));

                AnalyzeResult receipts = operation.Value;



                // To see the list of the supported fields returned by service and its corresponding types, consult:
                // https://aka.ms/formrecognizer/receiptfields

                foreach (AnalyzedDocument receipt in receipts.Documents)
                {
                    if (receipt.Fields.TryGetValue("MerchantName", out DocumentField merchantNameField))
                    {
                        if (merchantNameField.FieldType == DocumentFieldType.String)
                        {
                             merchantName = merchantNameField.ValueString;

                            Console.WriteLine($"Merchant Name: '{merchantName}', with confidence {merchantNameField.Confidence}");
                        }
                    }

                    if (receipt.Fields.TryGetValue("TransactionDate", out DocumentField transactionDateField))
                    {
                        if (transactionDateField.FieldType == DocumentFieldType.Date)
                        {
                             transactionDate = transactionDateField.ValueDate;

                            Console.WriteLine($"Transaction Date: '{transactionDate}', with confidence {transactionDateField.Confidence}");
                        }
                    }

                    if (receipt.Fields.TryGetValue("Items", out DocumentField itemsField))
                    {
                        if (itemsField.FieldType == DocumentFieldType.List)
                        {
                            foreach (DocumentField itemField in itemsField.ValueList)
                            {
                                Console.WriteLine("Item:");

                                if (itemField.FieldType == DocumentFieldType.Dictionary)
                                {
                                    IReadOnlyDictionary<string, DocumentField> itemFields = itemField.ValueDictionary;

                                    if (itemFields.TryGetValue("Description", out DocumentField itemDescriptionField))
                                    {
                                        if (itemDescriptionField.FieldType == DocumentFieldType.String)
                                        {
                                             itemDescription = itemDescriptionField.ValueString;

                                            //Console.WriteLine($"  Description: '{itemDescription}', with confidence {itemDescriptionField.Confidence}");
                                        }
                                    }
                                  
                                    if (itemFields.TryGetValue("TotalPrice", out DocumentField itemTotalPriceField))
                                    {
                                        if (itemTotalPriceField.FieldType == DocumentFieldType.Currency)
                                        {
                                             itemTotalPrice = itemTotalPriceField.ValueCurrency.Amount;

                                            //Console.WriteLine($"  Total Price: '{itemTotalPrice}', with confidence {itemTotalPriceField.Confidence}");
                                        }
                                    }

                                    items.Add(new LineItem(itemDescription, itemTotalPrice));

                                }
                            }
                        }
                    }

                    if (receipt.Fields.TryGetValue("Total", out DocumentField totalField))
                    {
                        if (totalField.FieldType == DocumentFieldType.Currency)
                        {
                             total = totalField.ValueCurrency.Amount;

                            Console.WriteLine($"Total: '{total}', with confidence '{totalField.Confidence}'");
                        }
                    }
                }
                Expenses expense = new Expenses(merchantName,transactionDate,total,items);
            }
                return Ok(new { content = str });
            
        }
    }
}
