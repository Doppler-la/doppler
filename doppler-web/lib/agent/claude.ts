import Anthropic from "@anthropic-ai/sdk";
import { BRIEF_TOOL } from "./brief";
import { MAX_OUTPUT_TOKENS } from "./limits";

const MODEL = process.env.CHAT_MODEL ?? "claude-sonnet-5-5";

let client: Anthropic | undefined;

// Se crea de forma perezosa para que importar el módulo no exija la API key (build y tests).
function getClient(): Anthropic {
  client ??= new Anthropic({ timeout: 20_000, maxRetries: 1 });
  return client;
}

export async function streamTurn(params: {
  system: string;
  messages: Anthropic.MessageParam[];
  onText: (text: string) => void;
}): Promise<Anthropic.Message> {
  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: params.system,
    messages: params.messages,
    tools: [BRIEF_TOOL],
    output_config: { effort: "medium" },
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      params.onText(event.delta.text);
    }
  }
  return stream.finalMessage();
}
