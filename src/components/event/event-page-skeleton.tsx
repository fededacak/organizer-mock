export function EventPageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center animate-pulse">
      <div className="w-full h-[86px] bg-light-gray" />
      <div className="w-full max-w-[1014px] pt-5 pb-20 px-4">
        <div className="aspect-[1014/400] bg-light-gray rounded-2xl" />
      </div>
    </div>
  );
}
