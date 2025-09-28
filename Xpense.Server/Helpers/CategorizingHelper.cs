using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using OpenAI.Chat;
using System.Text.Json;
using Xpense.Server.Controllers;

namespace Xpense.Server.Helpers
{
    public static class CategorizingHelper
    {
       static  Uri endpoint = new Uri("https://soumi-mfwwn6rj-eastus2.openai.azure.com/");
       static string key = "FzklF6aOwl8flThof9rogm6KEqA1QYvEUHJidlWBsrSZQnvhKNgdJQQJ99BIACHYHv6XJ3w3AAAAACOGIY2L";
        public static async Task<ExpenseEntry> CategorizeExpense(ExpenseEntry expense)
        {


            AzureKeyCredential credential = new AzureKeyCredential(key);

            AzureOpenAIClient azureClient = new(endpoint, credential);

            ChatClient chatClient = azureClient.GetChatClient("gpt-5-mini");

            var messages = new List<ChatMessage>() {
                                    ChatMessage.CreateSystemMessage(@"You are an AI assistant that helps people find information. Categorize the expenses like Groceries, Entertainment, Travel, Subscriptions, Education, Sports, Medical, etc. Do not give reason for why you picked that category."),
                                    ChatMessage.CreateUserMessage(JsonSerializer.Serialize(expense)),
            };

            var options = new ChatCompletionOptions();

            try
            {
                ChatCompletion completion = await chatClient.CompleteChatAsync(messages, options);

                if (completion != null)
                {
                    Console.WriteLine(JsonSerializer.Serialize(
                        completion,
                        new JsonSerializerOptions { WriteIndented = true }));

                    var jsonoptions = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true, // allows case-insensitive matching
                        WriteIndented = true
                    };
                    string jsonString = completion.Content[0].Text.Trim(); // or your correct property
                    expense = JsonSerializer.Deserialize<ExpenseEntry>(jsonString, jsonoptions);
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
            return expense;
        }


    }
}
