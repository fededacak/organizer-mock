"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  layoutId?: string;
}

export function ImageLightbox({
  images,
  selectedIndex,
  onClose,
  onNavigate,
  layoutId,
}: ImageLightboxProps) {
  const isOpen = selectedIndex !== null;

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex =
          selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
        onNavigate(prevIndex);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex =
          selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
        onNavigate(nextIndex);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, images.length, onClose, onNavigate]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    const prevIndex =
      selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    onNavigate(prevIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    const nextIndex =
      selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    onNavigate(nextIndex);
  };

  return (
    <AnimatePresence>
      {isOpen && selectedIndex !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
          />

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 ease cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation - Previous */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 ease cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Navigation - Next */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 ease cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image container with layout animation */}
          <motion.div
            layoutId={layoutId}
            className="relative w-[90vw] h-[90vh] max-w-[1400px] cursor-default"
            onClick={(e) => e.stopPropagation()}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <Image
              src={images[selectedIndex]}
              alt={`Image ${selectedIndex + 1} of ${images.length}`}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </motion.div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
