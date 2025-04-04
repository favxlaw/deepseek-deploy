import { NextResponse } from "next/server";
import { invokeDeepSeek } from "../../lib/bedrock" 

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const response = await invokeDeepSeek(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.log(error)
    return NextResponse.json( { status: 500 });
  }
}
