export interface DriverData {
    truckId: string;
    zone: string;
    full12kg: number;
    full25kg: number;
    emptyCylinders: number;
    status: string;
    action: string;
}

 export const inventoryData: DriverData[] = [
  {
    truckId: "2472",
    zone: "Dhanmondi",
    full12kg: 3,
    full25kg: 1,
    emptyCylinders: 5,
    status: "Low",
    action: "View"
  },
  {
    truckId: "2472",
    zone: "Dhanmondi",
    full12kg: 3,
    full25kg: 1,
    emptyCylinders: 5,
    status: "Normal",
    action: "View"
  },
  {
    truckId: "2472",
    zone: "Dhanmondi",
    full12kg: 3,
    full25kg: 1,
    emptyCylinders: 5,
    status: "Critical",
    action: "View"
  },
  {
    truckId: "2472",
    zone: "Dhanmondi",
    full12kg: 3,
    full25kg: 1,
    emptyCylinders: 5,
    status: "Low",
    action: "View"
  },
  {
    truckId: "7341",
    zone: "Mirpur",
    full12kg: 0,
    full25kg: 1,
    emptyCylinders: 5,
    status: "Critical",
    action: "View"
  },
  {
    truckId: "7341",
    zone: "Mirpur",
    full12kg: 3,
    full25kg: 0,
    emptyCylinders: 3,
    status: "Low",
    action: "View"
  },
  {
    truckId: "6890",
    zone: "Dhanmondi",
    full12kg: 3,
    full25kg: 3,
    emptyCylinders: 10,
    status: "Normal",
    action: "View"
  },
  {
    truckId: "5712",
    zone: "Mohammadpur",
    full12kg: 4,
    full25kg: 0,
    emptyCylinders: 4,
    status: "Low",
    action: "View"
  },
  {
    truckId: "4256",
    zone: "Banani",
    full12kg: 3,
    full25kg: 3,
    emptyCylinders: 9,
    status: "Normal",
    action: "View"
  },
  {
    truckId: "2472",
    zone: "Gulshan",
    full12kg: 5,
    full25kg: 2,
    emptyCylinders: 9,
    status: "Normal",
    action: "View"
  },
  {
    truckId: "3189",
    zone: "Gulshan",
    full12kg: 0,
    full25kg: 0,
    emptyCylinders: 6,
    status: "Critical",
    action: "View"
  },
  {
    truckId: "5712",
    zone: "Uttara",
    full12kg: 3,
    full25kg: 4,
    emptyCylinders: 10,
    status: "Critical",
    action: "View"
  },
  {
    truckId: "7341",
    zone: "Gulshan",
    full12kg: 4,
    full25kg: 3,
    emptyCylinders: 2,
    status: "Normal",
    action: "View"
  }
];