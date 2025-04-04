import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

export async function invokeDeepSeek(message: string) {
  try {
    // Prepare payload for DeepSeek-R1
    const prompt = {
      model: "deepseek.deepseek-r1-chat-v1",
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500
    };

    const command = new InvokeModelCommand({
      modelId: "deepseek.deepseek-r1-chat-v1",
      body: JSON.stringify(prompt),
      contentType: "application/json",
      accept: "application/json"
    });

    // Invoke the model
    const response = await bedrockClient.send(command);

    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.generations?.[0]?.text || "No response from model";
  } catch (error) {
    console.error("Error invoking DeepSeek model:", error);
    throw new Error("Failed to get response from AI model");
  }
}
