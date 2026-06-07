import { useListAnnouncements } from "@workspace/api-client-react";

export function AnnouncementBanner() {
  const { data: announcements, isLoading } = useListAnnouncements();

  if (isLoading || !announcements || announcements.length === 0) {
    return null;
  }

  // Filter active announcements
  const activeAnnouncements = announcements.filter(a => a.active === 1);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 overflow-hidden relative border-b border-primary">
      <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] inline-block font-display text-lg tracking-widest">
        {activeAnnouncements.map((announcement, idx) => (
          <span key={announcement.id} className="mx-8">
            {announcement.message}
            {idx < activeAnnouncements.length - 1 && <span className="mx-8">•</span>}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
