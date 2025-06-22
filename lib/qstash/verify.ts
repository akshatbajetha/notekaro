import { createHmac } from "crypto";
import { qstashConfig } from "./client";

export async function verifyQStashWebhook(request: Request) {
  try {
    // For App Router, we need to handle the verification manually
    // QStash adds headers that we can verify
    const signature = request.headers.get("upstash-signature");
    const timestamp = request.headers.get("upstash-timestamp");
    const body = await request.text();

    if (!signature || !timestamp) {
      console.error("Missing QStash headers");
      return false;
    }

    // Verify the signature manually
    const expectedSignature = createHmac(
      "sha256",
      qstashConfig.currentSigningKey
    )
      .update(`${timestamp}.${body}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("QStash signature mismatch");
      return false;
    }

    return true;
  } catch (error) {
    console.error("QStash signature verification failed:", error);
    return false;
  }
}
