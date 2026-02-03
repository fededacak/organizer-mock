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
  ReleaseHoldModal,
  MoveHoldModal,
  SeatEditModal,
  mockSections,
  mockHolds,
  mockTables,
  useSeatSettingsControls,
} from "@/components/seat-settings";
import type {
  Section,
  ViewMode,
  Seat,
  Hold,
  FeeOption,
  SelectionInfo,
  MoveHoldInfo,
} from "@/components/seat-settings";

export function SeatSettingsClient() {
  const settings = useSeatSettingsControls();
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [tables, setTables] = useState<Section[]>(mockTables);
  const [holds, setHolds] = useState<Hold[]>(mockHolds);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("status");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Determine active data based on layout variant
  const isTableLayout = settings.layoutVariant === "tables";
  const activeSections = isTableLayout ? tables : sections;
  const setActiveSections = isTableLayout ? setTables : setSections;

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
      const section = activeSections.find((s) => s.id === sectionId);
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
    [activeSections, selectedSeats]
  );

  // Get selected seat objects grouped by section
  const selectedSeatsBySection = useMemo(() => {
    const result: Map<Section, Seat[]> = new Map();

    for (const section of activeSections) {
      const seatsInSection = section.seats.filter((s) =>
        selectedSeats.has(s.id)
      );
      if (seatsInSection.length > 0) {
        result.set(section, seatsInSection);
      }
    }

    return result;
  }, [activeSections, selectedSeats]);

  // Update selected seats (for status changes, price overrides, holds)
  const updateSelectedSeats = useCallback(
    (updater: (seat: Section["seats"][0]) => Section["seats"][0]) => {
      setActiveSections((prev) =>
        prev.map((section) => ({
          ...section,
          seats: section.seats.map((seat) =>
            selectedSeats.has(seat.id) ? updater(seat) : seat
          ),
        }))
      );
    },
    [selectedSeats, setActiveSections]
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
      setActiveSections((prev) =>
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
    [clearSelection, setActiveSections]
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
      setActiveSections((prev) =>
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
    [setActiveSections]
  );

  // Delete a hold and release its seats
  const deleteHold = useCallback(
    (holdId: string) => {
      // Remove hold
      setHolds((prev) => prev.filter((hold) => hold.id !== holdId));

      // Release seats
      setActiveSections((prev) =>
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
    [clearSelection, setActiveSections]
  );

  // Calculate rich selection info for floating action bar
  const selectionInfo = useMemo((): SelectionInfo => {
    let heldCount = 0;
    let onSaleCount = 0;
    let soldCount = 0;
    const holdIds = new Set<string>();

    for (const [, seats] of selectedSeatsBySection) {
      for (const seat of seats) {
        if (seat.status === "held") {
          heldCount++;
          if (seat.holdId) {
            holdIds.add(seat.holdId);
          }
        } else if (seat.status === "on-sale") {
          onSaleCount++;
        } else if (seat.status === "sold") {
          soldCount++;
        }
      }
    }

    const totalCount = heldCount + onSaleCount + soldCount;
    const uniqueHolds = holds.filter((h) => holdIds.has(h.id));

    return {
      totalCount,
      heldCount,
      onSaleCount,
      soldCount,
      uniqueHolds,
      allHeld: totalCount > 0 && heldCount === totalCount,
      allOnSale: totalCount > 0 && onSaleCount === totalCount,
      allSold: totalCount > 0 && soldCount === totalCount,
      canHold: onSaleCount > 0,
      canRelease: heldCount > 0,
    };
  }, [selectedSeatsBySection, holds]);

  // Modal states for floating action bar
  const [isSeatPriceModalOpen, setIsSeatPriceModalOpen] = useState(false);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [editingHold, setEditingHold] = useState<Hold | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holdToDelete, setHoldToDelete] = useState<Hold | null>(null);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveTargetHold, setMoveTargetHold] = useState<Hold | null>(null);
  const [moveHoldInfo, setMoveHoldInfo] = useState<MoveHoldInfo[]>([]);
  const [moveOnSaleCount, setMoveOnSaleCount] = useState(0);

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
    if (selectionInfo.uniqueHolds.length === 1) {
      setEditingHold(selectionInfo.uniqueHolds[0]);
      setIsHoldModalOpen(true);
    }
  }, [selectionInfo.uniqueHolds]);

  // Remove selected seats from their holds (works for any held seats)
  const releaseHeldSeats = useCallback(() => {
    if (!selectionInfo.canRelease) return;

    const selectedSeatIds = Array.from(selectedSeats);

    // Update all affected holds to remove selected seats (keeps empty holds)
    setHolds((prev) =>
      prev.map((hold) => {
        const newSeatIds = hold.seatIds.filter(
          (id) => !selectedSeatIds.includes(id)
        );
        return { ...hold, seatIds: newSeatIds };
      })
    );

    // Update seats to remove hold reference (only for held seats)
    setActiveSections((prev) =>
      prev.map((section) => ({
        ...section,
        seats: section.seats.map((seat) =>
          selectedSeatIds.includes(seat.id) && seat.status === "held"
            ? { ...seat, status: "on-sale" as const, holdId: undefined }
            : seat
        ),
      }))
    );

    clearSelection();
    setIsReleaseModalOpen(false);
  }, [
    selectionInfo.canRelease,
    selectedSeats,
    clearSelection,
    setActiveSections,
  ]);

  // Open release confirmation modal
  const handleOpenReleaseModal = useCallback(() => {
    if (selectionInfo.canRelease) {
      setIsReleaseModalOpen(true);
    }
  }, [selectionInfo.canRelease]);

  // Open move confirmation modal
  const handleOpenMoveModal = useCallback(
    (targetHold: Hold) => {
      // Collect info about seats being moved
      let onSaleCount = 0;
      const holdSeatCounts = new Map<string, number>();

      for (const [, seats] of selectedSeatsBySection) {
        for (const seat of seats) {
          if (seat.status === "on-sale") {
            onSaleCount++;
          } else if (
            seat.status === "held" &&
            seat.holdId &&
            seat.holdId !== targetHold.id
          ) {
            holdSeatCounts.set(
              seat.holdId,
              (holdSeatCounts.get(seat.holdId) || 0) + 1
            );
          }
        }
      }

      // Build move info array
      const moveInfo: MoveHoldInfo[] = [];
      for (const [holdId, count] of holdSeatCounts) {
        const hold = holds.find((h) => h.id === holdId);
        if (hold) {
          moveInfo.push({ fromHold: hold, seatCount: count });
        }
      }

      // If no seats to move, just return
      if (onSaleCount === 0 && moveInfo.length === 0) return;

      setMoveTargetHold(targetHold);
      setMoveHoldInfo(moveInfo);
      setMoveOnSaleCount(onSaleCount);
      setIsMoveModalOpen(true);
    },
    [selectedSeatsBySection, holds]
  );

  // Confirm and execute the move
  const confirmMoveHold = useCallback(() => {
    if (!moveTargetHold) return;

    // Collect seats that can be added/moved (on-sale and held, not sold)
    const seatsToMove: string[] = [];
    const seatsToRemoveFromHolds: { seatId: string; fromHoldId: string }[] = [];

    for (const [, seats] of selectedSeatsBySection) {
      for (const seat of seats) {
        if (seat.status === "on-sale") {
          seatsToMove.push(seat.id);
        } else if (seat.status === "held") {
          seatsToMove.push(seat.id);
          // Track which hold this seat needs to be removed from
          if (seat.holdId && seat.holdId !== moveTargetHold.id) {
            seatsToRemoveFromHolds.push({
              seatId: seat.id,
              fromHoldId: seat.holdId,
            });
          }
        }
        // Sold seats are ignored
      }
    }

    if (seatsToMove.length === 0) {
      setIsMoveModalOpen(false);
      return;
    }

    // Update holds: remove from old holds, add to target hold
    setHolds((prev) =>
      prev.map((h) => {
        if (h.id === moveTargetHold.id) {
          // Add seats to target hold
          return {
            ...h,
            seatIds: [...new Set([...h.seatIds, ...seatsToMove])],
          };
        }
        // Remove seats from their old holds
        const seatsToRemove = seatsToRemoveFromHolds
          .filter((s) => s.fromHoldId === h.id)
          .map((s) => s.seatId);
        if (seatsToRemove.length > 0) {
          return {
            ...h,
            seatIds: h.seatIds.filter((id) => !seatsToRemove.includes(id)),
          };
        }
        return h;
      })
    );

    // Update seats to reference the target hold
    setActiveSections((prev) =>
      prev.map((section) => ({
        ...section,
        seats: section.seats.map((seat) =>
          seatsToMove.includes(seat.id)
            ? { ...seat, status: "held" as const, holdId: moveTargetHold.id }
            : seat
        ),
      }))
    );

    setIsMoveModalOpen(false);
    setMoveTargetHold(null);
    setMoveHoldInfo([]);
    setMoveOnSaleCount(0);
    clearSelection();
  }, [
    moveTargetHold,
    selectedSeatsBySection,
    clearSelection,
    setActiveSections,
  ]);

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
        tables={tables}
        holds={holds}
        selectedSeats={selectedSeats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSeat={toggleSeat}
        onSelectSeats={selectSeats}
        settings={settings}
      />

      <SeatManagementSidebar
        sections={activeSections}
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
        selectionInfo={selectionInfo}
        availableHolds={holds}
        onClear={clearSelection}
        onEditPrice={handleSeatEditPrice}
        onHold={handleOpenHoldModal}
        onReleaseHeld={handleOpenReleaseModal}
        onAddToExistingHold={handleOpenMoveModal}
      />

      <SeatEditModal
        isOpen={isSeatPriceModalOpen}
        onClose={() => setIsSeatPriceModalOpen(false)}
        onConfirm={handleSeatPriceUpdate}
        selectedSeatsBySection={selectedSeatsBySection}
        sections={activeSections}
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

      <ReleaseHoldModal
        isOpen={isReleaseModalOpen}
        seatCount={selectionInfo.heldCount}
        onClose={() => setIsReleaseModalOpen(false)}
        onConfirm={releaseHeldSeats}
      />

      <MoveHoldModal
        isOpen={isMoveModalOpen}
        targetHold={moveTargetHold}
        moveInfo={moveHoldInfo}
        onSaleSeatsCount={moveOnSaleCount}
        onClose={() => {
          setIsMoveModalOpen(false);
          setMoveTargetHold(null);
          setMoveHoldInfo([]);
          setMoveOnSaleCount(0);
        }}
        onConfirm={confirmMoveHold}
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
