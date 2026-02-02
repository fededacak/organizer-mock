import type { Metadata } from "next";
import { SeatSettingsClient } from "./seat-settings-client";

export const metadata: Metadata = {
  title: "Seat Map Management | TickPick",
  description:
    "Manage seat pricing, holds, and availability for your event venue.",
};

export default function SeatSettingsPage() {
  return <SeatSettingsClient />;
}
