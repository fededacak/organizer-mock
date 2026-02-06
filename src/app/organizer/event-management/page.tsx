export default function EventOverviewPage() {
  // In a real app, this data would come from an API or context
  const eventData = {
    name: "Illuminate Nights",
    date: "April 12, 2025",
    time: "7:00 PM",
    venue: "The Grand Ballroom, Downtown LA",
    status: "Public" as const,
    bannerImage: "/event-image.jpg",
    daysUntilEvent: 15,
  };

  return <div>page</div>;
}
