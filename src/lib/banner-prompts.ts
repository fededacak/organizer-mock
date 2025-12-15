// ============================================================================
// Banner Prompt Configuration
// ============================================================================
// This file contains the vibe-to-prompt mappings and layout rules for
// AI banner generation. Each vibe has a locked creative direction that
// cannot be overridden by user inputs.

export type Vibe =
  | "night-party"
  | "live-music"
  | "festival"
  | "conference"
  | "sports-fitness"
  | "community-event";

// ============================================================================
// Vibe Base Prompts
// ============================================================================
// Each vibe defines the core creative direction including:
// - Color palette and lighting
// - Composition style and focal point
// - Typography treatment zones
// - Edge safe zones for marketplace UI

interface VibePromptConfig {
  basePrompt: string;
  colorPalette: string;
  lighting: string;
  composition: string;
  mood: string;
}

export const VIBE_PROMPTS: Record<Vibe, VibePromptConfig> = {
  "night-party": {
    basePrompt: "Event banner for a night party, vibrant nightclub atmosphere",
    colorPalette: "deep purples, electric blues, neon pink accents, black",
    lighting: "dramatic neon lighting, glow effects, low ambient light",
    composition: "dynamic diagonal lines, central focal point with light burst",
    mood: "energetic, exciting, exclusive, celebratory",
  },
  "live-music": {
    basePrompt: "Event banner for a live music performance, concert atmosphere",
    colorPalette:
      "warm reds, deep blacks, golden yellows, stage lighting colors",
    lighting:
      "dramatic stage spotlights, silhouette effects, warm backlighting",
    composition: "stage-centered, dramatic depth, light rays from above",
    mood: "passionate, electrifying, immersive, raw energy",
  },
  festival: {
    basePrompt: "Event banner for an outdoor festival, celebratory atmosphere",
    colorPalette: "bright rainbow colors, warm sunset tones, festive accents",
    lighting: "golden hour sunlight, fairy lights, warm ambient glow",
    composition: "wide panoramic feel, open sky, festive elements",
    mood: "joyful, free-spirited, communal, adventurous",
  },
  conference: {
    basePrompt:
      "Event banner for a professional conference or talk, business setting",
    colorPalette:
      "clean blues, professional grays, white, subtle accent colors",
    lighting: "soft even lighting, professional studio quality",
    composition: "clean minimal layout, strong visual hierarchy, balanced",
    mood: "professional, inspiring, knowledgeable, credible",
  },
  "sports-fitness": {
    basePrompt:
      "Event banner for a sports or fitness event, athletic atmosphere",
    colorPalette: "bold reds, energetic oranges, dynamic blues, high contrast",
    lighting: "bright natural light, dramatic action lighting, high energy",
    composition: "dynamic motion lines, action-focused, powerful angles",
    mood: "powerful, motivating, competitive, healthy",
  },
  "community-event": {
    basePrompt: "Event banner for a community gathering, welcoming atmosphere",
    colorPalette: "warm earth tones, friendly greens, soft pastels, inviting",
    lighting: "soft natural daylight, warm ambient, welcoming glow",
    composition: "open and inviting, centered focal point, inclusive framing",
    mood: "welcoming, inclusive, friendly, connected",
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
  vibe: Vibe;
  textOverlay?: string;
  eventContext?: EventContext;
}

export function buildBannerPrompt(input: BannerGenerationInput): string {
  const vibeConfig = VIBE_PROMPTS[input.vibe];

  // Start with base prompt
  const promptParts: string[] = [
    vibeConfig.basePrompt,
    `Color palette: ${vibeConfig.colorPalette}`,
    `Lighting: ${vibeConfig.lighting}`,
    `Composition: ${vibeConfig.composition}`,
    `Mood: ${vibeConfig.mood}`,
  ];

  // Add event context for visual inspiration (NOT for text rendering)
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
        `Use the following event details ONLY as visual inspiration for the imagery, atmosphere, and theme - DO NOT render this information as text on the image: ${contextParts.join(
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
      "Position text in a safe area with strong contrast against background"
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
    "Photorealistic or high-quality illustration style",
    "Do NOT include any logos, watermarks, copyright symbols, or branding"
  );

  return promptParts.join(". ");
}
