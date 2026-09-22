export const HEAR_ABOUT_OPTIONS = [
  "Google",
  "Friend / Family",
  "Social Media",
  "YouTube",
  "Other",
] as const;

export const CONSULTATION_TYPES = [
  { value: "pooja", label: "Pooja" },
  { value: "marriage", label: "Marriage" },
  { value: "jathaka", label: "Jathaka" },
  { value: "other", label: "Other" },
] as const;

export type CustomerUser = {
  id: number;
  email: string;
  name: string;
  mobile: string;
  location: string;
  source: string;
  message: string;
  profile_complete: boolean;
};

export type AvailabilityDay = {
  date: string;
  available: boolean;
  blocked: boolean;
  booked?: boolean;
  working: boolean;
  slots: { start: string; end: string }[];
};

export type AvailabilityMonth = {
  timezone: string;
  month: string;
  slot_minutes: number;
  working_days: string[];
  start_time: string;
  end_time: string;
  days: AvailabilityDay[];
  note: string;
};
