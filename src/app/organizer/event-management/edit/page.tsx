import { SquarePen } from "lucide-react";

export default function EditEventPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <h1 className="font-outfit text-2xl font-black text-black">Edit Event</h1>

      {/* Placeholder content */}
      <div className="flex flex-col items-center justify-center gap-6 rounded-[20px] bg-white p-16 shadow-card">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-light-gray">
          <SquarePen className="size-10 text-gray" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-outfit text-xl font-bold text-black">
            Event Editor
          </h2>
          <p className="max-w-md font-open-sans text-sm text-dark-gray">
            This is where you can edit your event details, update the
            description, change the date and time, upload new images, and
            configure all event settings.
          </p>
        </div>
        <button className="rounded-full bg-tp-blue px-6 py-3 font-outfit text-sm font-bold text-white transition-opacity duration-200 ease hover:opacity-90">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
