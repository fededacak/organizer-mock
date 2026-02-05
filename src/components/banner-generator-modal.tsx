"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  RefreshCw,
  X,
  CircleHelp,
  CircleAlert,
  Check,
  Download,
  Scaling,
} from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
  onOpenDescriptionModal?: () => void;
  onFocusTitleInput?: () => void;
}

type ModalView = "style-selection" | "loading" | "preview";

// ============================================================================
// Style Types & Options
// ============================================================================

type Style = "illustration" | "photorealistic" | "hybrid";

interface StyleOption {
  id: Style;
  label: string;
  thumbnail: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "illustration",
    label: "Illustration",
    thumbnail:
      "https://static.tickpick.com/media-vault/organizer/event-creation/illustration-thumbnail.jpg",
  },
  {
    id: "photorealistic",
    label: "Photorealistic",
    thumbnail:
      "https://static.tickpick.com/media-vault/organizer/event-creation/photorealistic-thumbnail.jpg",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    thumbnail:
      "https://static.tickpick.com/media-vault/organizer/event-creation/hybrid-thumbnail.jpg",
  },
];

const TEXT_MAX_LENGTH = 60;
const CUSTOM_INSTRUCTIONS_MAX_LENGTH = 200;

// ============================================================================
// Animation Config
// ============================================================================

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

// ============================================================================
// Context Hint Component
// ============================================================================

interface ContextHintProps {
  eventContext: Pick<BannerEventContext, "title" | "description">;
  onClose: () => void;
  onFocusTitleInput?: () => void;
  onOpenDescriptionModal?: () => void;
}

