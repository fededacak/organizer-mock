"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  PriceSelectionCard,
  type PricingType,
} from "@/components/price-selection-card";

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

export interface Ticket {
  id: string;
  name: string;
  quantity: string;
  linkToCapacity: boolean;
  pricingType: PricingType;
  price: string;
  feeOption: "pass_to_buyer" | "absorb";
  minimumPrice: string;
  details: string;
}

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onSave: (ticket: Ticket) => void;
  eventCapacity: string;
}

export function TicketModal({
  open,
  onOpenChange,
  ticket,
  onSave,
  eventCapacity,
}: TicketModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [linkToCapacity, setLinkToCapacity] = useState(false);
  const [pricingType, setPricingType] = useState<PricingType>("paid");
  const [price, setPrice] = useState("");
  const [feeOption, setFeeOption] = useState<"pass_to_buyer" | "absorb">(
    "pass_to_buyer"
  );
  const [minimumPrice, setMinimumPrice] = useState("");
  const [details, setDetails] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const isEditing = ticket !== null;

  // Reset form when modal opens/closes or ticket changes
  useEffect(() => {
    if (open) {
      if (ticket) {
        setName(ticket.name);
        setQuantity(ticket.quantity);
        setLinkToCapacity(ticket.linkToCapacity);
        setPricingType(ticket.pricingType);
        setPrice(ticket.price);
        setFeeOption(ticket.feeOption);
        setMinimumPrice(ticket.minimumPrice);
        setDetails(ticket.details);
      } else {
        setName("");
        setQuantity("");
        setLinkToCapacity(false);
        setPricingType("paid");
        setPrice("");
        setFeeOption("pass_to_buyer");
        setMinimumPrice("");
        setDetails("");
      }
      setAdvancedOpen(false);
    }
  }, [open, ticket]);

  // Sync quantity with event capacity when linked
  useEffect(() => {
    if (linkToCapacity && eventCapacity) {
      setQuantity(eventCapacity);
    }
  }, [linkToCapacity, eventCapacity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (linkToCapacity) return;
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setQuantity(numericValue);
  };

  const isMobile = useIsMobile();

  const handleSave = () => {
    const ticketData: Ticket = {
      id: ticket?.id || `ticket_${Date.now()}`,
      name: name.trim() || "General Admission",
      quantity,
      linkToCapacity,
      pricingType,
      price: pricingType === "free" ? "0" : price,
      feeOption,
      minimumPrice: pricingType === "pay_what_you_want" ? minimumPrice : "",
      details,
    };
    onSave(ticketData);
    onOpenChange(false);
  };

  const formContent = (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-5">
      {/* Name Field */}
      <div className="flex flex-col gap-1">
        <label className="font-bold text-sm text-black">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="General Admission"
          className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[16px] focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
        />
      </div>

      {/* Available Quantity Field */}
      <div className="flex flex-col gap-1">
        <label className="font-bold text-sm text-black">Quantity</label>
        <input
          type="text"
          inputMode="numeric"
          value={linkToCapacity ? eventCapacity || quantity : quantity}
          onChange={handleQuantityChange}
          placeholder=""
          disabled={linkToCapacity}
          className={`w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[16px] focus:outline-none focus:border-tp-blue transition-colors duration-200 ease ${
            linkToCapacity ? "opacity-60 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* Price Section */}
      <PriceSelectionCard
        pricingType={pricingType}
        onPricingTypeChange={setPricingType}
        price={price}
        onPriceChange={setPrice}
        feeOption={feeOption}
        onFeeOptionChange={setFeeOption}
        minimumPrice={minimumPrice}
        onMinimumPriceChange={setMinimumPrice}
      />

      {/* Details Field - Hidden on mobile, shown in Advanced Settings */}
      <div className="hidden sm:flex flex-col gap-1">
        <label className="font-bold text-sm text-black">Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder=""
          className="w-full h-[152px] px-4 py-3.5 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[16px] resize-none focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
        />
      </div>

      {/* Advanced Settings */}
      <button
        type="button"
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="self-start flex items-center gap-2 px-4 py-2 bg-light-gray rounded-[36px] cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
      >
        <span className="font-bold text-sm text-black">Advanced Settings</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            advancedOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {advancedOpen && (
        <div className="bg-light-gray rounded-[16px] p-4 flex flex-col gap-4">
          {/* Details Field - Only shown on mobile in Advanced Settings */}
          <div className="flex flex-col gap-1 sm:hidden">
            <label className="font-bold text-sm text-black">Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder=""
              className="w-full h-[152px] px-4 py-3.5 text-sm text-black placeholder:text-gray bg-white border border-neutral-200 rounded-[16px] resize-none focus:outline-none focus:border-tp-blue transition-colors duration-200 ease"
            />
          </div>
          <p className="text-sm text-dark-gray">
            Advanced settings coming soon...
          </p>
        </div>
      )}
    </div>
  );

  const saveButton = (
    <button
      onClick={handleSave}
      className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform"
    >
      {isEditing ? "Save" : "Create"}
    </button>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] flex flex-col rounded-t-[20px] bg-white"
        >
          <SheetHeader className="px-4 pt-4 pb-0">
            <SheetTitle className="text-lg font-bold text-center">
              {isEditing ? "Edit Ticket" : "New Ticket"}
            </SheetTitle>
          </SheetHeader>
          {formContent}
          <SheetFooter className="px-4 pb-4">{saveButton}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-16px)] max-h-[85vh] flex flex-col sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Ticket" : "New Ticket"}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        {formContent}
        <DialogFooter className="px-4 md:px-6">{saveButton}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
