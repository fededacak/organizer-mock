import { TickPickLogo } from "@/components/tickpick-logo";
import { FolderCard, FOLDERS } from "@/components/navigation";

export default function NavigationPage() {
  return (
    <div className="min-h-screen bg-light-gray flex flex-col items-center px-4 py-12">
      {/* Logo */}
      <div className="mb-12">
        <TickPickLogo width={160} height={36} />
      </div>

      {/* Folder Grid */}
      <div className="w-full max-w-[1000px] flex gap-5">
        {FOLDERS.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
}
