"use client";

import { CapacityModal } from "@/components/capacity-modal";
import {
  DescriptionModal,
  type EventContext,
} from "@/components/description-modal";
import {
  LocationModal,
  type LocationData,
  type Venue,
} from "@/components/location-modal";
import { TicketModal, type Ticket } from "@/components/ticket-modal";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Copy,
  FileText,
  GripVertical,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type VisibilityOption = "public" | "private" | "draft";

// Hook to detect if viewport is mobile (< 640px / sm breakpoint)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

export default function EventCreationPage() {
  const isMobile = useIsMobile();
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
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [savedVenues, setSavedVenues] = useState<Venue[]>([
    {
      id: "venue_1",
      name: "Main Office",
      address: "100 Market Street, San Francisco, CA 94102",
    },
    {
      id: "venue_2",
      name: "Downtown Warehouse",
      address: "250 Brannan Street, San Francisco, CA 94107",
    },
  ]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
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

  const handleSaveVenue = (venue: Venue) => {
    setSavedVenues((prev) => [...prev, venue]);
  };

  const handleSaveTicket = (ticket: Ticket) => {
    setTickets((prev) => {
      const existingIndex = prev.findIndex((t) => t.id === ticket.id);
      if (existingIndex >= 0) {
        // Update existing ticket
        const updated = [...prev];
        updated[existingIndex] = ticket;
        return updated;
      }
      // Add new ticket
      return [...prev, ticket];
    });
    setEditingTicket(null);
  };

  const handleOpenTicketModal = (ticket?: Ticket) => {
    setEditingTicket(ticket || null);
    setTicketModalOpen(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const handleDuplicateTicket = (ticket: Ticket) => {
    const duplicatedTicket: Ticket = {
      ...ticket,
      id: `ticket_${Date.now()}`,
      name: `${ticket.name} (Copy)`,
    };
    setTickets((prev) => {
      const index = prev.findIndex((t) => t.id === ticket.id);
      const newTickets = [...prev];
      newTickets.splice(index + 1, 0, duplicatedTicket);
      return newTickets;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTickets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-light-gray md:p-2.5">
      {/* Main Content Card */}
      <div className="bg-white md:rounded-[20px] shadow-card md:h-[calc(100vh-20px)] md:max-h-[calc(100vh-20px)] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="relative shrink-0 bg-white flex items-center justify-between px-4 sm:px-2 py-2.5 md:py-3 border-b border-light-gray">
          {/* Mobile: TickPick Logo */}
          <div className="flex sm:hidden items-center">
            <Image
              src="/logo_tp.svg"
              alt="TickPick"
              width={120}
              height={27}
              priority
            />
          </div>

          {/* Desktop: Back button */}
          <button className="hidden sm:flex items-center gap-2.5 px-2 pr-3.5 py-2 rounded-full hover:bg-light-gray transition-colors duration-200 ease">
            <div className="w-[22px] h-[22px] bg-mid-gray rounded-full flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="font-normal text-sm text-black">Main menu</span>
          </button>

          <h1 className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-black">
            New Event
          </h1>

          {/* Mobile: Profile Avatar */}
          <div className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-light-gray">
            <Image
              src="/avatar-placeholder.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML =
                  '<span class="font-bold text-sm text-dark-gray">JD</span>';
              }}
            />
          </div>

          {/* Desktop: Spacer for centering */}
          <div className="hidden sm:block w-[100px]" />
        </header>

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto flex justify-center px-4 py-4 pb-8 md:px-8 md:py-8">
          <div className="w-full max-w-[1000px] flex flex-col lg:flex-row gap-4 lg:gap-8">
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

                    {/* Plus button */}
                    <button className="cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42px] h-[42px] md:w-[38px] md:h-[38px] bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                      <Plus
                        className="w-5 h-5 md:w-4 md:h-4 text-black"
                        strokeWidth={2}
                      />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-[500px] flex flex-col gap-5">
              {/* Event Title & DateTime Section */}
              <div className="flex flex-col gap-5">
                {/* Event Title Input */}
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event Title"
                  className="font-black text-[28px] md:text-[30px] text-black placeholder:text-mid-gray bg-transparent border-none outline-none w-full"
                />

                {/* DateTime Card */}
                <div className="bg-white border rounded-[18px] px-3.5 pb-3.5 pt-3 md:px-3.5 md:pb-3.5 md:pt-3.5 overflow-hidden">
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
                          <button className="flex-1 h-12 md:h-10 bg-light-gray rounded-[14px] md:rounded-[10px] flex items-center justify-center px-4 overflow-hidden hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer">
                            <span className="font-bold text-base text-black truncate">
                              {formatDate(startDate) || "Select date"}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 rounded-[20px]"
                          align={isMobile ? "start" : "center"}
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
                      <Switch
                        checked={showEndDate}
                        onCheckedChange={handleShowEndDateChange}
                        aria-label="Toggle end date visibility"
                      />
                      <EndDateTooltip showEndDate={showEndDate} />
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
                            className={`flex-1 h-12 md:h-10 bg-light-gray rounded-[14px] md:rounded-[10px] flex items-center justify-center px-4 overflow-hidden transition-colors duration-200 ease ${
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
                          align={isMobile ? "start" : "center"}
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
                  {location ? (
                    <LocationDisplay
                      location={location}
                      onClick={() => setLocationModalOpen(true)}
                    />
                  ) : (
                    <ActionButton
                      icon={<MapPin className="w-4 h-4" />}
                      label="Event Location"
                      onClick={() => setLocationModalOpen(true)}
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
                  {capacity ? (
                    <CapacityDisplay
                      capacity={capacity}
                      onClick={() => setCapacityModalOpen(true)}
                      onRemove={() => setCapacity("")}
                    />
                  ) : (
                    <ActionButton
                      icon={<Users className="w-4 h-4" />}
                      label="Capacity"
                      onClick={() => setCapacityModalOpen(true)}
                    />
                  )}
                </div>
              </div>

              {/* Tickets Section */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-sm text-black">Tickets</label>
                {/* Show existing tickets as cards with drag and drop */}
                {tickets.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={tickets.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-2">
                        {tickets.map((ticket) => (
                          <SortableTicketDisplay
                            key={ticket.id}
                            ticket={ticket}
                            onEdit={() => handleOpenTicketModal(ticket)}
                            onDelete={() => handleDeleteTicket(ticket.id)}
                            onDuplicate={() => handleDuplicateTicket(ticket)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
                {/* Always show Add Ticket button */}
                <ActionButton
                  icon={<Plus className="w-4 h-4" />}
                  label={tickets.length > 0 ? "New" : "Admission Tickets"}
                  onClick={() => handleOpenTicketModal()}
                />
              </div>

              {/* Visibility Section */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1 h-5">
                  <label className="font-bold text-sm text-black">
                    Visibility
                  </label>
                  <VisibilityTooltip />
                </div>
                <div className="flex gap-2">
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
              <button className="w-full h-[54px] md:h-[50px] shrink-0 mt-3 bg-tp-blue text-white font-bold text-base rounded-[36px] flex items-center justify-center hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform">
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
        eventContext={
          {
            title: eventTitle,
            startDate,
            startTime,
            endDate: showEndDate ? endDate : undefined,
            endTime: showEndDate ? endTime : undefined,
            location: location?.venue?.name || location?.address,
            capacity,
          } satisfies EventContext
        }
      />

      {/* Capacity Modal */}
      <CapacityModal
        open={capacityModalOpen}
        onOpenChange={setCapacityModalOpen}
        value={capacity}
        onChange={setCapacity}
      />

      {/* Location Modal */}
      <LocationModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        value={location}
        onChange={setLocation}
        savedVenues={savedVenues}
        onSaveVenue={handleSaveVenue}
      />

      {/* Ticket Modal */}
      <TicketModal
        open={ticketModalOpen}
        onOpenChange={setTicketModalOpen}
        ticket={editingTicket}
        onSave={handleSaveTicket}
        eventCapacity={capacity}
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
      className="w-full h-[54px] md:h-[47px] cursor-pointer rounded-[14px] flex items-center justify-center gap-2 px-4 py-2 transition-colors duration-200 ease bg-light-gray hover:bg-soft-gray"
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
      <FileText className="w-4 h-4 text-black mt-1 md:mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-bold text-base md:text-sm text-black">
          Description
        </span>
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
  onRemove,
}: {
  capacity: string;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="w-full rounded-[14px] flex items-start gap-3 px-4 py-3 bg-light-gray group/capacity">
      <button
        onClick={onClick}
        className="flex-1 flex items-start gap-3 cursor-pointer text-left min-w-0"
      >
        <Users className="w-4 h-4 text-black mt-1 md:mt-0.5 shrink-0" />
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="font-bold text-base md:text-sm text-black">
            Capacity
          </span>
          <span className="text-sm text-dark-gray">{capacity}</span>
        </div>
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
            aria-label="Remove capacity"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-dark-gray"
            >
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">Remove capacity</TooltipContent>
      </Tooltip>
    </div>
  );
}

function LocationDisplay({
  location,
  onClick,
}: {
  location: LocationData;
  onClick: () => void;
}) {
  const displayName = location.venue?.name || location.address;
  const displayAddress = location.venue ? location.address : null;

  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-[14px] flex items-start gap-3 px-4 py-3 transition-colors duration-200 ease bg-light-gray hover:bg-soft-gray text-left"
    >
      <MapPin className="w-4 h-4 text-black mt-1 md:mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-bold text-base md:text-sm text-black">
          {displayName}
        </span>
        {displayAddress && (
          <span className="text-sm text-dark-gray line-clamp-1">
            {displayAddress}
          </span>
        )}
      </div>
    </button>
  );
}

// Platform fee percentage (example: 10%)
const PLATFORM_FEE_PERCENT = 0.1;

function SortableTicketDisplay({
  ticket,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  ticket: Ticket;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate pricing info
  const priceNum = parseFloat(ticket.price) || 0;
  const extraFeeNum = parseFloat(ticket.extraFee) || 0;
  const platformFee = priceNum * PLATFORM_FEE_PERCENT;

  let youGet = 0;
  let buyerPays = 0;

  if (ticket.feeOption === "pass_to_buyer") {
    youGet = priceNum + extraFeeNum;
    buyerPays = priceNum + extraFeeNum + platformFee;
  } else {
    youGet = priceNum + extraFeeNum - platformFee;
    buyerPays = priceNum + extraFeeNum;
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\.00$/, "")}`;
  };

  // Mock sold quantity (would come from API in real app)
  const soldQuantity = 0;
  const totalQuantity = parseInt(ticket.quantity) || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full rounded-[16px] flex items-center gap-3 pl-3 pr-4 py-3 bg-light-gray ${
        isDragging ? "opacity-50 shadow-lg z-10" : ""
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 hover:bg-soft-gray transition-colors duration-200 ease rounded-[8px]"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5 text-dark-gray" />
      </button>

      {/* Ticket Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Title Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base text-black">{ticket.name}</span>
          {totalQuantity > 0 && (
            <span className="font-bold text-sm text-black">
              ({soldQuantity}/{totalQuantity} sold)
            </span>
          )}
        </div>

        {/* Pricing Row */}
        <div className="flex items-center gap-1.5 text-sm text-dark-gray mb-1">
          <span>You get: {formatCurrency(youGet)}</span>
          <span className="text-mid-gray">|</span>
          <span>Buyer pays: {formatCurrency(buyerPays)}</span>
        </div>

        {/* Status Row */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tp-green/15 w-fit">
          <div className="w-2 h-2 rounded-full bg-tp-green status-dot" />
          <span className="text-xs font-semibold text-status-green">
            On sale
          </span>
        </div>
      </div>

      {/* Three Dots Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer rounded-[8px]"
            aria-label="Ticket options"
          >
            <MoreVertical className="w-5 h-5 text-dark-gray" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className=" rounded-[20px] border-none shadow-sm"
        >
          <DropdownMenuItem onClick={onEdit} className=" rounded-[16px]">
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate} className=" rounded-[16px]">
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-tp-red focus:text-tp-red hover:text-tp-red rounded-[16px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
      className={`flex-1 px-3 py-4 sm:px-3.5 sm:py-3.5 cursor-pointer rounded-[14px] flex items-center justify-center relative transition-shadow duration-200 ease ${
        selected
          ? "shadow-[inset_0_0_0_1.5px_var(--color-tp-blue)]"
          : "shadow-[inset_0_0_0_1px_var(--color-neutral-200)] hover:shadow-[inset_0_0_0_1px_var(--color-mid-gray)]"
      }`}
    >
      <span
        className={` text-base font-semibold ${
          selected ? "text-black" : "text-dark-gray"
        }`}
      >
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
            className="absolute md:bottom-2 md:right-2 bottom-1 right-1 w-[18px] h-[18px] bg-tp-blue rounded-full flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function EndDateTooltip({ showEndDate }: { showEndDate: boolean }) {
  const [open, setOpen] = useState(false);
  const isFirstRender = useRef(true);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-show tooltip when toggle state changes (after initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear any existing timeout
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }

    // Show the tooltip
    setOpen(true);

    // Auto-hide after 2 seconds
    autoHideTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 2000);

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [showEndDate]);

  const handleOpenChange = (newOpen: boolean) => {
    // Clear auto-hide timeout if user manually interacts
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
    setOpen(newOpen);
  };

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="End date visibility info"
          className="cursor-default"
          onClick={() => setOpen((prev) => !prev)}
        >
          <CircleHelp className="w-4 h-4 text-gray" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        {showEndDate
          ? "End date and time are visible on the event page"
          : "End date and time are hidden on the event page"}
      </TooltipContent>
    </Tooltip>
  );
}

function VisibilityTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Visibility options info"
          className="cursor-default"
          onClick={() => setOpen((prev) => !prev)}
        >
          <CircleHelp className="w-4 h-4 text-gray" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        <div className="flex flex-col gap-1.5">
          <p>
            <span className="font-semibold">Public:</span> Listed on TickPick
            Marketplace.
          </p>
          <p>
            <span className="font-semibold">Private:</span> Only accessible via
            link.
          </p>
          <p>
            <span className="font-semibold">Draft:</span> Saved, but not ready
            for purchase.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
