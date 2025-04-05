import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

export async function invokeDeepSeek(message: string) {
  try {
    const prompt = `You are a helpful assistant <｜User｜>${message}<｜Assistant｜>`;
    const command = new InvokeModelCommand({
      modelId: "us.deepseek.r1-v1:0",
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 5000
      }),
      contentType: "application/json",
      accept: "application/json"
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.generations?.[0]?.text || "No response from model";
  } catch (error) {
    console.error("Error invoking DeepSeek model:", error);
    throw new Error("Failed to get response from AI model");
  }
}