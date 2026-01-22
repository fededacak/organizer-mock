import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FOLDERS, FOLDER_COLORS } from "@/components/navigation";
import { PageCard } from "@/components/navigation/page-card";

type FolderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { id } = await params;
  const folder = FOLDERS.find((f) => f.id === id);

  if (!folder) {
    notFound();
  }

  const colors = FOLDER_COLORS[folder.color];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${colors.bg} px-4 py-6`}>
        <div className="max-w-[800px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 ease mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="text-sm font-semibold">Back</span>
          </Link>

          <h1 className="text-2xl font-bold text-white">{folder.name}</h1>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="px-4 py-8">
        <div className="max-w-[800px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {folder.items.map((item) => (
              <PageCard key={item.id} item={item} color={folder.color} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
