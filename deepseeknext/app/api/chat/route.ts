import { NextResponse } from "next/server";
import { invokeDeepSeek } from "../../lib/bedrock";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const response = await invokeDeepSeek(message);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Failed to get response from AI model" }, { status: 500 });
  }
}