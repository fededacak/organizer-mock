import {
  SeatManagementSidebar,
  SeatmapDisplay,
} from "@/components/seat-settings";

export default function SeatSettingsPage() {
  return (
    <div className="flex h-screen bg-light-gray">
      <SeatManagementSidebar />
      <SeatmapDisplay />
    </div>
  );
}
