"use client";

import { useState, useMemo, useCallback } from "react";
import {
  SeatManagementSidebar,
  SeatmapDisplay,
  mockSections,
} from "@/components/seat-settings";
import type { Section } from "@/components/seat-settings";

export default function SeatSettingsPage() {
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((section) =>
      section.name.toLowerCase().includes(query)
    );
  }, [searchQuery, sections]);

  // Check if all filtered sections are selected
  const isAllSelected =
    filteredSections.length > 0 &&
    filteredSections.every((section) => selectedSections.has(section.id));

  // Toggle single section selection
  const toggleSection = useCallback((sectionId: string) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // Toggle all sections selection
  const toggleAllSections = useCallback(() => {
    if (isAllSelected) {
      setSelectedSections((prev) => {
        const next = new Set(prev);
        filteredSections.forEach((section) => next.delete(section.id));
        return next;
      });
    } else {
      setSelectedSections((prev) => {
        const next = new Set(prev);
        filteredSections.forEach((section) => next.add(section.id));
        return next;
      });
    }
  }, [isAllSelected, filteredSections]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedSections(new Set());
  }, []);

  // Get selected section objects
  const getSelectedSectionObjects = useCallback(() => {
    return sections.filter((s) => selectedSections.has(s.id));
  }, [sections, selectedSections]);

  // Update sections (for price changes, status changes, etc.)
  const updateSections = useCallback((updater: (prev: Section[]) => Section[]) => {
    setSections(updater);
  }, []);

  return (
    <div className="flex h-screen bg-light-gray">
      <SeatManagementSidebar
        sections={sections}
        filteredSections={filteredSections}
        selectedSections={selectedSections}
        searchQuery={searchQuery}
        isAllSelected={isAllSelected}
        onSearchChange={setSearchQuery}
        onToggleSection={toggleSection}
        onToggleAll={toggleAllSections}
        onClearSelection={clearSelection}
        onUpdateSections={updateSections}
        getSelectedSectionObjects={getSelectedSectionObjects}
      />
      <SeatmapDisplay
        sections={sections}
        selectedSections={selectedSections}
        onToggleSection={toggleSection}
      />
    </div>
  );
}
