"use client";

import { useState, useCallback } from "react";
import { Leva } from "leva";
import {
  SeatManagementSidebar,
  SeatmapDisplay,
  mockSections,
  mockHolds,
  useSeatSettingsControls,
} from "@/components/seat-settings";
import type { Section, ViewMode, Seat, Hold } from "@/components/seat-settings";

export default function SeatSettingsPage() {
  const settings = useSeatSettingsControls();
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [holds, setHolds] = useState<Hold[]>(mockHolds);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("status");

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
  const selectSeats = useCallback((seatIds: string[], additive: boolean = false) => {
    setSelectedSeats((prev) => {
      if (additive) {
        const next = new Set(prev);
        seatIds.forEach((id) => next.add(id));
        return next;
      }
      return new Set(seatIds);
    });
  }, []);

  // Deselect all seats in a specific section and row
  const deselectRow = useCallback((sectionId: string, row: string) => {
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
  }, [sections, selectedSeats]);

  // Get selected seat objects grouped by section
  const getSelectedSeatsBySection = useCallback(() => {
    const result: Map<Section, Seat[]> = new Map();
    
    for (const section of sections) {
      const seatsInSection = section.seats.filter((s) => selectedSeats.has(s.id));
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
          hold.id === holdId
            ? { ...hold, ...holdData }
            : hold
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
  const deleteHold = useCallback((holdId: string) => {
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
  }, [clearSelection]);

  return (
    <div className="flex h-screen bg-light-gray">
      {settings.showSidebar && (
        <SeatManagementSidebar
          sections={sections}
          holds={holds}
          selectedSeats={selectedSeats}
          onClearSelection={clearSelection}
          onDeselectRow={deselectRow}
          onUpdateSelectedSeats={updateSelectedSeats}
          getSelectedSeatsBySection={getSelectedSeatsBySection}
          onSelectSeats={selectSeats}
          onCreateHold={createHold}
          onUpdateHold={updateHold}
          onDeleteHold={deleteHold}
        />
      )}
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
