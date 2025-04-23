import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { webhookURL, message } = await req.json();

    if (!webhookURL || !message) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const formattedMessage = `From Neil's Slack Bot: ${message}`;

    await axios.post(webhookURL, { text: formattedMessage });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}