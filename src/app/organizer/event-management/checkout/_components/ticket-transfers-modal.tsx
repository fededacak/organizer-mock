"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export type TransferPolicy = "until-event" | "days-before" | "never";

export interface TransferSettings {
  policy: TransferPolicy;
  cutoffDays: string;
}

interface TicketTransfersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: TransferSettings;
  onSave: (settings: TransferSettings) => void;
}

function CutoffDaysInput({
  value,
  onChange,
  selected,
  onFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  selected: boolean;
  onFocus: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selected) {
      const frame = requestAnimationFrame(() => ref.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [selected]);

  return (
    <input
      ref={ref}
      type="number"
      min={1}
      name="cutoff-days"
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder="5"
      aria-label="Number of days before event to close transfers"
      className="w-[48px] rounded-[8px] bg-white px-2 py-0.5 h-[24px] text-center text-base tabular-nums border text-black transition-colors duration-200 ease placeholder:text-gray focus-visible:outline-none focus-visible:border-tp-blue focus-visible:ring-2 focus-visible:ring-tp-blue/25 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

export function TicketTransfersModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: TicketTransfersModalProps) {
  const [draft, setDraft] = useState<TransferSettings>(settings);
  const isMobile = useIsMobile();

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraft(settings);
    }
    onOpenChange(next);
  }

  function handleSave() {
    onSave(draft);
    onOpenChange(false);
    toast.success("Transfer settings saved");
  }

  const setPolicy = (policy: TransferPolicy) =>
    setDraft((d) => ({ ...d, policy }));

  const isSaveDisabled =
    draft.policy === "days-before" &&
    (draft.cutoffDays === "" || Number(draft.cutoffDays) < 1);

  const formContent = (
    <div className="px-4 sm:px-6 pb-2 lg:pt-4 pt-6">
      <fieldset>
        <legend className="sr-only">Transfer policy</legend>

        <RadioGroup
          value={draft.policy}
          onValueChange={(v) => setPolicy(v as TransferPolicy)}
          className="gap-2"
        >
          {/* Until event starts */}
          <label
            htmlFor="modal-until-event"
            className="flex items-center gap-3 rounded-[16px] px-4 py-4 transition-colors duration-200 ease cursor-pointer border not-has-data-[state=checked]:hover:bg-light-gray has-data-[state=checked]:border-tp-blue"
          >
            <RadioGroupItem value="until-event" id="modal-until-event" />
            <span className="text-base text-black select-none">
              Until the event starts
            </span>
          </label>

          {/* X days before */}
          <label
            htmlFor="modal-days-before"
            className="flex items-center gap-3 rounded-[16px] px-4 py-4 transition-colors duration-200 ease border cursor-pointer not-has-data-[state=checked]:hover:bg-light-gray has-data-[state=checked]:border-tp-blue"
          >
            <RadioGroupItem value="days-before" id="modal-days-before" />
            <span className="flex items-center gap-1.5 text-base text-black select-none">
              Close
              <CutoffDaysInput
                value={draft.cutoffDays}
                onChange={(value) =>
                  setDraft((d) => ({ ...d, cutoffDays: value }))
                }
                selected={draft.policy === "days-before"}
                onFocus={() => setPolicy("days-before")}
              />
              days before the event
            </span>
          </label>

          {/* Never */}
          <label
            htmlFor="modal-never"
            className="flex items-center gap-3 rounded-[16px] px-4 py-4 transition-colors duration-200 ease cursor-pointer border not-has-data-[state=checked]:hover:bg-light-gray has-data-[state=checked]:border-tp-blue"
          >
            <RadioGroupItem value="never" id="modal-never" />
            <span className="text-base text-black select-none">Never</span>
          </label>
        </RadioGroup>
      </fieldset>
    </div>
  );

  const saveButton = (
    <Button
      onClick={handleSave}
      disabled={isSaveDisabled}
      className="h-11 px-6 w-full"
    >
      Save
    </Button>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          className="flex flex-col rounded-t-[20px] bg-white gap-0"
        >
          <SheetHeader className="px-4 pt-6 pb-0">
            <SheetTitle className="text-xl font-bold max-w-[85%] mx-auto text-pretty text-center leading-tight">
              When should transfers be allowed?
            </SheetTitle>
          </SheetHeader>
          {formContent}
          <SheetFooter className="px-4 pb-5">{saveButton}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            When should transfers be allowed?
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        {formContent}
        <DialogFooter className="pt-4 flex flex-col gap-3">
          {saveButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
