interface TruckData {
  truckId: number;
  zone: string;
  driver: string;
  status: "On Delivery" | "Available" | "Offline";
  inventory: string;
  lastUpdated: string;
}

export const truckData: TruckData[] = [
  {
    truckId: 2472,
    zone: "Dhanmondi",
    driver: "John D.",
    status: "On Delivery",
    inventory: "12 lb : 3 | 25 lb : 5",
    lastUpdated: "5 mins ago",
  },
  {
    truckId: 2472,
    zone: "Dhanmondi",
    driver: "John D.",
    status: "Available",
    inventory: "12 lb : 3 | 25 lb : 5",
    lastUpdated: "5 mins ago",
  },
  {
    truckId: 2472,
    zone: "Dhanmondi",
    driver: "John D.",
    status: "Offline",
    inventory: "12 lb : 3 | 25 lb : 5",
    lastUpdated: "5 mins ago",
  },
  {
    truckId: 2472,
    zone: "Dhanmondi",
    driver: "John D.",
    status: "On Delivery",
    inventory: "12 lb : 3 | 25 lb : 5",
    lastUpdated: "5 mins ago",
  },
];
