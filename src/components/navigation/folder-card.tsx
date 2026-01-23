import Link from "next/link";
import type { FolderData } from "./types";
import { FOLDER_COLORS } from "./constants";

type FolderCardProps = {
  folder: FolderData;
};

const PAPER_CONFIGS = [
  {
    className: `
      h-[100px] bg-white rounded-[16px] shadow-sm flex flex-col p-5 gap-1 w-full max-w-[160px] min-w-[130px]
      -rotate-5 translate-x-2
      transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] delay-[50ms]
      group-hover:-translate-y-2 group-hover:-rotate-6
    `,
    singleClassName: `
      h-[100px] bg-white rounded-[16px] shadow-sm flex flex-col p-5 gap-1 w-full max-w-[160px] min-w-[130px] -rotate-3
      transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)]
      group-hover:-translate-y-2
    `,
    lines: ["60%", "100%", "100%", "100%", "80%"],
  },
  {
    className: `
      h-[100px] bg-white rounded-[16px] shadow-lg flex flex-col p-5 gap-1 w-full max-w-[160px] min-w-[120px]
      rotate-3 -translate-x-3 translate-y-3
      transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)]
      group-hover:-translate-y-1 group-hover:rotate-5
    `,
    lines: ["40%", "100%", "80%"],
  },
];

export function FolderCard({ folder }: FolderCardProps) {
  const colors = FOLDER_COLORS[folder.color];
  const paperCount = Math.min(Math.max(folder.items.length, 1), 2);
  const papers = PAPER_CONFIGS.slice(0, paperCount);

  return (
    <Link
      href={`/folder/${folder.id}`}
      className={`
        group
        relative w-full sm:max-w-[300px] rounded-[28px] overflow-hidden
        block
        ${colors.bg}
        transition-transform duration-200 ease
        active:scale-[0.98]
        shadow-md
      `}
    >
      {/* Folder Tab (curved top section with papers) */}
      <div className="relative h-[100px] overflow-hidden">
        {/* Tab shape */}
        <div
          className={`absolute top-0 left-0 right-0 h-[100px] ${colors.tab}`}
        />

        {/* Papers peeking out */}
        <div className={`absolute top-8 left-8 right-8 flex ${paperCount === 1 ? "justify-center" : ""}`}>
          {papers.map((paper, index) => (
            <div key={index} className={paperCount === 1 && paper.singleClassName ? paper.singleClassName : paper.className}>
              {paper.lines.map((width, lineIndex) => (
                <div
                  key={lineIndex}
                  className={`h-[6px] ${colors.paperLines} rounded-full`}
                  style={{ width }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Folder Bottom Section */}
      <div className={`relative z-10 px-5 pb-5 pt-4 flex items-center justify-between ${colors.bg} shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.15)]`}>
        <div className="flex flex-col items-start">
          <span className="font-bold text-xl text-white">{folder.name}</span>
          <span className="text-base text-white/70">
            {folder.items.length} {folder.items.length === 1 ? "page" : "pages"}
          </span>
        </div>
      </div>
    </Link>
  );
}
