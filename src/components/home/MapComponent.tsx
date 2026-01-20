import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerTooltip,
    MapRoute,
} from "@/components/ui/map";
import Wifi from "../icon/wifi";
import Offline from "../icon/Offline";
import Track from "../icon/Track";

const route = [
    [90.4125, 23.8103], // Dhanmondi
    [90.4173, 23.8291], // Farmgate
    [90.4215, 23.8103], // Shahbagh
    [90.4288, 23.7806], // Gulshan
] as [number, number][];


const stops = [
    {
        name: "Dhanmondi",
        lng: 90.4125,
        lat: 23.8103,
    },
    {
        name: "Farmgate",
        lng: 90.4173,
        lat: 23.8291,
    },
    {
        name: "Shahbagh",
        lng: 90.4215,
        lat: 23.8103,
    },
    {
        name: "Gulshan",
        lng: 90.4288,
        lat: 23.7806,
    },
];

const stats = [
    {
        id: 1,
        label: "Online",
        value: "18 Drivers",
        icon: <Wifi />,
    },
    {
        id: 2,
        label: "On Delivery",
        value: "12 Drivers",
        icon: <Track />,
    },
    {
        id: 3,
        label: "Offline",
        value: "5 Drivers",
        icon: <Offline />,
    },
];

export default function MapComponent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
      
      {/* Map Section */}
      <div className="lg:col-span-2 w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
        <Map center={[-73.98, 40.75]} zoom={11.2}>
          <MapRoute
            coordinates={route}
            color="#3b82f6"
            width={4}
            opacity={0.8}
          />

          {stops.map((stop, index) => (
            <MapMarker
              key={stop.name}
              longitude={stop.lng}
              latitude={stop.lat}
            >
              <MarkerContent>
                <div className="size-4.5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
                  {index + 1}
                </div>
              </MarkerContent>
              <MarkerTooltip>{stop.name}</MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-md"
          >
            <div className="flex items-center justify-center rounded-xl  p-4 size-14">
              {stat.icon}
            </div>

            <div className="space-y-2">
              <p className="text-xl font-medium text-[#383838]">{stat.label}</p>
              <p className="text-2xl lg:text-4xl font-semibold text-[#1E1E1C]">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