function ContextHint({
  eventContext,
  onClose,
  onFocusTitleInput,
  onOpenDescriptionModal,
}: ContextHintProps) {
  if (eventContext.title && eventContext.description) {
    return null;
  }

  const handleTitleClick = () => {
    onClose();
    onFocusTitleInput?.();
  };

  const handleDescriptionClick = () => {
    onClose();
    onOpenDescriptionModal?.();
  };

  const renderMissingFields = () => {
    if (!eventContext.title && !eventContext.description) {
      return (
        <>
          an{" "}
          <button
            type="button"
            onClick={handleTitleClick}
            className="underline hover:opacity-80 transition-opacity duration-200 ease cursor-pointer"
          >
            event title
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={handleDescriptionClick}
            className="underline hover:opacity-80 transition-opacity duration-200 ease cursor-pointer"
          >
            description
          </button>
        </>
      );
    }

    if (!eventContext.title) {
      return (
        <>
          an{" "}
          <button
            type="button"
            onClick={handleTitleClick}
            className="underline hover:opacity-80 transition-opacity duration-200 ease cursor-pointer"
          >
            event title
          </button>
        </>
      );
    }

    return (
      <>
        an event{" "}
        <button
          type="button"
          onClick={handleDescriptionClick}
          className="underline hover:opacity-80 transition-opacity duration-200 ease cursor-pointer"
        >
          description
        </button>
      </>
    );
  };

  return (
    <div className="px-4 md:px-6 pb-2">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-[14px] bg-[#FFB222]/10">
        <CircleAlert className="w-4 h-4 text-[#FFB222] shrink-0" />
        <p className="text-sm text-black">
          For better results, add {renderMissingFields()}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BannerGeneratorModal({
  open,
  onOpenChange,
  onGenerate,
  eventContext,
  onOpenDescriptionModal,
  onFocusTitleInput,
}: BannerGeneratorModalProps) {
  // View state
  const [view, setView] = useState<ModalView>("style-selection");

  // Form state
  const [selectedStyle, setSelectedStyle] = useState<Style>("illustration");
  const [textOverlay, setTextOverlay] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [adjustments, setAdjustments] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setView("style-selection");
        setSelectedStyle("illustration");
        setTextOverlay("");
        setCustomInstructions("");
        setAdjustments("");
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
          style: selectedStyle,
          textOverlay: textOverlay || undefined,
          customInstructions: customInstructions || undefined,
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

    // Combine original instructions with adjustments
    const combinedInstructions = [customInstructions, adjustments]
      .filter(Boolean)
      .join(". ");

    try {
      const response = await fetch("/api/generate-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          textOverlay: textOverlay || undefined,
          customInstructions: combinedInstructions || undefined,
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
        // Update customInstructions to include adjustments for next regeneration
        if (adjustments) {
          setCustomInstructions(combinedInstructions);
          setAdjustments("");
        }
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
    setAdjustments("");
    setView("style-selection");
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;

    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = `banner-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[420px] mx-2 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="banner-modal-header"
              className="flex flex-col items-center justify-center pb-2 pt-8 px-5 relative"
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
            <div className="px-4 md:px-6 py-4 flex flex-col gap-4 w-full">
              {/* Style Selection */}
              <div>
                <label className="block text-sm font-bold text-black">
                  Style
                </label>
                <div className="pt-2">
                  <div className="grid grid-cols-3 gap-3">
                    {STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full">
                          <div className="w-full aspect-3/2 rounded-lg overflow-hidden bg-light-gray">
                            <img
                              src={style.thumbnail}
                              alt={style.label}
                              className={`w-full h-full object-cover transition-all duration-200 ease ${
                                selectedStyle === style.id
                                  ? "grayscale-0 scale-100"
                                  : "grayscale group-hover:grayscale-0 group-hover:scale-105"
                              }`}
                            />
                          </div>
                          {/* Checkmark Badge */}
                          {selectedStyle === style.id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-tp-blue rounded-full flex items-center justify-center shadow-sm z-10"
                            >
                              <Check
                                className="w-3 h-3 text-white"
                                strokeWidth={3}
                              />
                            </motion.div>
                          )}
                        </div>
                        {/* Label */}
                        <span
                          className={`text-xs font-medium transition-colors duration-200 ease ${
                            selectedStyle === style.id
                              ? "text-black"
                              : "text-gray group-hover:text-dark-gray"
                          }`}
                        >
                          {style.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="block text-sm font-bold text-black">
                  Additional instructions
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  maxLength={CUSTOM_INSTRUCTIONS_MAX_LENGTH}
                  placeholder="outdoor, no people, minimal style..."
                  rows={3}
                  className="w-full px-3 py-2 pr-16 border border-neutral-200 rounded-[14px] text-base text-black placeholder:text-gray/80 focus:outline-none focus:border-tp-blue/40 focus:ring-[3px] focus:ring-tp-blue/20 transition-all duration-200 ease resize-none"
                />
              </div>
              {/* Text Overlay Input */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-sm font-bold text-black">
                    Overlay text
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Overlay text info"
                        className="cursor-default"
                      >
                        <CircleHelp className="w-4 h-4 text-gray" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                      This text will appear on top of the image
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    maxLength={TEXT_MAX_LENGTH}
                    placeholder="event title, date, time, location"
                    className="w-full h-[47px] px-4 pr-16 border border-neutral-200 rounded-[14px] text-base text-black placeholder:text-gray/80 focus:outline-none focus:border-tp-blue/40 focus:ring-[3px] focus:ring-tp-blue/20 transition-all duration-200 ease"
                  />
                </div>
              </div>
            </div>

            {/* Context Hint */}
            <ContextHint
              eventContext={eventContext}
              onClose={handleClose}
              onFocusTitleInput={onFocusTitleInput}
              onOpenDescriptionModal={onOpenDescriptionModal}
            />

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
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[520px] mx-2 pointer-events-auto"
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
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[580px] mx-2 pointer-events-auto"
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
              <div className="aspect-5/2 rounded-[16px] overflow-hidden bg-light-gray relative group">
                {generatedImageUrl && (
                  <>
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
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              // Resize action placeholder
                            }}
                            className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-[10px] flex items-center justify-center transition-all duration-200 ease cursor-pointer"
                            aria-label="Resize banner"
                          >
                            <Scaling className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Resize</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleDownload}
                            className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-[10px] flex items-center justify-center transition-all duration-200 ease cursor-pointer"
                            aria-label="Download banner"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Download</TooltipContent>
                      </Tooltip>
                    </div>
                  </>
                )}
              </div>

              {/* Adjust Input */}
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">
                  Adjust
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adjustments}
                    onChange={(e) => setAdjustments(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleRegenerate();
                      }
                    }}
                    placeholder="More vibrant colors, add confetti..."
                    className="w-full h-[50px] pl-4 pr-14 border border-neutral-200 rounded-full text-base text-black placeholder:text-gray/80 focus:outline-none focus:border-tp-blue/40 focus:ring-[3px] focus:ring-tp-blue/20 transition-all duration-200 ease"
                  />
                  <button
                    onClick={handleRegenerate}
                    className="w-[40px] h-[40px] flex items-center justify-center bg-tp-blue hover:bg-[#2288ee] text-white rounded-full transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform absolute right-[5px] top-1/2 -translate-y-1/2 shadow-md"
                    aria-label="Regenerate banner"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
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
