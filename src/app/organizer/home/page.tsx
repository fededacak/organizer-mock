import { OrganizerSidebar } from "@/components/organizer-sidebar";
import {
  HomePageHeader,
  OnboardingChecklistCard,
  ExploreFeaturesCard,
  ResourcesCard,
  OrganizerProfileCard,
  QuickAccessCard,
} from "@/components/home";

export default function OrganizerHomePage() {
  return (
    <div className="flex h-screen bg-background p-2.5">
      {/* Sidebar */}
      <div className="flex h-full items-center py-2.5 pl-2.5 pr-0">
        <OrganizerSidebar className="h-full" />
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto px-11 pb-[72px] pt-11">
        <HomePageHeader userName="Michael" />

        {/* Two column layout */}
        <div className="flex gap-5 pb-10">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-5">
            <OnboardingChecklistCard progress={17} />
            <ExploreFeaturesCard />
            <ResourcesCard />
          </div>

          {/* Right column */}
          <div className="flex w-full max-w-[400px] min-w-[390px] flex-col gap-5">
            <OrganizerProfileCard />
            <QuickAccessCard />
          </div>
        </div>
      </main>
    </div>
  );
}
