using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Xpense.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {

        [HttpPost("UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {

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
                AnalyzeResult result = operation.Value;

               

                foreach (DocumentPage page in result.Pages)
                {
                    str += $"Document Page {page.PageNumber} has {page.Lines.Count} line(s), {page.Words.Count} word(s),";
                    str += $"and {page.SelectionMarks.Count} selection mark(s).";

                    for (int i = 0; i < page.Lines.Count; i++)
                    {
                        DocumentLine line = page.Lines[i];
                        str += $"  Line {i} has content: '{line.Content}'.";

                        //str += $"    Its bounding polygon (points ordered clockwise):";

                        //for (int j = 0; j < line.Polygon.Count; j++)
                        //{
                        //    str += $"      Point {j} => X: {line.Polygon[j].X}, Y: {line.Polygon[j].Y}";
                        //}
                    }
                }


                //foreach (DocumentStyle style in result.Styles)
                //{
                //    // Check the style and style confidence to see if text is handwritten.
                //    // Note that value '0.8' is used as an example.

                //    bool isHandwritten = style.IsHandwritten.HasValue && style.IsHandwritten == true;

                //    if (isHandwritten && style.Confidence > 0.8)
                //    {
                //        str += $"Handwritten content found:");

                //        foreach (DocumentSpan span in style.Spans)
                //        {
                //            str += $"  Content: {result.Content.Substring(span.Index, span.Length)}");
                //        }
                //    }
                //}

                str += "Detected languages:";

                foreach (DocumentLanguage language in result.Languages)
                {
                    str += $"  Found language with locale'{language.Locale}' with confidence {language.Confidence}.";
                }
            }
                return Ok(new { content = str });
            
        }
    }
}
