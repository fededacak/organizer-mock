export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-[20px] bg-white lg:p-6 p-5 shadow-card">
      {children}
    </div>
  );
}
