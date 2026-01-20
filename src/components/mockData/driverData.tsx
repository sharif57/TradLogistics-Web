export interface DriverData {
  driver: string;
  truck: string;
  status: "On Delivery" | "Available" | "Offline";
  deliveriesToday: number;
  rating: number;
  earningsToday: number;
}

export const driverData: DriverData[] = [
  {
    driver: "John D",
    truck: "TRK-A12",
    status: "On Delivery",
    deliveriesToday: 12,
    rating: 4.8,
    earningsToday: 2500,
  },
  {
    driver: "John D",
    truck: "TRK-A12",
    status: "On Delivery",
    deliveriesToday: 12,
    rating: 4.8,
    earningsToday: 2500,
  },
  {
    driver: "John D",
    truck: "TRK-A12",
    status: "On Delivery",
    deliveriesToday: 12,
    rating: 4.8,
    earningsToday: 2500,
  },
  {
    driver: "John D",
    truck: "TRK-A12",
    status: "On Delivery",
    deliveriesToday: 12,
    rating: 4.8,
    earningsToday: 2500,
  },
  {
    driver: "John D",
    truck: "TRK-A12",
    status: "On Delivery",
    deliveriesToday: 12,
    rating: 4.8,
    earningsToday: 2500,
  },
  {
    driver: "John D",
    truck: "TRK-A12",
    status: "On Delivery",
    deliveriesToday: 12,
    rating: 4.8,
    earningsToday: 2500,
  },
];
