"use client";

import { Plus, RefreshCcw, Trash2, Upload, Wand2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface EventBannerUploadProps {
  image: string | null;
  onImageChange: (url: string | null) => void;
  onOpenBannerModal: () => void;
}

export function EventBannerUpload({
  image,
  onImageChange,
  onOpenBannerModal,
}: EventBannerUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full lg:flex-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className="aspect-5/2 bg-light-gray rounded-none md:rounded-2xl relative overflow-hidden group -mx-4 -mt-4 md:mx-0 md:mt-0">
        {image ? (
          <>
            {/* Image Preview */}
            <Image
              src={image}
              alt="Event cover"
              fill
              className="object-cover"
            />
            {/* Overlay with actions on hover (always visible on touch devices, positioned bottom-right without overlay) */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 ease flex items-center justify-center [@media(hover:none)]:items-end [@media(hover:none)]:justify-end [@media(hover:none)]:p-3 gap-2.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
              {/* Replace image button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="cursor-pointer w-[42px] h-[42px] md:w-[38px] md:h-[38px] bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              >
                <RefreshCcw
                  className="w-5 h-5 md:w-4 md:h-4 text-black"
                  strokeWidth={2}
                />
              </button>
              {/* Delete image button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="group/delete cursor-pointer w-[42px] h-[42px] md:w-[38px] md:h-[38px] bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              >
                <Trash2
                  className="w-5 h-5 md:w-4 md:h-4 text-black group-hover/delete:text-tp-red transition-colors duration-200 ease"
                  strokeWidth={2}
                />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Decorative wave pattern */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 614 246"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0 246V180C80 190 160 160 240 140C320 120 400 110 480 100C560 90 614 80 614 80V246H0Z"
                fill="rgba(209, 209, 209, 0.15)"
              />
              <path
                d="M0 246V200C100 210 200 180 300 160C400 140 500 130 614 120V246H0Z"
                fill="rgba(209, 209, 209, 0.1)"
              />
            </svg>

            {/* Action buttons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center flex-col gap-2 w-full max-w-[186px]">
              {/* Upload image button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="cursor-pointer h-10 px-4 bg-white rounded-full shadow-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 w-full justify-center"
              >
                <Upload className="w-4 h-4  text-black" strokeWidth={2} />
                <span className=" text-base font-semibold text-black whitespace-nowrap">
                  Upload Image
                </span>
              </button>

              {/* Generate with AI button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBannerModal();
                }}
                className="btn-shimmer relative overflow-hidden cursor-pointer h-10 px-4 bg-white rounded-full shadow-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 w-full justify-center"
              >
                <Wand2 className="w-4 h-4 text-black" strokeWidth={2} />
                <span className="text-base font-semibold text-black whitespace-nowrap">
                  Generate with AI
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
