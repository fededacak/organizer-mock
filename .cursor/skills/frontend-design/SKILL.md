---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, layouts, or applications with Next.js, Tailwind CSS, Framer Motion, and shadcn/ui. Generates creative, polished code that avoids generic AI aesthetics while following project conventions.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Design Thinking

Before coding, understand the context and commit to a **bold** aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this unforgettable? What's the one thing someone will remember?

**Critical**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work -- the key is intentionality, not intensity.

## Tech Stack

Use the following stack unless the user specifies otherwise:

| Tool | Usage |
|------|-------|
| **Next.js** (App Router) | Framework, pages, layouts, server components |
| **Tailwind CSS v4** | Styling via utility classes, CSS variables in `globals.css` |
| **Framer Motion** | Complex animations, enter/exit transitions, gestures |
| **shadcn/ui** | Base UI primitives (Dialog, Button, Popover, etc.) |
| **Radix UI** | Accessible headless components (via shadcn) |
| **Lucide React** | Icons |
| **CVA** | Component variant management |
| **clsx + tailwind-merge** | Conditional className composition |

### Tailwind v4 Specifics

This project uses Tailwind v4 with PostCSS. Configuration lives in `globals.css` using `@theme inline`, not in a `tailwind.config.ts`. To add custom design tokens:

```css
@theme inline {
  --color-custom: #ff00aa;
  --font-display: "Your Font", sans-serif;
}
```

### Font Loading

Use `next/font` for font optimization:

```tsx
import { Outfit, Open_Sans } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-outfit",
});
```

Then apply via Tailwind: `font-outfit`, `font-open-sans`.

### Component Patterns

Follow shadcn/ui conventions:

- Use `data-slot` attributes for component identification
- Use CVA for variant definitions
- Compose with Radix primitives
- Use `cn()` (clsx + tailwind-merge) for className merging

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center ...", {
  variants: {
    variant: { default: "...", destructive: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

## Frontend Aesthetics

### Typography

Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt for distinctive choices that elevate the design. Pair a distinctive display font with a refined body font.

When adding new fonts, use `next/font/google` or `next/font/local` for optimal loading. Register the CSS variable in the root layout and add it to Tailwind via `@theme inline`.

### Color & Theme

Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

This project uses `next-themes` with a `.dark` class and CSS variable overrides. When creating themed components, use the existing variable system:

```css
/* Light */
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);

/* Dark (.dark) */
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
```

Brand colors are available as utilities: `tp-blue`, `tp-red`, `tp-green`, `tp-orange`, `tp-purple`.

### Motion

Use Framer Motion for complex animations and CSS transitions for simple states. Defer to the user's animation guidelines (easing curves, spring defaults, hover rules, accessibility) which are defined separately.

Key principles:
- Use `AnimatePresence` for enter/exit transitions
- Prefer spring animations for Framer Motion (non-bouncy by default)
- Respect `useReducedMotion` for accessibility
- Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions

### Spatial Composition

Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density. Use Tailwind's grid and flexbox utilities for layout, but don't be afraid to break the grid with absolute positioning or negative margins for intentional effects.

### Backgrounds & Visual Details

Create atmosphere and depth rather than defaulting to solid colors. Apply contextual effects: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, grain overlays.

Use Tailwind's gradient utilities (`bg-gradient-to-*`) and custom CSS for complex effects. The project has custom shadow utilities: `shadow-card`, `shadow-floating`.

## What to Avoid

Never use generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (purple gradients on white backgrounds)
- Predictable layouts and cookie-cutter component patterns
- Default shadcn/ui styling without customization

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No two designs should look the same. Vary between light and dark themes, different fonts, different aesthetics. Never converge on common choices (e.g., Space Grotesk) across generations.

## Implementation Quality

Match implementation complexity to the aesthetic vision:

- **Maximalist designs**: elaborate Tailwind compositions, Framer Motion orchestrations, layered effects
- **Minimalist designs**: restraint, precision, careful spacing/typography, subtle details

All code must be:
- Production-grade and functional
- Accessible (keyboard navigation, screen readers, reduced motion)
- Responsive (mobile-first with Tailwind breakpoints)
- Type-safe (TypeScript, proper prop types)

Use `"use client"` only when needed (event handlers, hooks, browser APIs). Keep server components as the default.
