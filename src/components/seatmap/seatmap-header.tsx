"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Undo2,
  Redo2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TickPickLogo } from "@/components/tickpick-logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";

type SeatmapHeaderProps = {
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasElements: boolean;
};

// Confirmation modal for leaving the seatmap editor
export function SeatmapHeader({
  onExport,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
  hasElements,
}: SeatmapHeaderProps) {
  const router = useRouter();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleLeave = () => {
    setShowLeaveModal(false);
    router.push("/organizer/home");
  };

  return (
    <>
      <header className="sticky top-0 z-10 md:relative md:shrink-0 bg-white flex items-center justify-between p-3 border-b border-light-gray">
        {/* Mobile: TickPick Logo */}
        <div className="flex sm:hidden items-center">
          <TickPickLogo />
        </div>

        {/* Desktop: Back button + Title */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="cursor-pointer flex items-center gap-2.5 px-2 pr-3.5 py-2 rounded-full hover:bg-light-gray transition-colors duration-200 ease"
          >
            <div className="w-[22px] h-[22px] bg-mid-gray rounded-full flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="font-normal text-sm text-black">Main menu</span>
          </button>

          <div className="h-6 w-px bg-light-gray" />

          <h1 className="font-bold text-base text-black">Seat Map Editor</h1>
        </div>

        {/* Center section - History controls (desktop only) */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (⌘Z)"
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (⌘⇧Z)"
          >
            <Redo2 className="size-4" />
          </Button>
          <div className="h-6 w-px bg-light-gray mx-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClear}
            disabled={!hasElements}
            title="Clear all"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onExport}
            disabled={!hasElements}
            className="h-9 px-4 bg-tp-blue hover:bg-[#2288ee] text-white font-bold text-sm rounded-full"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export SVG</span>
          </Button>
        </div>
      </header>

      {/* Leave Confirmation Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="max-w-[400px]">
          <DialogCloseButton />
          <DialogHeader className="flex-col items-center gap-3 pt-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle>Leave Seat Map Editor?</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center px-6 pb-2 text-mid-gray">
            You have unsaved changes. Are you sure you want to leave? Your
            progress will be lost.
          </DialogDescription>
          <DialogFooter className="flex-col gap-2 sm:flex-col px-6 pb-6">
            <Button
              onClick={handleLeave}
              className="w-full h-11 bg-destructive hover:bg-destructive/90 text-white font-bold rounded-full"
            >
              Leave without saving
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowLeaveModal(false)}
              className="w-full h-11 font-bold rounded-full hover:bg-light-gray"
            >
              Continue editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
