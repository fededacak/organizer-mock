"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";

interface CapacityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export function CapacityModal({
  open,
  onOpenChange,
  value,
  onChange,
}: CapacityModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSave = () => {
    onOpenChange(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Event Capacity</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="px-6 py-4">
          <p className="text-base text-dark-gray mb-4">
            Set the maximum number of attendees for your event. This capacity is
            shared across all ticket types linked to it.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-sm text-black">Capacity</label>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={handleInputChange}
              placeholder="Enter capacity..."
              className="w-full h-[52px] px-4 text-base text-black placeholder:text-gray bg-transparent focus:outline-none border rounded-[14px]"
            />
          </div>
        </div>

        <div className="flex justify-end pb-6 pt-2 px-6">
          <button
            onClick={handleSave}
            className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
