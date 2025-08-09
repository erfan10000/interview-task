export interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  venue: { venueName: string };
  primaryImageUrl: string;
  coverImageUrl: string;
  isPublic: boolean;
  organizer: { id: string; businessName?: string };
}