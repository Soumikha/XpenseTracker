using Azure;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using OpenAI.Chat;
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Xpense.Server.Helpers;
using Xpense.Server.Models;
using Xpense.Server.Models;
using static System.Environment;

namespace Xpense.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : Controller
    {
        string? speechRecognitionResult;
         string speechKey = "9m0orPFGL62agjw8XrtpCoxKUIyJ1fS1rac5wBH23kCLz7FOym8nJQQJ99BIACYeBjFXJ3w3AAAYACOGKcP0";
         Uri endpoint = new Uri("https://eastus.api.cognitive.microsoft.com/");
        string AIkey = "FzklF6aOwl8flThof9rogm6KEqA1QYvEUHJidlWBsrSZQnvhKNgdJQQJ99BIACHYHv6XJ3w3AAAAACOGIY2L";
        Uri AIendpoint = new Uri("https://soumi-mfwwn6rj-eastus2.openai.azure.com/");
        public static void ValidateWav(string filePath)
        {
            if (!System.IO.File.Exists(filePath))
            {
                Debug.WriteLine("❌ File not found: " + filePath);
                return;
            }

            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            using var br = new BinaryReader(fs);

            // Read RIFF header
            string riff = Encoding.ASCII.GetString(br.ReadBytes(4));
            int fileSize = br.ReadInt32();
            string wave = Encoding.ASCII.GetString(br.ReadBytes(4));

            if (riff != "RIFF" || wave != "WAVE")
            {
                Debug.WriteLine("❌ Not a valid WAV file.");
                return;
            }

            // Read fmt  chunk
            string fmt = Encoding.ASCII.GetString(br.ReadBytes(4));
            int fmtSize = br.ReadInt32();
            short audioFormat = br.ReadInt16();   // 1 = PCM
            short numChannels = br.ReadInt16();
            int sampleRate = br.ReadInt32();
            int byteRate = br.ReadInt32();
            short blockAlign = br.ReadInt16();
            short bitsPerSample = br.ReadInt16();

    

        }

        static void OutputSpeechRecognitionResult(SpeechRecognitionResult speechRecognitionResult)
        {
            switch (speechRecognitionResult.Reason)
            {
                case ResultReason.RecognizedSpeech:
                    Debug.WriteLine($"RECOGNIZED: Text={speechRecognitionResult.Text}");
                    break;
                case ResultReason.NoMatch:
                    Debug.WriteLine($"NOMATCH: Speech could not be recognized.");
                    break;
                case ResultReason.Canceled:
                    var cancellation = CancellationDetails.FromResult(speechRecognitionResult);
                    Debug.WriteLine($"CANCELED: Reason={cancellation.Reason}");

                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        Debug.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                        Debug.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                        Debug.WriteLine($"CANCELED: Did you set the speech resource key and endpoint values?");
                    }
                    break;
            }
        }
        private async Task<string> ConvertWebmToWavAsync(string inputPath, string outputPath)
        {
            var ffmpegPath = "C:\\Work\\XpenseTracker\\Xpense.Server\\wwwroot\\uploads\\ffmpeg"; // or the full path to ffmpeg.exe if not in PATH
            var args = $"-y -i \"{inputPath}\" -acodec pcm_s16le -ac 1 -ar 16000 \"{outputPath}\"";

            var process = new System.Diagnostics.Process
            {
                StartInfo = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = args,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();
            string output = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
                throw new Exception($"FFmpeg failed: {output}");

            return outputPath;
        }
        async Task<SpeechRecognitionResult> sendAudiotoAzure(string path) 
        {
            var speechConfig = SpeechConfig.FromEndpoint(endpoint, speechKey);
            speechConfig.SpeechRecognitionLanguage = "en-US";

            ValidateWav(@"C:\Work\XpenseTracker\Xpense.Server\wwwroot\uploads\Xpense.wav");
            using var audioConfig = AudioConfig.FromWavFileInput(@"C:\Work\XpenseTracker\Xpense.Server\wwwroot\uploads\Xpense.wav");
            using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
            var result = await speechRecognizer.RecognizeOnceAsync();
            OutputSpeechRecognitionResult(result);

        
            this.speechRecognitionResult = result.Text;
            await RunAsync();
           return result;
         
        }

        [HttpPost("SendAudio")]
        public async Task<IActionResult> UploadAudio(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Choose where to save it
            var savePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");

            if (!Directory.Exists(savePath))
            {
                Directory.CreateDirectory(savePath);
            }

            var filePath = Path.Combine(savePath, file.FileName);

            // Save the file locally
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);

            }

            // Convert to WAV (PCM, 16-bit, 16kHz, mono)
            var wavFilePath = Path.Combine( savePath, Path.GetFileNameWithoutExtension(file.FileName) + ".wav");
            await ConvertWebmToWavAsync(filePath, wavFilePath);

            await sendAudiotoAzure(filePath);
            return Ok($"Audio uploaded successfully at: {filePath}");
        }
        
        private async Task RunAsync()
        {
            AzureKeyCredential credential = new AzureKeyCredential(AIkey);

            // Initialize the AzureOpenAIClient
            AzureOpenAIClient azureClient = new(AIendpoint, credential);

            // Initialize the ChatClient with the specified deployment name
            ChatClient chatClient = azureClient.GetChatClient("XTgpt-5-mini");

            var messages = new List<ChatMessage>
            {
                ChatMessage.CreateSystemMessage(@"
You are an AI assistant that helps people find information.
Parse the given text, just give me merchantName, and expense line items and exact date instead of today, yesterday, etc. 
Give the output as JSON as follows: [{""MerchantName"":""ShopRite"", ""ExpenseDate"":""yyyy-mm-dd"",""Total_Amount"":10.00, ""Expense"":""Paste""}] for every new item add another element in the JSON array"),
                ChatMessage.CreateUserMessage(speechRecognitionResult),
            };

            // Create chat completion options
            var options = new ChatCompletionOptions();

            // <!-- NOTE: this section only needs to be included if max tokens are configured -->
            // Setting MaxOutputTokenCount requires a temporary workaround using 2.2.0-beta.1
            // See related:
            // https://github.com/Azure/azure-sdk-for-net/pull/48218#issuecomment-2652005055
            //
          

            try
            {
                // Create the chat completion request
                ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

                var jsonoptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true, // allows case-insensitive matching
                    WriteIndented = true
                };
                string jsonString = completion.Content[0].Text.Trim(); // or your correct property
                List<ExpenseEntry> expenses = JsonSerializer.Deserialize<List<ExpenseEntry>>(jsonString, jsonoptions);

                
                using SqlConnection conn = new SqlConnection("Server=tcp:xtrerversql.database.windows.net,1433;Initial Catalog=XT;Persist Security Info=False;User ID=soumikha;Password=Pass1w0rd!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
                conn.Open();
                SqlCommand cmd;

                for (int i = 0; i < expenses.Count; i++)
                {
                    var categorizedExpense = await CategorizingHelper.CategorizeExpense(expenses[i]);

                    cmd = new SqlCommand("INSERT INTO expense (item, amount, merchant, expense_date,category,subcategory) VALUES (@item, @amount, @merchant, @expenseDate,@category,@subcategory)", conn);

                    cmd.Parameters.AddWithValue("@item", expenses[i].Expense);

                    cmd.Parameters.AddWithValue("@amount", expenses[i].Total_Amount);
                    cmd.Parameters.AddWithValue("@merchant", expenses[i].MerchantName);
                    cmd.Parameters.AddWithValue("@expenseDate", expenses[i].ExpenseDate);
                    cmd.Parameters.AddWithValue("@Category", categorizedExpense.Category);
                    cmd.Parameters.AddWithValue("@Subcategory", categorizedExpense.Subcategory);

                    cmd.ExecuteNonQuery();
                }
                conn.Close();
            
                
                // Print the response
                if (completion != null)
                {
                    Console.WriteLine(JsonSerializer.Serialize(completion, new JsonSerializerOptions() { WriteIndented = true }));
                }
                else
                {
                    Console.WriteLine("No response received.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }
    }
}
