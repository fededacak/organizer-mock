"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";

interface DescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionModal({
  open,
  onOpenChange,
  value,
  onChange,
}: DescriptionModalProps) {
  const handleDone = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Event Description</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="bg-white border border-neutral-200 rounded-[16px] overflow-hidden">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter event description..."
              className="w-full h-[262px] px-4 py-3.5 text-base text-black placeholder:text-gray resize-none focus:outline-none"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleDone}
            className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform"
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
