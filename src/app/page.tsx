"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  MapPin,
  Users,
  FileText,
  CircleHelp,
  Check,
  ChevronLeft,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import { DescriptionModal } from "@/components/description-modal";
import { CapacityModal } from "@/components/capacity-modal";

type VisibilityOption = "public" | "private" | "draft";

export default function EventCreationPage() {
  const [visibility, setVisibility] = useState<VisibilityOption>("public");
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2024, 11, 3) // Dec 3, 2024
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("3:00 PM");
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const [showEndDate, setShowEndDate] = useState<boolean>(false);
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [capacity, setCapacity] = useState<string>("");
  const [capacityModalOpen, setCapacityModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEventImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setEventImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // When showEndDate is toggled off, sync endDate to startDate and clear endTime
  const handleShowEndDateChange = (checked: boolean) => {
    setShowEndDate(checked);
    if (!checked) {
      setEndDate(startDate);
      setEndTime(undefined);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return format(date, "EEE, MMM d");
  };

  return (
    <div className="min-h-screen bg-light-gray md:p-2.5">
      {/* Main Content Card */}
      <div className="bg-white md:rounded-[20px] shadow-card min-h-[calc(100vh-20px)] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-4 py-3 border-b border-light-gray relative">
          <button className="flex items-center gap-2.5 px-2 py-2 rounded-full hover:bg-light-gray transition-colors duration-200 ease">
            <div className="w-[22px] h-[22px] bg-mid-gray rounded-full flex items-center justify-center">
              <ChevronLeft className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="font-semibold text-sm text-black">Main menu</span>
          </button>
          <h1 className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-black">
            New Event
          </h1>
          <div className="hidden sm:block w-[100px]" />{" "}
          {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 flex justify-center px-4 py-4 md:px-8 md:py-8">
          <div className="w-full max-w-[1000px] flex flex-col lg:flex-row gap-3 lg:gap-8">
            {/* Left Column - Event Image */}
            <div className="w-full lg:flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                onClick={() => !eventImage && fileInputRef.current?.click()}
                className={`aspect-5/2 bg-light-gray rounded-none md:rounded-2xl relative overflow-hidden group -mx-4 -mt-4 md:mx-0 md:mt-0 ${
                  !eventImage ? "cursor-pointer" : ""
                }`}
              >
                {eventImage ? (
                  <>
                    {/* Image Preview */}
                    <Image
                      src={eventImage}
                      alt="Event cover"
                      fill
                      className="object-cover"
                    />
                    {/* Overlay with actions on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 ease flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      {/* Replace image button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="cursor-pointer w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
                      >
                        <RefreshCcw
                          className="w-5 h-5 text-black"
                          strokeWidth={2}
                        />
                      </button>
                      {/* Delete image button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="group/delete cursor-pointer w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
                      >
                        <Trash2
                          className="w-5 h-5 text-black group-hover/delete:text-tp-red transition-colors duration-200 ease"
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

                    {/* Plus button */}
                    <button className="cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38px] h-[38px] bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                      <Plus className="w-5 h-5 text-black" strokeWidth={2} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-[500px] flex flex-col gap-6 lg:gap-8">
              {/* Event Title & DateTime Section */}
              <div className="flex flex-col gap-5">
                {/* Event Title Input */}
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event Title"
                  className="font-black text-[24px] md:text-[30px] text-black placeholder:text-mid-gray bg-transparent border-none outline-none w-full"
                />

                {/* DateTime Card */}
                <div className="bg-white border rounded-[18px] p-3.5 overflow-hidden">
                  {/* Start Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-0 sm:justify-between pb-3.5 border-b">
                    <div className="pl-1">
                      <span className="font-bold text-sm text-dark-gray">
                        Start
                      </span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-[300px]">
                      {/* Start Date Picker */}
                      <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <button className="flex-1 h-10 bg-light-gray rounded-[10px] flex items-center justify-center px-4 overflow-hidden hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer">
                            <span className="font-bold text-base text-black truncate">
                              {formatDate(startDate) || "Select date"}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 rounded-[20px]"
                          align="end"
                          sideOffset={8}
                        >
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              setStartDateOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Start Time Picker */}
                      <TimePicker
                        value={startTime}
                        onChange={(time) => time && setStartTime(time)}
                        placeholder="Select time"
                      />
                    </div>
                  </div>

                  {/* End Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-0 sm:justify-between pt-3.5">
                    <div className="flex items-center gap-2">
                      <div className="pl-1">
                        <span className="font-bold text-sm text-dark-gray">
                          End
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Switch
                            checked={showEndDate}
                            onCheckedChange={handleShowEndDateChange}
                            aria-label="Toggle end date"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {showEndDate
                            ? "End date and time are visible on the event page"
                            : "End date and time are hidden on the event page"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div
                      className={`gap-2 w-full sm:w-[300px] ${
                        showEndDate ? "flex" : "hidden sm:flex"
                      }`}
                    >
                      {/* End Date Picker */}
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild disabled={!showEndDate}>
                          <button
                            className={`flex-1 h-10 bg-light-gray rounded-[10px] flex items-center justify-center px-4 overflow-hidden transition-colors duration-200 ease ${
                              showEndDate
                                ? "hover:bg-soft-gray cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!showEndDate}
                          >
                            <span
                              className={`font-bold text-base truncate ${
                                showEndDate ? "text-black" : "text-gray"
                              }`}
                            >
                              {formatDate(endDate) ||
                                formatDate(startDate) ||
                                "Select date"}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 rounded-[20px]"
                          align="end"
                          sideOffset={8}
                        >
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              setEndDateOpen(false);
                            }}
                            disabled={(date) =>
                              startDate ? date < startDate : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* End Time Picker */}
                      <TimePicker
                        value={endTime}
                        onChange={setEndTime}
                        placeholder="--:-- --"
                        disabled={!showEndDate}
                        allowClear
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <ActionButton
                    icon={<MapPin className="w-4 h-4" />}
                    label="Event Location"
                  />
                  {capacity ? (
                    <CapacityDisplay
                      capacity={capacity}
                      onClick={() => setCapacityModalOpen(true)}
                    />
                  ) : (
                    <ActionButton
                      icon={<Users className="w-4 h-4" />}
                      label="Capacity"
                      onClick={() => setCapacityModalOpen(true)}
                    />
                  )}
                  {description ? (
                    <DescriptionDisplay
                      description={description}
                      onClick={() => setDescriptionModalOpen(true)}
                    />
                  ) : (
                    <ActionButton
                      icon={<FileText className="w-4 h-4" />}
                      label="Description"
                      onClick={() => setDescriptionModalOpen(true)}
                    />
                  )}
                </div>
              </div>

              {/* Tickets Section */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-sm text-black">Tickets</label>
                <ActionButton
                  icon={<Plus className="w-4 h-4" />}
                  label="Admission Tickets"
                />
              </div>

              {/* Visibility Section */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1 h-5">
                  <label className="font-bold text-sm text-black">
                    Visibility
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Visibility options info"
                        className="cursor-default"
                      >
                        <CircleHelp className="w-4 h-4 text-gray" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                      <div className="flex flex-col gap-1.5">
                        <p>
                          <span className="font-semibold">Public:</span>{" "}
                          Searchable on TickPick Marketplace.
                        </p>
                        <p>
                          <span className="font-semibold">Private:</span> Only
                          accessible via link.
                        </p>
                        <p>
                          <span className="font-semibold">Draft:</span> Saved,
                          but not ready for purchase.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-3">
                  <VisibilityRadio
                    label="Public"
                    selected={visibility === "public"}
                    onClick={() => setVisibility("public")}
                  />
                  <VisibilityRadio
                    label="Private"
                    selected={visibility === "private"}
                    onClick={() => setVisibility("private")}
                  />
                  <VisibilityRadio
                    label="Draft"
                    selected={visibility === "draft"}
                    onClick={() => setVisibility("draft")}
                  />
                </div>
              </div>

              {/* Create Event Button */}
              <button className="w-full h-[50px] mt-3 bg-tp-blue text-white font-bold text-base rounded-[36px] flex items-center justify-center hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform">
                Create Event
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Description Modal */}
      <DescriptionModal
        open={descriptionModalOpen}
        onOpenChange={setDescriptionModalOpen}
        value={description}
        onChange={setDescription}
      />

      {/* Capacity Modal */}
      <CapacityModal
        open={capacityModalOpen}
        onOpenChange={setCapacityModalOpen}
        value={capacity}
        onChange={setCapacity}
      />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[47px] cursor-pointer rounded-[14px] flex items-center justify-center gap-2 px-4 py-2 transition-colors duration-200 ease bg-light-gray hover:bg-soft-gray"
    >
      {icon}
      <span className="font-bold text-base text-black">{label}</span>
    </button>
  );
}

function DescriptionDisplay({
  description,
  onClick,
}: {
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-[14px] flex items-start gap-3 px-4 py-3 transition-colors duration-200 ease bg-light-gray hover:bg-soft-gray text-left"
    >
      <FileText className="w-4 h-4 text-black mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-bold text-sm text-black">Description</span>
        <span className="text-sm text-dark-gray line-clamp-2">
          {description}
        </span>
      </div>
    </button>
  );
}

function CapacityDisplay({
  capacity,
  onClick,
}: {
  capacity: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-[14px] flex items-start gap-3 px-4 py-3 transition-colors duration-200 ease bg-light-gray hover:bg-soft-gray text-left"
    >
      <Users className="w-4 h-4 text-black mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-bold text-sm text-black">Capacity</span>
        <span className="text-sm text-dark-gray">{capacity}</span>
      </div>
    </button>
  );
}

function VisibilityRadio({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-3 sm:p-4 cursor-pointer rounded-2xl flex items-center justify-center relative transition-shadow duration-200 ease ${
        selected
          ? "shadow-[inset_0_0_0_1.5px_var(--color-tp-blue)]"
          : "shadow-[inset_0_0_0_1px_var(--color-neutral-200)] hover:shadow-[inset_0_0_0_1px_var(--color-mid-gray)]"
      }`}
    >
      <span className="font-open-sans font-semibold text-sm text-black">
        {label}
      </span>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className="absolute bottom-2 right-2 w-[18px] h-[18px] bg-tp-blue rounded-full flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
