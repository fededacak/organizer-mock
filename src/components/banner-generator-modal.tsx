"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, RefreshCw, X } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";

// ============================================================================
// Types
// ============================================================================

export interface BannerEventContext {
  title?: string;
  startDate?: Date;
  startTime?: string;
  location?: string;
  description?: string;
}

interface BannerGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (imageUrl: string) => void;
  eventContext: BannerEventContext;
}

type ModalView = "style-selection" | "loading" | "preview";

// ============================================================================
// Vibe Types & Options
// ============================================================================

type Vibe =
  | "night-party"
  | "live-music"
  | "festival"
  | "conference"
  | "sports-fitness"
  | "community-event";

interface VibeOption {
  id: Vibe;
  label: string;
  icon: string;
}

const VIBE_OPTIONS: VibeOption[] = [
  { id: "night-party", label: "Night Party", icon: "🎉" },
  { id: "live-music", label: "Live Music", icon: "🎸" },
  { id: "festival", label: "Festival", icon: "🎪" },
  { id: "conference", label: "Conference or Talk", icon: "🎤" },
  { id: "sports-fitness", label: "Sports or Fitness", icon: "🏃" },
  { id: "community-event", label: "Community Event", icon: "🤝" },
];

const TEXT_MAX_LENGTH = 60;

// ============================================================================
// Animation Config
// ============================================================================

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

// ============================================================================
// Main Component
// ============================================================================

