// ============================================================================
// Banner Prompt Configuration
// ============================================================================
// This file contains the style-to-prompt mappings and layout rules for
// AI banner generation. Each style defines a visual rendering approach.
// Event type is inferred from the event context (title, description, location).

export type Style = "illustration" | "photorealistic" | "hybrid";

// ============================================================================
// Style Base Prompts
// ============================================================================
// Each style defines the visual rendering approach including:
// - Rendering technique and method
// - Texture and detail characteristics
// - Color treatment and palette approach

interface StylePromptConfig {
  basePrompt: string;
  renderingTechnique: string;
  textureAndDetail: string;
  colorTreatment: string;
  mustAvoid?: string;
}

export const STYLE_PROMPTS: Record<Style, StylePromptConfig> = {
  illustration: {
    basePrompt:
      "Bold illustrated event banner, energetic artwork with a fun rebellious edge, designed for adult audiences",
    renderingTechnique:
      "Screen-print inspired artwork, dynamic compositions, vintage poster influence with modern twist",
    textureAndDetail:
      "Gritty textures, halftone dots, distressed effects, bold graphic elements, ink splatter accents",
    colorTreatment:
      "High contrast color schemes, vibrant accent colors, electric and bold palettes appropriate to the event theme",
    mustAvoid:
      "coloring book style, childlike or playful cartoons, thick black outlines, simple flat shapes, cute characters, crayon or marker textures, clip art, sticker-like elements, corporate or sterile look",
  },
  photorealistic: {
    basePrompt: "Photorealistic event banner, high-quality photography style",
    renderingTechnique: "Photographic realism, natural lighting, sharp focus",
    textureAndDetail: "Real-world textures, depth of field, fine details",
    colorTreatment: "Natural color grading, realistic tones, cinematic look",
  },
  hybrid: {
    basePrompt:
      "Event photo with hand-drawn graphic overlays, real photography mixed with illustrated doodles and sketchy elements",
    renderingTechnique:
      "Real event photography as base with hand-drawn illustrations overlaid on top, sketchy marker-style graphics, doodle art elements like arrows, stars, and decorative marks",
    textureAndDetail:
      "Authentic photo base with rough hand-drawn line work overlays, scribbled textures, energetic sketch marks",
    colorTreatment:
      "Natural photo tones as base with bright accent overlay colors, high contrast between photo and graphic elements",
    mustAvoid:
      "clean vector graphics, polished design, corporate look, subtle effects, minimalism",
  },
};

// ============================================================================
// Layout Rules
// ============================================================================
// Fixed rules for marketplace-safe banner generation

export const LAYOUT_RULES = {
  aspectRatio: "5:2", // Fixed marketplace-safe aspect ratio
  safeZone: {
    top: "10%", // Space for platform UI elements
    bottom: "15%", // Space for title/info overlay
    left: "5%",
    right: "5%",
  },
  textPlacement: {
    position: "lower-third or center",
    maxCoverage: "40%", // Text should not cover more than 40% of image
    contrast: "ensure strong contrast with background",
    readability: "legible at small sizes (thumbnail view)",
  },
};

// ============================================================================
// Prompt Builder
// ============================================================================

export interface EventContext {
  title?: string;
  location?: string;
  description?: string;
}

export interface BannerGenerationInput {
  style: Style;
  textOverlay?: string;
  customInstructions?: string;
  eventContext?: EventContext;
}

export function buildBannerPrompt(input: BannerGenerationInput): string {
  const styleConfig = STYLE_PROMPTS[input.style];

  // Start with base prompt
  const promptParts: string[] = [
    styleConfig.basePrompt,
    `Rendering technique: ${styleConfig.renderingTechnique}`,
    `Texture and detail: ${styleConfig.textureAndDetail}`,
    `Color treatment: ${styleConfig.colorTreatment}`,
  ];

  // Add explicit avoidances if defined for this style
  if (styleConfig.mustAvoid) {
    promptParts.push(`MUST AVOID: ${styleConfig.mustAvoid}`);
  }

  // Add custom instructions FIRST as high priority - user input should override style defaults
  if (input.customInstructions && input.customInstructions.trim()) {
    promptParts.push(
      `PRIORITY INSTRUCTIONS (override any conflicting style defaults): ${input.customInstructions.trim()}`
    );
  }

  // Add event context for visual inspiration (NOT for text rendering)
  // The AI will infer the event type and atmosphere from this context
  const { eventContext } = input;
  if (eventContext) {
    const contextParts: string[] = [];
    if (eventContext.title) {
      contextParts.push(`Event title: "${eventContext.title}"`);
    }
    if (eventContext.location) {
      contextParts.push(`Location: "${eventContext.location}"`);
    }
    if (eventContext.description) {
      contextParts.push(`Event description: "${eventContext.description}"`);
    }
    if (contextParts.length > 0) {
      promptParts.push(
        `Use the following event details to determine the appropriate theme, atmosphere, and visual elements. Infer the event type (party, concert, conference, sports, tailgate, festival, etc.) from these details. DO NOT render this information as text on the image: ${contextParts.join(
          ", "
        )}`
      );
    }
  }

  // Add text overlay instructions if provided
  if (input.textOverlay && input.textOverlay.trim()) {
    promptParts.push(
      `Include ONLY this exact text: "${input.textOverlay.trim()}"`,
      "Display ONLY the provided text, no additional words, titles, or decorative typography",
      "Text should be clearly readable, well-styled typography",
      "CRITICAL: Text must be horizontally AND vertically CENTERED in the image - place it in the exact middle of the banner",
      "Ensure strong contrast between text and background for readability"
    );
  } else {
    promptParts.push(
      "IMPORTANT: Do NOT include any text, words, letters, numbers, or typography of any kind",
      "The image must be completely text-free - no titles, labels, watermarks, or decorative text",
      "Pure visual imagery only"
    );
  }

  // Add fixed layout rules with strict aspect ratio requirements
  promptParts.push(
    `CRITICAL: Generate image with EXACT ${LAYOUT_RULES.aspectRatio} aspect ratio (2.5:1 wide horizontal banner)`,
    "The image MUST fill the entire canvas edge-to-edge with NO white space, borders, padding, or margins around the image",
    "All visual elements and any text MUST be fully contained within the image boundaries - nothing should be cut off or extend beyond the frame",
    "Clean composition suitable for event discovery surfaces",
    "Clear focal point, avoid clutter, respect edge safe zones",
    "Professional quality, polished, ready-to-use event banner",
    "Do NOT include any logos, watermarks, copyright symbols, or branding"
  );

  return promptParts.join(". ");
}
