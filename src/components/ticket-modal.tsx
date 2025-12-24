"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Ticket {
  id: string;
  name: string;
  quantity: string;
  linkToCapacity: boolean;
  price: string;
  feeOption: "pass_to_buyer" | "absorb";
  details: string;
}

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onSave: (ticket: Ticket) => void;
  eventCapacity: string;
}

const FEE_OPTIONS = [
  { value: "pass_to_buyer", label: "Pass fees to buyer" },
  { value: "absorb", label: "Absorb fees" },
] as const;

// Platform fee percentage (example: 10%)
const PLATFORM_FEE_PERCENT = 0.1;

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
  const [price, setPrice] = useState("");
  const [feeOption, setFeeOption] = useState<"pass_to_buyer" | "absorb">(
    "pass_to_buyer"
  );
  const [details, setDetails] = useState("");
  const [feePopoverOpen, setFeePopoverOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const isEditing = ticket !== null;

  // Reset form when modal opens/closes or ticket changes
  useEffect(() => {
    if (open) {
      if (ticket) {
        setName(ticket.name);
        setQuantity(ticket.quantity);
        setLinkToCapacity(ticket.linkToCapacity);
        setPrice(ticket.price);
        setFeeOption(ticket.feeOption);
        setDetails(ticket.details);
      } else {
        setName("");
        setQuantity("");
        setLinkToCapacity(false);
        setPrice("");
        setFeeOption("pass_to_buyer");
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Only allow one decimal point
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setPrice(value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (linkToCapacity) return;
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setQuantity(numericValue);
  };

  // Calculate fees
  const priceNum = parseFloat(price) || 0;
  const platformFee = priceNum * PLATFORM_FEE_PERCENT;

  let youGet = 0;
  let buyerPays = 0;

  if (feeOption === "pass_to_buyer") {
    youGet = priceNum;
    buyerPays = priceNum + platformFee;
  } else {
    youGet = priceNum - platformFee;
    buyerPays = priceNum;
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleSave = () => {
    const ticketData: Ticket = {
      id: ticket?.id || `ticket_${Date.now()}`,
      name: name.trim() || "General Admission",
      quantity,
      linkToCapacity,
      price,
      feeOption,
      details,
    };
    onSave(ticketData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-16px)] max-h-[85vh] flex flex-col sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Ticket" : "New Ticket"}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

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
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-black">
                Available quantity
              </label>
              <button
                type="button"
                onClick={() => setLinkToCapacity(!linkToCapacity)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors duration-200 ease ${
                    linkToCapacity
                      ? "bg-tp-blue border-tp-blue"
                      : "border-dark-gray"
                  }`}
                >
                  {linkToCapacity && (
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-semibold text-black">
                  Link to{" "}
                  <span className="text-tp-blue underline">event capacity</span>
                </span>
              </button>
            </div>
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
          <div className="bg-light-gray rounded-[20px] p-4 flex flex-col gap-3">
            {/* Price per unit */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">
                Price per unit ($)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={price ? `$${price}` : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace("$", "");
                    handlePriceChange({
                      target: { value: val },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="$0.00"
                  className="w-full h-[47px] px-4 pr-[160px] text-sm text-black placeholder:text-gray bg-white rounded-[16px] focus:outline-none focus:ring-1 focus:ring-tp-blue transition-all duration-200 ease"
                />
                {/* Fee option dropdown */}
                <Popover open={feePopoverOpen} onOpenChange={setFeePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-[5px] top-1/2 -translate-y-1/2 h-[37px] px-3 bg-light-gray rounded-[12px] flex items-center gap-4 cursor-pointer hover:bg-soft-gray transition-colors duration-200 ease"
                    >
                      <span className="text-xs font-semibold text-black">
                        {FEE_OPTIONS.find((o) => o.value === feeOption)?.label}
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-80" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[180px] p-1 rounded-[12px]"
                    align="end"
                    sideOffset={4}
                  >
                    {FEE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFeeOption(option.value);
                          setFeePopoverOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm rounded-[8px] cursor-pointer transition-colors duration-200 ease ${
                          feeOption === option.value
                            ? "bg-light-gray font-semibold"
                            : "hover:bg-light-gray"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Summary line */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-black">
                  You get: {formatCurrency(youGet)}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="cursor-default">
                      <Info className="w-5 h-5 text-gray" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Amount you receive after fees</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs font-bold text-mid-gray">|</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-black">
                  Buyer pays: {formatCurrency(buyerPays)}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="cursor-default">
                      <Info className="w-5 h-5 text-gray" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Total amount the buyer will pay</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Details Field */}
          <div className="flex flex-col gap-1">
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
            <span className="font-bold text-sm text-black">
              Advanced Settings
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                advancedOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {advancedOpen && (
            <div className="bg-light-gray rounded-[16px] p-4">
              <p className="text-sm text-dark-gray">
                Advanced settings coming soon...
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 md:px-6">
          <button
            onClick={handleSave}
            className="bg-tp-blue cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform"
          >
            {isEditing ? "Save" : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

