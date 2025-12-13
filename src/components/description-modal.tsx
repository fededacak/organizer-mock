"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, RefreshCw, ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

// ============================================================================
// Types
// ============================================================================

export interface EventContext {
  title?: string;
  startDate?: Date;
  startTime?: string;
  endDate?: Date;
  endTime?: string;
  location?: string;
  capacity?: string;
}

interface DescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  eventContext?: EventContext;
}

type ModalView = "description" | "ai-helper" | "ai-preview";

// ============================================================================
// API Helper: Serialize EventContext for API
// ============================================================================

function serializeEventContext(context: EventContext) {
  return {
    title: context.title,
    startDate: context.startDate
      ? format(context.startDate, "EEEE, MMMM d, yyyy")
      : undefined,
    startTime: context.startTime,
    endDate: context.endDate
      ? format(context.endDate, "EEEE, MMMM d, yyyy")
      : undefined,
    endTime: context.endTime,
    location: context.location,
  };
}

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

export function DescriptionModal({
  open,
  onOpenChange,
  value,
  onChange,
  eventContext = {},
}: DescriptionModalProps) {
  // View state
  const [view, setView] = useState<ModalView>("description");

  // AI Helper state
  const [useExistingText, setUseExistingText] = useState(true);
  const [instructions, setInstructions] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasExistingText = value.trim().length > 0;

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Small delay to let close animation finish
      const timer = setTimeout(() => {
        setView("description");
        setInstructions("");
        setIsGenerating(false);
        setGeneratedContent(null);
        setUseExistingText(true);
        setError(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handlers
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleOpenAI = () => {
    setUseExistingText(hasExistingText);
    setView("ai-helper");
  };

  const handleCancelAI = () => {
    abortControllerRef.current?.abort();
    setView("description");
    setInstructions("");
    setIsGenerating(false);
    setGeneratedContent(null);
    setError(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedContent("");
    abortControllerRef.current = new AbortController();

    // Transition to preview view immediately to show streaming text
    setView("ai-preview");

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: serializeEventContext(eventContext),
          instructions: instructions || undefined,
          existingText: useExistingText && hasExistingText ? value : undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate description");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        if (abortControllerRef.current?.signal.aborted) {
          reader.cancel();
          break;
        }

        const text = decoder.decode(chunk, { stream: true });
        setGeneratedContent((prev) => (prev || "") + text);
      }

      // Clear instructions after successful generation so "Adjust" field starts empty
      setInstructions("");
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        // User cancelled - discard partial content and go back
        setGeneratedContent(null);
        setView("ai-helper");
        return;
      }

      // Show error and stay on ai-helper view
      const message =
        err instanceof Error ? err.message : "Failed to generate description";
      setError(message);
      setGeneratedContent(null);
      setView("ai-helper");
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsGenerating(false);
      }
    }
  };

  const handleRegenerate = () => {
    setError(null);
    handleGenerate();
  };

  const handleApply = () => {
    if (generatedContent) {
      onChange(generatedContent);
    }
    setView("description");
    setInstructions("");
    setGeneratedContent(null);
  };

  const handleDiscardPreview = () => {
    abortControllerRef.current?.abort();
    setGeneratedContent(null);
    setIsGenerating(false);
    setView("ai-helper");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      if (view === "ai-helper") {
        handleGenerate();
      } else if (view === "ai-preview") {
        handleApply();
      }
    }
    if (e.key === "Escape") {
      if (view === "ai-preview") {
        handleDiscardPreview();
      } else if (view === "ai-helper") {
        handleCancelAI();
      } else {
        handleClose();
      }
    }
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

      {/* Modal Container - centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* ============================================================ */}
        {/* Description Modal */}
        {/* ============================================================ */}
        {view === "description" && (
          <motion.div
            layoutId="modal-container"
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[600px] mx-4 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="modal-header"
              className="flex items-center justify-center pb-2 pt-8 px-5 relative"
              transition={springTransition}
            >
              <motion.h2
                layoutId="modal-title"
                className="font-outfit font-extrabold text-[20px] text-black"
                transition={springTransition}
              >
                Event Description
              </motion.h2>
              <motion.button
                layoutId="close-button"
                onClick={handleClose}
                className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                transition={springTransition}
              >
                <X className="w-4 h-4 text-gray" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="relative bg-white border border-neutral-200 rounded-[16px] overflow-hidden">
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Enter event description..."
                  className="w-full h-[262px] px-4 py-3.5 pb-6 pr-10 text-base text-black placeholder:text-gray/80 resize-none focus:outline-none transition-all duration-200 ease"
                />
                <button
                  onClick={handleOpenAI}
                  className="btn-shimmer absolute bottom-2 text-dark-gray right-2 flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 bg-light-gray hover:bg-soft-gray rounded-full transition-all duration-200 ease cursor-pointer border border-border/20 active:scale-[0.98] hover:text-black"
                  aria-label="Write with AI"
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="font-bold text-xs">Write with AI</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              layoutId="modal-footer"
              className="flex justify-end pb-6 pt-2 px-6"
              transition={springTransition}
            >
              <motion.button
                layoutId="primary-button"
                onClick={handleClose}
                className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform"
                transition={springTransition}
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* AI Helper Modal */}
        {/* ============================================================ */}
        {view === "ai-helper" && (
          <motion.div
            layoutId="modal-container"
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[460px] mx-4 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="modal-header"
              className="flex items-center justify-center pb-2 pt-8 px-5 relative"
              transition={springTransition}
            >
              <motion.h2
                layoutId="modal-title"
                className="font-outfit font-extrabold text-[20px] text-black"
                transition={springTransition}
              >
                Write with AI
              </motion.h2>
              <motion.button
                layoutId="close-button"
                onClick={handleClose}
                className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                transition={springTransition}
              >
                <X className="w-4 h-4 text-gray" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[12px]">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Existing Text Toggle */}
              {hasExistingText && (
                <div className="rounded-[16px] border border-neutral-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-light-gray/50">
                    <span className="text-sm font-bold text-black">
                      Use current description for context
                    </span>
                    <Switch
                      checked={useExistingText}
                      onCheckedChange={setUseExistingText}
                    />
                  </div>
                  {useExistingText && (
                    <div className="px-4 py-3 border-t border-neutral-200 bg-white">
                      <p className="text-sm text-dark-gray line-clamp-3 leading-relaxed">
                        {value}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions Input */}
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    useExistingText && hasExistingText
                      ? "How would you like to improve this description?"
                      : "Describe the tone, style, or key points to include..."
                  }
                  className="w-full h-[120px] px-4 py-3.5 text-base text-black placeholder:text-gray/80 resize-none border border-neutral-200 rounded-[16px] focus:outline-none focus:border-tp-blue/40 focus:ring-[3px] focus:ring-tp-blue/20 transition-all duration-200 ease"
                  autoFocus
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Footer */}
            <motion.div
              layoutId="modal-footer"
              className="flex justify-between pb-6 pt-2 px-6"
              transition={springTransition}
            >
              <motion.button
                layoutId="secondary-button"
                onClick={handleCancelAI}
                className="flex items-center gap-1 text-base font-bold text-black bg-light-gray hover:bg-soft-gray rounded-[36px] px-5 pl-4 py-2.5 transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                transition={springTransition}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
              <motion.button
                layoutId="primary-button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 pl-4 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform disabled:opacity-70 flex items-center gap-2"
                transition={springTransition}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {useExistingText && hasExistingText
                      ? "Improving..."
                      : "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    {useExistingText && hasExistingText
                      ? "Improve"
                      : "Generate"}
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* AI Preview Modal */}
        {/* ============================================================ */}
        {view === "ai-preview" && (
          <motion.div
            layoutId="modal-container"
            className="bg-white rounded-[24px] shadow-lg w-full max-w-[520px] mx-4 pointer-events-auto"
            transition={springTransition}
          >
            {/* Header */}
            <motion.div
              layoutId="modal-header"
              className="flex items-center justify-center pb-2 pt-8 px-5 relative"
              transition={springTransition}
            >
              <motion.h2
                layoutId="modal-title"
                className="font-outfit font-extrabold text-[20px] text-black"
                transition={springTransition}
              >
                Write with AI
              </motion.h2>
              <motion.button
                layoutId="close-button"
                onClick={handleClose}
                className="absolute right-3 top-3 w-6 h-6 bg-light-gray rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
                transition={springTransition}
              >
                <X className="w-4 h-4 text-gray" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Generated Content Preview */}
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">
                  New description
                </label>
                <div className="max-h-[180px] overflow-y-auto px-4 py-3.5 bg-light-gray rounded-[16px] border border-border/20">
                  {isGenerating && !generatedContent ? (
                    <div className="flex items-center gap-1.5 text-sm text-dark-gray">
                      <span className="w-2 h-2 bg-tp-blue rounded-full animate-pulse" />
                      <span>Thinking</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-dark-gray rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1 h-1 bg-dark-gray rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1 h-1 bg-dark-gray rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                      {generatedContent}
                      {isGenerating && (
                        <span className="inline-block w-[2px] h-[1em] bg-tp-blue ml-0.5 animate-pulse align-middle" />
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Instructions with Regenerate */}
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">
                  Adjust
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Make it shorter, mention dress code..."
                    className="w-full h-[50px] pl-4 pr-14 border border-neutral-200 rounded-full text-base text-black placeholder:text-gray/80 focus:outline-none focus:border-tp-blue/40 focus:ring-[3px] focus:ring-tp-blue/20 transition-all duration-200 ease"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="w-[40px] h-[40px] flex items-center justify-center bg-tp-blue hover:bg-[#2288ee] text-white rounded-full transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform disabled:opacity-70 absolute right-[5px] top-1/2 -translate-y-1/2 shadow-md"
                    aria-label="Regenerate description"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              layoutId="modal-footer"
              className="flex justify-end gap-3 pb-6 pt-2 px-6"
              transition={springTransition}
            >
              <motion.button
                layoutId="secondary-button"
                onClick={handleDiscardPreview}
                className="px-5 py-2.5 text-base font-bold text-dark-gray hover:text-black bg-light-gray hover:bg-soft-gray rounded-[36px] transition-colors duration-200 ease cursor-pointer active:scale-[0.98] transform"
                transition={springTransition}
              >
                Discard
              </motion.button>
              <motion.button
                layoutId="primary-button"
                onClick={handleApply}
                disabled={isGenerating}
                className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform disabled:opacity-70"
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
