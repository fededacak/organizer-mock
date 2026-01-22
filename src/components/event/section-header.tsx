interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <p className="font-extrabold text-sm text-black dark:text-white mb-2.5">
      {title}
    </p>
  );
}
