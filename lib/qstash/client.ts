import { Client } from "@upstash/qstash";

// Initialize QStash client
export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// Webhook verification configuration
export const qstashConfig = {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  webhookSecret: process.env.QSTASH_WEBHOOK_SECRET || "",
};
