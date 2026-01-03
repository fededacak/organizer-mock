import { GoogleGenAI } from "@google/genai";
import {
  buildBannerPrompt,
  type Vibe,
  type BannerGenerationInput,
  type EventContext,
} from "@/lib/banner-prompts";

// ============================================================================
// Request/Response Types
// ============================================================================

interface RequestBody {
  vibe: Vibe;
  textOverlay?: string;
  eventContext?: EventContext;
}

interface SuccessResponse {
  imageUrl: string;
  prompt: string; // For debugging, remove in production
}

interface ErrorResponse {
  error: string;
}

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(request: Request): Promise<Response> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured" } satisfies ErrorResponse,
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const body: RequestBody = await request.json();
    const { vibe, textOverlay, eventContext } = body;

    // Validate required fields
    if (!vibe) {
      return Response.json(
        { error: "Vibe is required" } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // Build the generation input
    const generationInput: BannerGenerationInput = {
      vibe,
      textOverlay: textOverlay?.trim(),
      eventContext,
    };

    // Build the prompt
    const prompt = buildBannerPrompt(generationInput);

    // Generate image using Gemini 2.5 Flash Image
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["Image"],
        imageConfig: {
          aspectRatio: "16:9", // Closest available to 5:2
        },
      },
    });

    // Extract base64 image from response
    const part = response.candidates?.[0]?.content?.parts?.[0];
    const imageData = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType ?? "image/png";

    if (!imageData) {
      return Response.json(
        { error: "Failed to generate image" } satisfies ErrorResponse,
        { status: 500 }
      );
    }

    // Convert to data URL for direct use in <img> tags
    const imageUrl = `data:${mimeType};base64,${imageData}`;

    return Response.json({
      imageUrl,
      prompt, // Include for debugging, remove in production
    } satisfies SuccessResponse);
  } catch (error) {
    console.error("Error generating banner:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate banner";

    return Response.json({ error: errorMessage } satisfies ErrorResponse, {
      status: 500,
    });
  }
}
