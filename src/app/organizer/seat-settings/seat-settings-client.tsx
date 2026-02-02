"use client";

import { useState, useCallback, useMemo } from "react";
import { Leva } from "leva";
import {
  SeatManagementSidebar,
  SeatmapDisplay,
  ActionsFloatingBar,
  BackButton,
  HoldModal,
  DeleteHoldModal,
  SeatEditModal,
  mockSections,
  mockHolds,
  useSeatSettingsControls,
} from "@/components/seat-settings";
import type {
  Section,
  ViewMode,
  Seat,
  Hold,
  HoldState,
  FeeOption,
} from "@/components/seat-settings";

export function SeatSettingsClient() {
  const settings = useSeatSettingsControls();
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [holds, setHolds] = useState<Hold[]>(mockHolds);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("status");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedSeats(new Set());
  }, []);

  // Toggle single seat selection
  const toggleSeat = useCallback((seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  }, []);

  // Select multiple seats (for lasso/range selection)
  const selectSeats = useCallback(
    (seatIds: string[], additive: boolean = false) => {
      setSelectedSeats((prev) => {
        if (additive) {
          const next = new Set(prev);
          seatIds.forEach((id) => next.add(id));
          return next;
        }
        return new Set(seatIds);
      });
    },
    []
  );

  // Deselect all seats in a specific section and row
  const deselectRow = useCallback(
    (sectionId: string, row: string) => {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;

      const seatsToRemove = section.seats
        .filter((seat) => seat.row === row && selectedSeats.has(seat.id))
        .map((seat) => seat.id);

      setSelectedSeats((prev) => {
        const next = new Set(prev);
        seatsToRemove.forEach((id) => next.delete(id));
        return next;
      });
    },
    [sections, selectedSeats]
  );

  // Get selected seat objects grouped by section
  const selectedSeatsBySection = useMemo(() => {
    const result: Map<Section, Seat[]> = new Map();

    for (const section of sections) {
      const seatsInSection = section.seats.filter((s) =>
        selectedSeats.has(s.id)
      );
      if (seatsInSection.length > 0) {
        result.set(section, seatsInSection);
      }
    }

    return result;
  }, [sections, selectedSeats]);

  // Update selected seats (for status changes, price overrides, holds)
  const updateSelectedSeats = useCallback(
    (updater: (seat: Section["seats"][0]) => Section["seats"][0]) => {
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          seats: section.seats.map((seat) =>
            selectedSeats.has(seat.id) ? updater(seat) : seat
          ),
        }))
      );
    },
    [selectedSeats]
  );

  // Create a new hold
  const createHold = useCallback(
    (holdData: Omit<Hold, "id" | "createdAt">) => {
      const newHold: Hold = {
        ...holdData,
        id: `hold-${Date.now()}`,
        createdAt: new Date(),
      };

      // Add hold to state
      setHolds((prev) => [...prev, newHold]);

      // Update seats to reference this hold and set status to held
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          seats: section.seats.map((seat) =>
            holdData.seatIds.includes(seat.id)
              ? { ...seat, status: "held" as const, holdId: newHold.id }
              : seat
          ),
        }))
      );

      // Clear selection after creating hold
      clearSelection();
    },
    [clearSelection]
  );

  // Update an existing hold
  const updateHold = useCallback(
    (holdId: string, holdData: Omit<Hold, "id" | "createdAt">) => {
      setHolds((prev) =>
        prev.map((hold) =>
          hold.id === holdId ? { ...hold, ...holdData } : hold
        )
      );

      // Update seat associations if seatIds changed
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          seats: section.seats.map((seat) => {
            // Remove holdId from seats no longer in this hold
            if (seat.holdId === holdId && !holdData.seatIds.includes(seat.id)) {
              return { ...seat, status: "on-sale" as const, holdId: undefined };
            }
            // Add holdId to new seats in this hold
            if (holdData.seatIds.includes(seat.id) && seat.holdId !== holdId) {
              return { ...seat, status: "held" as const, holdId };
            }
            return seat;
          }),
        }))
      );
    },
    []
  );

  // Delete a hold and release its seats
  const deleteHold = useCallback(
    (holdId: string) => {
      // Remove hold
      setHolds((prev) => prev.filter((hold) => hold.id !== holdId));

      // Release seats
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          seats: section.seats.map((seat) =>
            seat.holdId === holdId
              ? { ...seat, status: "on-sale" as const, holdId: undefined }
              : seat
          ),
        }))
      );

      clearSelection();
    },
    [clearSelection]
  );

  // Calculate hold state for selected seats
  const selectedHoldState = useMemo((): { state: HoldState; hold?: Hold } => {
    const holdIds = new Set<string>();

    for (const [, seats] of selectedSeatsBySection) {
      for (const seat of seats) {
        if (seat.holdId) {
          holdIds.add(seat.holdId);
        }
      }
    }

    if (holdIds.size === 0) {
      return { state: "none" };
    }

    if (holdIds.size === 1) {
      const holdId = [...holdIds][0];
      const hold = holds.find((h) => h.id === holdId);
      return { state: "single", hold };
    }

    return { state: "mixed" };
  }, [selectedSeatsBySection, holds]);

  // Modal states for floating action bar
  const [isSeatPriceModalOpen, setIsSeatPriceModalOpen] = useState(false);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [editingHold, setEditingHold] = useState<Hold | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holdToDelete, setHoldToDelete] = useState<Hold | null>(null);

  // Floating action bar handlers
  const handleSeatEditPrice = useCallback(() => {
    setIsSeatPriceModalOpen(true);
  }, []);

  const handleSeatPriceUpdate = useCallback(
    (newPrice: number, feeOption: FeeOption) => {
      updateSelectedSeats((seat) => ({
        ...seat,
        price: newPrice,
        feeOption,
      }));
      setIsSeatPriceModalOpen(false);
      clearSelection();
    },
    [updateSelectedSeats, clearSelection]
  );

  // Open hold modal for creating a new hold
  const handleOpenHoldModal = useCallback(() => {
    setEditingHold(undefined);
    setIsHoldModalOpen(true);
  }, []);

  // Open hold modal for editing an existing hold
  const handleEditHold = useCallback(
    (hold: Hold) => {
      setEditingHold(hold);
      // Select the seats in this hold so the modal shows them
      selectSeats(hold.seatIds, false);
      setIsHoldModalOpen(true);
    },
    [selectSeats]
  );

  // Handle edit hold from floating bar (uses currently selected hold)
  const handleEditHoldFromFloatingBar = useCallback(() => {
    if (selectedHoldState.hold) {
      setEditingHold(selectedHoldState.hold);
      setIsHoldModalOpen(true);
    }
  }, [selectedHoldState.hold]);

  // Remove selected seats from their hold
  const removeSeatsFromHold = useCallback(() => {
    if (selectedHoldState.state !== "single" || !selectedHoldState.hold) return;

    const holdId = selectedHoldState.hold.id;
    const selectedSeatIds = Array.from(selectedSeats);

    // Update hold to remove selected seats
    setHolds(
      (prev) =>
        prev
          .map((hold) => {
            if (hold.id === holdId) {
              const newSeatIds = hold.seatIds.filter(
                (id) => !selectedSeatIds.includes(id)
              );
              // If no seats left, we'll filter this out below
              return { ...hold, seatIds: newSeatIds };
            }
            return hold;
          })
          .filter((hold) => hold.seatIds.length > 0) // Remove empty holds
    );

    // Update seats to remove hold reference
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        seats: section.seats.map((seat) =>
          selectedSeatIds.includes(seat.id)
            ? { ...seat, status: "on-sale" as const, holdId: undefined }
            : seat
        ),
      }))
    );

    clearSelection();
  }, [selectedHoldState, selectedSeats, clearSelection]);

  // Handle hold modal confirm (create or update)
  const handleHoldConfirm = useCallback(
    (holdData: Omit<Hold, "id" | "createdAt">) => {
      if (editingHold) {
        // Update existing hold
        updateHold(editingHold.id, holdData);
      } else {
        // Create new hold
        createHold(holdData);
      }
      setIsHoldModalOpen(false);
      setEditingHold(undefined);
      clearSelection();
    },
    [editingHold, createHold, updateHold, clearSelection]
  );

  // Open delete confirmation modal from sidebar
  const handleOpenDeleteModal = useCallback((hold: Hold) => {
    setHoldToDelete(hold);
    setIsDeleteModalOpen(true);
  }, []);

  // Confirm delete from delete modal
  const handleConfirmDelete = useCallback(() => {
    if (holdToDelete) {
      deleteHold(holdToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setHoldToDelete(null);
  }, [holdToDelete, deleteHold]);

  return (
    <div className="relative h-screen overflow-hidden bg-light-gray">
      <SeatmapDisplay
        sections={sections}
        holds={holds}
        selectedSeats={selectedSeats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSeat={toggleSeat}
        onSelectSeats={selectSeats}
        settings={settings}
      />

      <SeatManagementSidebar
        sections={sections}
        holds={holds}
        selectedSeatsBySection={selectedSeatsBySection}
        onClearSelection={clearSelection}
        onDeselectRow={deselectRow}
        onSelectSeats={selectSeats}
        onEditHold={handleEditHold}
        onDeleteHold={handleOpenDeleteModal}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={() => setIsSidebarMinimized((prev) => !prev)}
      />

      {/* Back button - positioned based on sidebar state */}
      <BackButton sidebarExpanded={!isSidebarMinimized} />

      {/* Floating bar for seat actions - always visible */}
      <ActionsFloatingBar
        selectedCount={selectedSeats.size}
        holdState={selectedHoldState.state}
        onClear={clearSelection}
        onEditPrice={handleSeatEditPrice}
        onHold={handleOpenHoldModal}
        onRemoveFromHold={removeSeatsFromHold}
      />

      <SeatEditModal
        isOpen={isSeatPriceModalOpen}
        onClose={() => setIsSeatPriceModalOpen(false)}
        onConfirm={handleSeatPriceUpdate}
        selectedSeatsBySection={selectedSeatsBySection}
        sections={sections}
      />

      <HoldModal
        isOpen={isHoldModalOpen}
        onClose={() => {
          setIsHoldModalOpen(false);
          setEditingHold(undefined);
        }}
        onConfirm={handleHoldConfirm}
        selectedSeatsBySection={selectedSeatsBySection}
        existingHold={editingHold}
      />

      <DeleteHoldModal
        isOpen={isDeleteModalOpen}
        hold={holdToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHoldToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Leva Controls Panel */}
      <Leva
        collapsed
        titleBar={{ title: "Settings" }}
        oneLineLabels={false}
        flat={false}
        theme={{
          sizes: {
            rootWidth: "280px",
            controlWidth: "140px",
            titleBarHeight: "32px",
          },
        }}
      />
    </div>
  );
}