export function BannerGeneratorModal({
  open,
  onOpenChange,
  onGenerate,
  eventContext,
}: BannerGeneratorModalProps) {
  // View state
  const [view, setView] = useState<ModalView>("style-selection");

  // Form state
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("night-party");
  const [textOverlay, setTextOverlay] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setView("style-selection");
        setSelectedVibe("night-party");
        setTextOverlay("");
        setGeneratedImageUrl(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handlers
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleGenerate = async () => {
    setView("loading");

    try {
      const response = await fetch("/api/generate-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vibe: selectedVibe,
          textOverlay: textOverlay || undefined,
          eventContext: {
            title: eventContext.title,
            location: eventContext.location,
            description: eventContext.description,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Generation failed:", error);
        // Fall back to placeholder on error
        setGeneratedImageUrl("/sample-banner.svg");
      } else {
        const data = await response.json();
        setGeneratedImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error("Generation error:", error);
      // Fall back to placeholder on error
      setGeneratedImageUrl("/sample-banner.svg");
    }

    setView("preview");
  };

  const handleRegenerate = async () => {
    setView("loading");

    try {
      const response = await fetch("/api/generate-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vibe: selectedVibe,
          textOverlay: textOverlay || undefined,
          eventContext: {
            title: eventContext.title,
            location: eventContext.location,
            description: eventContext.description,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Regeneration failed:", error);
        // Keep current image on error
      } else {
        const data = await response.json();
        setGeneratedImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error("Regeneration error:", error);
      // Keep current image on error
    }

    setView("preview");
  };

  const handleApply = () => {
    if (generatedImageUrl) {
      onGenerate(generatedImageUrl);
    }
    handleClose();
  };

  const handleDiscard = () => {
    setGeneratedImageUrl(null);
    setView("style-selection");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <LayoutGroup>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* ============================================================ */}
        {/* Style Selection View */}
        {/* ============================================================ */}
        {view === "style-selection" && (
          <motion.div
            layoutId="banner-modal-container"
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[480px] mx-4 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="banner-modal-header"
              className="flex items-center justify-center pb-2 pt-8 px-5 relative"
              transition={springTransition}
            >
              <motion.h2
                layoutId="banner-modal-title"
                className="font-outfit font-extrabold text-[20px] text-black"
                transition={springTransition}
              >
                Generate Image
              </motion.h2>
              <motion.button
                layoutId="banner-close-button"
                onClick={handleClose}
                className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                transition={springTransition}
              >
                <X className="w-4 h-4 text-gray" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="px-4 md:px-6 py-4 space-y-5">
              {/* Vibe Selection */}
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">
                  Vibe
                </label>
                <div className="flex flex-wrap gap-2">
                  {VIBE_OPTIONS.map((vibe) => (
                    <motion.button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`px-4 py-2.5 rounded-full text-sm font-semibold cursor-pointer flex items-center gap-1.5 ${
                        selectedVibe === vibe.id
                          ? "bg-tp-blue text-white shadow-sm"
                          : "bg-light-gray text-dark-gray hover:bg-soft-gray hover:text-black"
                      }`}
                      animate={{
                        scale: selectedVibe === vibe.id ? 1.02 : 1,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      style={{
                        transition:
                          "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      <span>{vibe.icon}</span>
                      <span>{vibe.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Text Overlay Input */}
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">
                  Text on image (optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    maxLength={TEXT_MAX_LENGTH}
                    placeholder="e.g. event title, date, time, location"
                    className="w-full h-[47px] px-4 pr-16 border border-neutral-200 rounded-[14px] text-base text-black placeholder:text-gray/80 focus:outline-none focus:border-tp-blue/40 focus:ring-[3px] focus:ring-tp-blue/20 transition-all duration-200 ease"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray tabular-nums">
                    {textOverlay.length}/{TEXT_MAX_LENGTH}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              layoutId="banner-modal-footer"
              className="flex justify-end gap-3 pb-6 pt-2 px-4 md:px-6"
              transition={springTransition}
            >
              <motion.button
                layoutId="banner-primary-button"
                onClick={handleGenerate}
                className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 pl-4 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform flex items-center gap-2"
                transition={springTransition}
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* Loading View */}
        {/* ============================================================ */}
        {view === "loading" && (
          <motion.div
            layoutId="banner-modal-container"
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[520px] mx-4 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="banner-modal-header"
              className="flex items-center justify-center pb-2 pt-8 px-5 relative"
              transition={springTransition}
            >
              <motion.h2
                layoutId="banner-modal-title"
                className="font-outfit font-extrabold text-[20px] text-black"
                transition={springTransition}
              >
                Generate Image
              </motion.h2>
              <motion.button
                layoutId="banner-close-button"
                onClick={handleClose}
                className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                transition={springTransition}
              >
                <X className="w-4 h-4 text-gray" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="px-4 md:px-6 py-6">
              {/* Loading Placeholder - 5:2 aspect ratio */}
              <div className="aspect-5/2 rounded-[16px] overflow-hidden animate-shimmer flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              layoutId="banner-modal-footer"
              className="flex justify-end gap-3 pb-6 pt-2 px-4 md:px-6"
              transition={springTransition}
            >
              <motion.button
                layoutId="banner-secondary-button"
                onClick={() => setView("style-selection")}
                className="px-5 py-2.5 text-base font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                transition={springTransition}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* Preview View */}
        {/* ============================================================ */}
        {view === "preview" && (
          <motion.div
            layoutId="banner-modal-container"
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[580px] mx-4 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="banner-modal-header"
              className="flex items-center justify-center pb-2 pt-8 px-5 relative"
              transition={springTransition}
            >
              <motion.h2
                layoutId="banner-modal-title"
                className="font-outfit font-extrabold text-[20px] text-black"
                transition={springTransition}
              >
                Generate Image
              </motion.h2>
              <motion.button
                layoutId="banner-close-button"
                onClick={handleClose}
                className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                transition={springTransition}
              >
                <X className="w-4 h-4 text-gray" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="px-4 md:px-6 py-4 space-y-4">
              {/* Generated Image Preview - 5:2 aspect ratio */}
              <div className="aspect-5/2 rounded-[16px] overflow-hidden bg-light-gray relative">
                {generatedImageUrl && (
                  <motion.img
                    src={generatedImageUrl}
                    alt="Generated banner"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                )}
              </div>

              {/* Regenerate Option */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-full transition-colors duration-200 ease cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              layoutId="banner-modal-footer"
              className="flex justify-end gap-3 pb-6 pt-2 px-4 md:px-6"
              transition={springTransition}
            >
              <motion.button
                layoutId="banner-secondary-button"
                onClick={handleDiscard}
                className="px-5 py-2.5 text-base font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                transition={springTransition}
              >
                Discard
              </motion.button>
              <motion.button
                layoutId="banner-primary-button"
                onClick={handleApply}
                className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform"
                transition={springTransition}
              >
                Apply
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
