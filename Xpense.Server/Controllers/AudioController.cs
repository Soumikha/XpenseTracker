using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
namespace Xpense.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : Controller
    {

         string speechKey = "9m0orPFGL62agjw8XrtpCoxKUIyJ1fS1rac5wBH23kCLz7FOym8nJQQJ99BIACYeBjFXJ3w3AAAYACOGKcP0";
         Uri endpoint = new Uri("https://eastus.api.cognitive.microsoft.com/");

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

            Debug.WriteLine("WAV Info:");
            Debug.WriteLine($"- File size: {fileSize} bytes");
            Debug.WriteLine($"- Audio format: {(audioFormat == 1 ? "PCM" : "Other (" + audioFormat + ")")}");
            Debug.WriteLine($"- Channels: {numChannels}");
            Debug.WriteLine($"- Sample rate: {sampleRate} Hz");
            Debug.WriteLine($"- Bits per sample: {bitsPerSample}");

            if (audioFormat != 1 || bitsPerSample != 16 || numChannels != 1 || sampleRate != 16000)
            {
                Debug.WriteLine("⚠️ This WAV is not in the recommended format (PCM, 16-bit, 16kHz, mono).");
            }
            else
            {
                Debug.WriteLine("✅ WAV format looks good.");
            }
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
            var ffmpegPath = "C:\\Work\\Xpense\\Xpense.Server\\wwwroot\\uploads\\ffmpeg"; // or the full path to ffmpeg.exe if not in PATH
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


            //using var fileStream = System.IO.File.OpenRead(@"C:\Work\XpenseTracker\Xpense.Server\wwwroot\uploads\Xpense.wav");

            // Create a PushAudioInputStream and write the file data into it
            //using var pushStream = AudioInputStream.CreatePushStream();
            //byte[] buffer = new byte[4096];
            //int bytesRead;
            //while ((bytesRead = await fileStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
            //{
            //    pushStream.Write(buffer,  bytesRead);
            //}
            //pushStream.Close();

            // Create AudioConfig from the PushAudioInputStream
            // using var audioConfig = AudioConfig.FromStreamInput(pushStream);
            ValidateWav(@"C:\Work\XpenseTracker\Xpense.Server\wwwroot\uploads\Xpense.wav");
            using var audioConfig = AudioConfig.FromWavFileInput(@"C:\Work\XpenseTracker\Xpense.Server\wwwroot\uploads\Xpense.wav");
            using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
            var speechRecognitionResult = await speechRecognizer.RecognizeOnceAsync();
            OutputSpeechRecognitionResult(speechRecognitionResult);
            return speechRecognitionResult;
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
    }
}
