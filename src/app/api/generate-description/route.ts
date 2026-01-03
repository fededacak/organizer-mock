import OpenAI from "openai";

interface EventContext {
  title?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
}

interface RequestBody {
  context: EventContext;
  instructions?: string;
  existingText?: string;
}

function buildSystemPrompt(context: EventContext): string {
  const parts = [
    "You are a helpful assistant that writes engaging event descriptions.",
    "Write in a friendly, professional tone that encourages attendance.",
    "Keep descriptions concise but compelling (2-4 paragraphs max).",
    "Do not use excessive emojis unless specifically requested.",
  ];

  const contextParts: string[] = [];
  if (context.title) contextParts.push(`Event name: ${context.title}`);
  if (context.startDate) contextParts.push(`Date: ${context.startDate}`);
  if (context.startTime) contextParts.push(`Time: ${context.startTime}`);
  if (context.location) contextParts.push(`Location: ${context.location}`);

  if (contextParts.length > 0) {
    parts.push("\nEvent details to incorporate:");
    parts.push(contextParts.join("\n"));
  }

  return parts.join("\n");
}

function buildUserPrompt(instructions?: string, existingText?: string): string {
  if (existingText) {
    const base = `Here is the current event description:\n\n"${existingText}"\n\n`;
    if (instructions) {
      return `${base}Please improve this description based on these instructions: ${instructions}`;
    }
    return `${base}Please improve and enhance this description while keeping the core message.`;
  }

  if (instructions) {
    return `Write an event description with these requirements: ${instructions}`;
  }

  return "Write a compelling event description based on the event details provided.";
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body: RequestBody = await request.json();
    const { context, instructions, existingText } = body;

    const systemPrompt = buildSystemPrompt(context);
    const userPrompt = buildUserPrompt(instructions, existingText);

    const stream = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 500,
    });

    // Create a ReadableStream to stream the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error generating description:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate description";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
