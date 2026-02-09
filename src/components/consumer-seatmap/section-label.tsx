interface SectionLabelProps {
  name: string;
  color: string;
}

export function SectionLabel({ name, color }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-2 px-2.5">
      <div className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="md:text-xs text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {name}
      </span>
    </div>
  );
}
