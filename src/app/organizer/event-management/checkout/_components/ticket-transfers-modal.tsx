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
import { Button } from "@/components/ui/button";

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

  if (!selected) {
    return <span className="text-base text-black select-none">X</span>;
  }

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
      placeholder="7"
      aria-label="Number of days before event to close transfers"
      className="w-[48px] rounded-[12px] border bg-white px-2 py-0.5 h-[38px] text-center text-base tabular-nums text-black transition-colors duration-200 ease placeholder:text-gray focus-visible:outline-none focus-visible:border-tp-blue focus-visible:ring-2 focus-visible:ring-tp-blue/25 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle className=" text-center">
            When should transfers be allowed?
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="px-6 pb-2 pt-4">
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

        <DialogFooter className="pt-4 flex flex-col gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="h-11 px-6 w-full"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
