export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-[20px] bg-white p-6 shadow-card">
      {children}
    </div>
  );
}
