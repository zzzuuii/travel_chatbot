export type Message = {
  sender: "bot" | "user";
  text: string;
};

export type TravelConditions = {
  budget: string;
  interests: string[];
  date?: string;
  time_s?: string;
  time_e?: string;
};

export type TouristSpot = {
  id: number;
  name: string;
  entranceFee: number;
  stayMinutes: number;
  latitude: number;
  longitude: number;
  recommendedTime: string | null;
  area: string;

  priorityWeight: number;

  categories: {
    id: number;
    name: string;
  }[];

  openingHours: {
    id: number;
    dayOfWeek: number;
    openTime: string | null;
    closeTime: string | null;
    closesNextDay: boolean;
    isClosed: boolean;
  }[];
};

export type TravelData = {
  travelMinutes: number;
  fare: number;
  transport: string;
};

export type PlanItem = {
  spot: TouristSpot;
  startTime: string;
  endTime: string;
  travelFromPrevious: TravelData | null;
};

export type SpotCandidate = {
  spot: TouristSpot;
  score: number;
};