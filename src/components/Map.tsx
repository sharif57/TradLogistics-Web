
// 'use client';

// import { useEffect, useRef, useState, useCallback } from "react";
// import { Loader2, Navigation, MapPin, RefreshCw } from "lucide-react";
// import { useDashboardQuery } from '@/redux/feature/gasCompany/dashboardSlice';

// // --- Types ---
// interface Delivery {
//     status: string;
//     driver_last_lat: number;
//     driver_last_lng: number;
//     driver_name: string;
//     truck_id: string;
// }

// interface DashboardData {
//     today_total_order: number;
//     in_transit: number;
//     completed_deliveries: number;
//     today_total_revenue: number;
//     drivers: {
//         online: number;
//         on_delivery: number;
//         offline: number;
//     };
//     map: {
//         deliveries: Delivery[];
//     };
// }

// // --- Extend Window for Google Maps ---
// declare global {
//     interface Window {
//         google: typeof google;
//         initMap: () => void;
//     }
// }

// // --- Utility ---
// function loadGoogleMapsScript(apiKey: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//         if (window.google?.maps) return resolve();
//         if (document.getElementById('google-maps-script')) {
//             // Script already added, wait for it
//             const interval = setInterval(() => {
//                 if (window.google?.maps) { clearInterval(interval); resolve(); }
//             }, 100);
//             return;
//         }
//         const script = document.createElement('script');
//         script.id = 'google-maps-script';
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
//         script.async = true;
//         script.defer = true;
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error('Google Maps failed to load'));
//         document.head.appendChild(script);
//     });
// }

// // Car image marker — uses /image/truck.png from public folder
// const CAR_ICON = {
//     url: '/image/truck.png',
//     scaledSize: undefined as unknown as google.maps.Size, // set after maps loads
//     anchor: undefined as unknown as google.maps.Point,
// };

// // Map styles — clean white/light mode, roads clearly visible, POI & transit muted
// const MAP_STYLES: google.maps.MapTypeStyle[] = [
//     // Base: white background
//     { elementType: "geometry", stylers: [{ color: "#f8f9fa" }] },
//     { elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
//     { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },

//     // Roads — clearly visible
//     { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
//     { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
//     { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fdd835" }] },
//     { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#f9a825" }] },
//     { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
//     { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
//     { featureType: "road.arterial", elementType: "geometry.stroke", stylers: [{ color: "#d6d6d6" }] },
//     { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
//     { featureType: "road.local", elementType: "geometry.stroke", stylers: [{ color: "#eeeeee" }] },

//     // Land/Area — neutral light
//     { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f1f3f4" }] },
//     { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#e8eaed" }] },

//     // Water — soft blue
//     { featureType: "water", elementType: "geometry", stylers: [{ color: "#b3d1e8" }] },
//     { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5d8aa8" }] },

//     // Parks — soft green
//     { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8ead3" }] },
//     { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6a9a6a" }] },

//     // POI — hidden/muted (no highlight clutter)
//     { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
//     { featureType: "poi.business", stylers: [{ visibility: "off" }] },
//     { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
//     { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
//     { featureType: "poi.school", stylers: [{ visibility: "off" }] },

//     // Transit — muted
//     { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e8eaed" }] },
//     { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },

//     // Administrative borders — subtle
//     { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c0c0c0" }] },
//     { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
//     { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "off" }] },
// ];

// // Colors for different drivers (kept for future use)
// // const DRIVER_COLORS = ["#00e5ff", "#ff6b6b", "#69ff47", "#ffd60a", "#c77dff"];

// export default function LiveMap() {
//     const mapRef = useRef<HTMLDivElement>(null);
//     const mapInstanceRef = useRef<google.maps.Map | null>(null);
//     const markersRef = useRef<google.maps.Marker[]>([]);
//     const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
//     const watchIdRef = useRef<number | null>(null);

//     const [isLoading, setIsLoading] = useState(true);
//     const [mapError, setMapError] = useState<string | null>(null);
//     const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
//     const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//     const userMarkerRef = useRef<google.maps.Marker | null>(null);

//     const { data, refetch } = useDashboardQuery(undefined);
//     const dashboardData: DashboardData | undefined = data?.data;
//     const deliveries: Delivery[] = dashboardData?.map?.deliveries ?? [];

//     console.log(deliveries, '====================')

//     const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '';

//     // --- Initialize map ---
//     const initializeMap = useCallback(async () => {
//         if (!mapRef.current || !GOOGLE_MAPS_API_KEY) {
//             setMapError('Google Maps API key is missing.');
//             setIsLoading(false);
//             return;
//         }
//         try {
//             await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);

//             // Default center: Dhaka (since deliveries are around 23.79, 90.39)
//             const center = deliveries.length > 0
//                 ? { lat: deliveries[0].driver_last_lat, lng: deliveries[0].driver_last_lng }
//                 : { lat: 23.7915, lng: 90.4094 };

//             const map = new window.google.maps.Map(mapRef.current, {
//                 center,
//                 zoom: 14,
//                 styles: MAP_STYLES,
//                 mapTypeId: 'roadmap',
//                 backgroundColor: '#f8f9fa',
//                 disableDefaultUI: false,
//                 zoomControl: true,
//                 mapTypeControl: false,
//                 streetViewControl: false,
//                 fullscreenControl: true,
//                 gestureHandling: 'cooperative',
//             });

//             mapInstanceRef.current = map;
//             setIsLoading(false);
//         } catch (err) {
//             setMapError('Failed to load Google Maps.');
//             setIsLoading(false);
//         }
//     }, [GOOGLE_MAPS_API_KEY]); // eslint-disable-line

//     // --- Place/update driver markers ---
//     const updateDriverMarkers = useCallback(() => {
//         const map = mapInstanceRef.current;
//         if (!map || !window.google?.maps) return;

//         // Clear existing markers
//         markersRef.current.forEach(m => m.setMap(null));
//         markersRef.current = [];
//         infoWindowsRef.current.forEach(iw => iw.close());
//         infoWindowsRef.current = [];

//         deliveries.forEach((delivery, index) => {
//             //   const color = DRIVER_COLORS[index % DRIVER_COLORS.length];
//             const position = { lat: delivery.driver_last_lat, lng: delivery.driver_last_lng };

//             const marker = new window.google.maps.Marker({
//                 position,
//                 map,
//                 title: `${delivery.driver_name} (${delivery.truck_id})`,
//                 icon: {
//                     url: '/image/truck.png',
//                     scaledSize: new window.google.maps.Size(48, 48),
//                     anchor: new window.google.maps.Point(24, 24),
//                 },
//                 animation: window.google.maps.Animation.DROP,
//                 zIndex: 100 + index,
//             });

//             const infoContent = `
//         <div style="
//           background: #ffffff;
//           border: 1px solid #e0e0e0;
//           border-radius: 10px;
//           padding: 12px 16px;
//           color: #222;
//           font-family: 'Segoe UI', sans-serif;
//           min-width: 180px;
//           box-shadow: 0 4px 16px rgba(0,0,0,0.12);
//         ">
//           <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
//             <img src="/image/truck.png" width="28" height="28" style="object-fit:contain;" />
//             <strong style="color:#1565C0;font-size:15px;">${delivery.driver_name}</strong>
//           </div>
//           <div style="font-size:12px;color:#1f2937;margin-bottom:4px;">
//             Truck ID: <span style="font-weight:700;color:#0f172a;">${delivery.truck_id}</span>
//           </div>
//           <div style="font-size:12px;color:#555;margin-bottom:4px;">
//             Status: <span style="color:#2e7d32;font-weight:600;">${delivery.status.replace('_', ' ').toUpperCase()}</span>
//           </div>
//           <div style="font-size:11px;color:#999;margin-top:6px;">
//             📍 ${delivery.driver_last_lat.toFixed(5)}, ${delivery.driver_last_lng.toFixed(5)}
//           </div>
//         </div>
//       `;

//             const infoWindow = new window.google.maps.InfoWindow({ content: infoContent });
//             infoWindowsRef.current.push(infoWindow);

//             marker.addListener('click', () => {
//                 // Close all other info windows
//                 infoWindowsRef.current.forEach(iw => iw.close());
//                 infoWindow.open(map, marker);
//                 map.panTo(position);
//                 map.setZoom(16);
//                 setSelectedDriver(index);
//             });

//             markersRef.current.push(marker);
//         });

//         // Fit bounds to all markers
//         if (deliveries.length > 1) {
//             const bounds = new window.google.maps.LatLngBounds();
//             deliveries.forEach(d => bounds.extend({ lat: d.driver_last_lat, lng: d.driver_last_lng }));
//             if (userLocation) bounds.extend(userLocation);
//             map.fitBounds(bounds, { top: 80, right: 40, bottom: 40, left: 40 });
//         }
//     }, [deliveries, userLocation]);

//     // --- User's live location ---
//     const trackUserLocation = useCallback(() => {
//         if (!navigator.geolocation) return;

//         watchIdRef.current = navigator.geolocation.watchPosition(
//             (pos) => {
//                 const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//                 setUserLocation(loc);

//                 const map = mapInstanceRef.current;
//                 if (!map || !window.google?.maps) return;

//                 if (userMarkerRef.current) {
//                     userMarkerRef.current.setPosition(loc);
//                 } else {
//                     userMarkerRef.current = new window.google.maps.Marker({
//                         position: loc,
//                         map,
//                         title: 'Your Location',
//                         icon: {
//                             path: window.google.maps.SymbolPath.CIRCLE,
//                             scale: 10,
//                             fillColor: '#4285F4',
//                             fillOpacity: 1,
//                             strokeColor: '#fff',
//                             strokeWeight: 3,
//                         },
//                         zIndex: 999,
//                     });

//                     const iw = new window.google.maps.InfoWindow({
//                         content: `<div style="background:#1a1a2e;color:#4285F4;padding:8px 12px;border-radius:8px;font-weight:600;border:1px solid #4285F4">📍 Your Location</div>`,
//                     });
//                     userMarkerRef.current.addListener('click', () => iw.open(map, userMarkerRef.current!));
//                 }
//             },
//             (err) => console.warn('Geolocation error:', err),
//             { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
//         );
//     }, []);

//     // --- Center on all drivers ---
//     const fitAllDrivers = useCallback(() => {
//         const map = mapInstanceRef.current;
//         if (!map || deliveries.length === 0) return;
//         const bounds = new window.google.maps.LatLngBounds();
//         deliveries.forEach(d => bounds.extend({ lat: d.driver_last_lat, lng: d.driver_last_lng }));
//         map.fitBounds(bounds, { top: 80, right: 40, bottom: 80, left: 40 });
//         setSelectedDriver(null);
//         infoWindowsRef.current.forEach(iw => iw.close());
//     }, [deliveries]);

//     // --- Focus a specific driver ---
//     const focusDriver = useCallback((index: number) => {
//         const map = mapInstanceRef.current;
//         if (!map || !deliveries[index]) return;
//         const pos = { lat: deliveries[index].driver_last_lat, lng: deliveries[index].driver_last_lng };
//         map.panTo(pos);
//         map.setZoom(16);
//         setSelectedDriver(index);
//         infoWindowsRef.current.forEach(iw => iw.close());
//         infoWindowsRef.current[index]?.open(map, markersRef.current[index]);
//     }, [deliveries]);

//     // --- Center on user ---
//     const goToUserLocation = useCallback(() => {
//         const map = mapInstanceRef.current;
//         if (!map || !userLocation) return;
//         map.panTo(userLocation);
//         map.setZoom(16);
//     }, [userLocation]);

//     // --- Effects ---
//     useEffect(() => {
//         initializeMap();
//         trackUserLocation();
//         return () => {
//             if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
//             markersRef.current.forEach(m => m.setMap(null));
//             if (userMarkerRef.current) userMarkerRef.current.setMap(null);
//         };
//     }, []); // eslint-disable-line

//     useEffect(() => {
//         if (!isLoading && mapInstanceRef.current) {
//             updateDriverMarkers();
//         }
//     }, [isLoading, updateDriverMarkers]);

//     // Auto-refresh every 30s
//     useEffect(() => {
//         const interval = setInterval(() => { refetch(); }, 30000);
//         return () => clearInterval(interval);
//     }, [refetch]);

//     return (
//         <div className="flex flex-col gap-4">


//             {/* Map Container */}
//             <div className="relative rounded-2xl overflow-hidden" style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
//                 {/* Toolbar */}
//                 <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
//                     <button
//                         onClick={fitAllDrivers}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
//                         style={{ background: '#fff', color: '#1565C0', border: '1px solid #1565C033' }}
//                     >
//                         <MapPin size={12} /> All Drivers
//                     </button>
//                     {userLocation && (
//                         <button
//                             onClick={goToUserLocation}
//                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
//                             style={{ background: '#fff', color: '#4285F4', border: '1px solid #4285F444' }}
//                         >
//                             <Navigation size={12} /> My Location
//                         </button>
//                     )}
//                     <button
//                         onClick={() => { refetch(); setTimeout(updateDriverMarkers, 500); }}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
//                         style={{ background: '#fff', color: '#2e7d32', border: '1px solid #2e7d3233' }}
//                     >
//                         <RefreshCw size={12} /> Refresh
//                     </button>
//                 </div>

//                 {/* Driver Quick-Select Buttons */}
//                 {/* {deliveries.length > 0 && (
//           <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
//             {deliveries.map((_, index) => {
//               const isSel = selectedDriver === index;
//               return (
//                 <button
//                   key={index}
//                   onClick={() => focusDriver(index)}
//                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
//                   style={{
//                     background: isSel ? '#1565C011' : '#fff',
//                     color: '#1565C0',
//                     border: `1px solid #1565C0${isSel ? 'cc' : '33'}`,
//                   }}
//                 >
//                   <Truck size={12} /> Driver {index + 1}
//                 </button>
//               );
//             })}
//           </div>
//         )} */}

//                 {/* Map div */}
//                 <div ref={mapRef} className="w-full" style={{ height: 520 }} />

//                 {/* Loading overlay */}
//                 {isLoading && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: '#f8f9facc' }}>
//                         <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
//                         <p className="text-sm text-gray-500">Loading map…</p>
//                     </div>
//                 )}

//                 {/* Error overlay */}
//                 {mapError && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: '#f8f9facc' }}>
//                         <MapPin size={32} className="mb-2 text-red-500" />
//                         <p className="text-sm text-red-500 font-semibold">{mapError}</p>
//                         <p className="text-xs text-gray-400 mt-1">Check your NEXT_PUBLIC_GOOGLE_API_KEY</p>
//                     </div>
//                 )}
//             </div>

//             {/* Driver Location Cards */}
//             {deliveries.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     {deliveries.map((delivery, index) => {
//                         const isSelected = selectedDriver === index;
//                         return (
//                             <button
//                                 key={index}
//                                 onClick={() => focusDriver(index)}
//                                 className="rounded-xl p-4 text-left transition-all hover:scale-[1.02] shadow-sm"
//                                 style={{
//                                     background: isSelected ? '#1565C011' : '#ffffff',
//                                     border: `1px solid ${isSelected ? '#1565C0aa' : '#e0e0e0'}`,
//                                 }}
//                             >
//                                 <div className="flex items-center gap-3 mb-2">
//                                     <div className="size-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-50 border-2"
//                                         style={{ borderColor: isSelected ? '#1565C0' : '#e0e0e0' }}>
//                                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                                         <img src="/image/truck.png" alt="car" className="w-7 h-7 object-contain" />
//                                     </div>
//                                     <div>
//                                         <p className="font-bold text-sm text-gray-800">{delivery.driver_name}</p>
//                                         <p className="text-xs text-gray-500">Truck: {delivery.truck_id}</p>
//                                         <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700 border border-green-200">
//                                             {delivery.status.replace('_', ' ')}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="text-xs text-gray-400 font-mono">
//                                     <span className="text-blue-600">LAT</span> {delivery.driver_last_lat.toFixed(6)}
//                                     <span className="mx-2 text-gray-300">|</span>
//                                     <span className="text-blue-600">LNG</span> {delivery.driver_last_lng.toFixed(6)}
//                                 </div>
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }
'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Navigation, MapPin, RefreshCw } from "lucide-react";
import { useDashboardQuery } from '@/redux/feature/gasCompany/dashboardSlice';

// --- Types ---
interface Delivery {
    status: string;
    driver_last_lat: number;
    driver_last_lng: number;
    driver_name: string;
    truck_id: string;
}

interface DashboardData {
    today_total_order: number;
    in_transit: number;
    completed_deliveries: number;
    today_total_revenue: number;
    drivers: {
        online: number;
        on_delivery: number;
        offline: number;
    };
    map: {
        deliveries: Delivery[];
    };
}

// ✅ FIX: Declare google as `any` — never reference `typeof google` or `google.maps.*`
//    at the top level, as the google namespace does not exist at build/compile time.
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google: any;
        initMap: () => void;
    }
}

// ✅ FIX: Use `any` instead of google.maps.* type aliases.
//    google.maps.Map / Marker / InfoWindow are NOT available at compile time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMMap = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMMarker = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMInfoWindow = any;

// --- Utility ---
function loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.google?.maps) return resolve();
        if (document.getElementById('google-maps-script')) {
            const interval = setInterval(() => {
                if (window.google?.maps) { clearInterval(interval); resolve(); }
            }, 100);
            return;
        }
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google Maps failed to load'));
        document.head.appendChild(script);
    });
}

// ✅ FIX: Use `Record<string, unknown>[]` — NOT `google.maps.MapTypeStyle[]`
const MAP_STYLES: Record<string, unknown>[] = [
    { elementType: "geometry", stylers: [{ color: "#f8f9fa" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fdd835" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#f9a825" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "geometry.stroke", stylers: [{ color: "#d6d6d6" }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.local", elementType: "geometry.stroke", stylers: [{ color: "#eeeeee" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f1f3f4" }] },
    { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#e8eaed" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#b3d1e8" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5d8aa8" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8ead3" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6a9a6a" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
    { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
    { featureType: "poi.school", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e8eaed" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c0c0c0" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
    { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "off" }] },
];

export default function LiveMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<GMMap>(null);
    const markersRef = useRef<GMMarker[]>([]);
    const infoWindowsRef = useRef<GMInfoWindow[]>([]);
    const watchIdRef = useRef<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const userMarkerRef = useRef<GMMarker>(null);

    const { data, refetch } = useDashboardQuery(undefined);
    const dashboardData: DashboardData | undefined = data?.data;
    const deliveries: Delivery[] = dashboardData?.map?.deliveries ?? [];

    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '';

    // --- Initialize map ---
    const initializeMap = useCallback(async () => {
        if (!mapRef.current || !GOOGLE_MAPS_API_KEY) {
            setMapError('Google Maps API key is missing.');
            setIsLoading(false);
            return;
        }
        try {
            await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);

            const center = deliveries.length > 0
                ? { lat: deliveries[0].driver_last_lat, lng: deliveries[0].driver_last_lng }
                : { lat: 23.7915, lng: 90.4094 };

            const map = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 14,
                styles: MAP_STYLES,
                mapTypeId: 'roadmap',
                backgroundColor: '#f8f9fa',
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                gestureHandling: 'cooperative',
            });

            mapInstanceRef.current = map;
            setIsLoading(false);
        } catch {
            setMapError('Failed to load Google Maps.');
            setIsLoading(false);
        }
    }, [GOOGLE_MAPS_API_KEY]); // eslint-disable-line

    // --- Place/update driver markers ---
    const updateDriverMarkers = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || !window.google?.maps) return;

        markersRef.current.forEach((m: GMMarker) => m.setMap(null));
        markersRef.current = [];
        infoWindowsRef.current.forEach((iw: GMInfoWindow) => iw.close());
        infoWindowsRef.current = [];

        deliveries.forEach((delivery, index) => {
            const position = { lat: delivery.driver_last_lat, lng: delivery.driver_last_lng };

            const marker = new window.google.maps.Marker({
                position,
                map,
                title: `${delivery.driver_name} (${delivery.truck_id})`,
                icon: {
                    url: '/image/truck.png',
                    scaledSize: new window.google.maps.Size(48, 48),
                    anchor: new window.google.maps.Point(24, 24),
                },
                animation: window.google.maps.Animation.DROP,
                zIndex: 100 + index,
            });

            const infoContent = `
        <div style="
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          padding: 12px 16px;
          color: #222;
          font-family: 'Segoe UI', sans-serif;
          min-width: 180px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        ">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <img src="/image/truck.png" width="28" height="28" style="object-fit:contain;" />
            <strong style="color:#1565C0;font-size:15px;">${delivery.driver_name}</strong>
          </div>
          <div style="font-size:12px;color:#1f2937;margin-bottom:4px;">
            Truck ID: <span style="font-weight:700;color:#0f172a;">${delivery.truck_id}</span>
          </div>
          <div style="font-size:12px;color:#555;margin-bottom:4px;">
            Status: <span style="color:#2e7d32;font-weight:600;">${delivery.status.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div style="font-size:11px;color:#999;margin-top:6px;">
            📍 ${delivery.driver_last_lat.toFixed(5)}, ${delivery.driver_last_lng.toFixed(5)}
          </div>
        </div>
      `;

            const infoWindow = new window.google.maps.InfoWindow({ content: infoContent });
            infoWindowsRef.current.push(infoWindow);

            marker.addListener('click', () => {
                infoWindowsRef.current.forEach((iw: GMInfoWindow) => iw.close());
                infoWindow.open(map, marker);
                map.panTo(position);
                map.setZoom(16);
                setSelectedDriver(index);
            });

            markersRef.current.push(marker);
        });

        if (deliveries.length > 1) {
            const bounds = new window.google.maps.LatLngBounds();
            deliveries.forEach((d: Delivery) => bounds.extend({ lat: d.driver_last_lat, lng: d.driver_last_lng }));
            if (userLocation) bounds.extend(userLocation);
            map.fitBounds(bounds, { top: 80, right: 40, bottom: 40, left: 40 });
        }
    }, [deliveries, userLocation]);

    // --- User's live location ---
    const trackUserLocation = useCallback(() => {
        if (!navigator.geolocation) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserLocation(loc);

                const map = mapInstanceRef.current;
                if (!map || !window.google?.maps) return;

                if (userMarkerRef.current) {
                    userMarkerRef.current.setPosition(loc);
                } else {
                    userMarkerRef.current = new window.google.maps.Marker({
                        position: loc,
                        map,
                        title: 'Your Location',
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#4285F4',
                            fillOpacity: 1,
                            strokeColor: '#fff',
                            strokeWeight: 3,
                        },
                        zIndex: 999,
                    });

                    const iw = new window.google.maps.InfoWindow({
                        content: `<div style="background:#1a1a2e;color:#4285F4;padding:8px 12px;border-radius:8px;font-weight:600;border:1px solid #4285F4">📍 Your Location</div>`,
                    });
                    userMarkerRef.current.addListener('click', () => iw.open(map, userMarkerRef.current));
                }
            },
            (err) => console.warn('Geolocation error:', err),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
    }, []);

    // --- Center on all drivers ---
    const fitAllDrivers = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || deliveries.length === 0) return;
        const bounds = new window.google.maps.LatLngBounds();
        deliveries.forEach((d: Delivery) => bounds.extend({ lat: d.driver_last_lat, lng: d.driver_last_lng }));
        map.fitBounds(bounds, { top: 80, right: 40, bottom: 80, left: 40 });
        setSelectedDriver(null);
        infoWindowsRef.current.forEach((iw: GMInfoWindow) => iw.close());
    }, [deliveries]);

    // --- Focus a specific driver ---
    const focusDriver = useCallback((index: number) => {
        const map = mapInstanceRef.current;
        if (!map || !deliveries[index]) return;
        const pos = { lat: deliveries[index].driver_last_lat, lng: deliveries[index].driver_last_lng };
        map.panTo(pos);
        map.setZoom(16);
        setSelectedDriver(index);
        infoWindowsRef.current.forEach((iw: GMInfoWindow) => iw.close());
        infoWindowsRef.current[index]?.open(map, markersRef.current[index]);
    }, [deliveries]);

    // --- Center on user ---
    const goToUserLocation = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || !userLocation) return;
        map.panTo(userLocation);
        map.setZoom(16);
    }, [userLocation]);

    // --- Effects ---
    useEffect(() => {
        initializeMap();
        trackUserLocation();
        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
            markersRef.current.forEach((m: GMMarker) => m.setMap(null));
            if (userMarkerRef.current) userMarkerRef.current.setMap(null);
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        if (!isLoading && mapInstanceRef.current) {
            updateDriverMarkers();
        }
    }, [isLoading, updateDriverMarkers]);

    useEffect(() => {
        const interval = setInterval(() => { refetch(); }, 30000);
        return () => clearInterval(interval);
    }, [refetch]);

    return (
        <div className="flex flex-col gap-4">
            {/* Map Container */}
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            >
                {/* Toolbar */}
                <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
                    <button
                        onClick={fitAllDrivers}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
                        style={{ background: '#fff', color: '#1565C0', border: '1px solid #1565C033' }}
                    >
                        <MapPin size={12} /> All Drivers
                    </button>
                    {userLocation && (
                        <button
                            onClick={goToUserLocation}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
                            style={{ background: '#fff', color: '#4285F4', border: '1px solid #4285F444' }}
                        >
                            <Navigation size={12} /> My Location
                        </button>
                    )}
                    <button
                        onClick={() => { refetch(); setTimeout(updateDriverMarkers, 500); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
                        style={{ background: '#fff', color: '#2e7d32', border: '1px solid #2e7d3233' }}
                    >
                        <RefreshCw size={12} /> Refresh
                    </button>
                </div>

                {/* Map div */}
                <div ref={mapRef} className="w-full" style={{ height: 520 }} />

                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: '#f8f9facc' }}>
                        <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
                        <p className="text-sm text-gray-500">Loading map…</p>
                    </div>
                )}

                {/* Error overlay */}
                {mapError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: '#f8f9facc' }}>
                        <MapPin size={32} className="mb-2 text-red-500" />
                        <p className="text-sm text-red-500 font-semibold">{mapError}</p>
                        <p className="text-xs text-gray-400 mt-1">Check your NEXT_PUBLIC_GOOGLE_API_KEY</p>
                    </div>
                )}
            </div>

            {/* Driver Location Cards */}
            {deliveries.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {deliveries.map((delivery, index) => {
                        const isSelected = selectedDriver === index;
                        return (
                            <button
                                key={index}
                                onClick={() => focusDriver(index)}
                                className="rounded-xl p-4 text-left transition-all hover:scale-[1.02] shadow-sm"
                                style={{
                                    background: isSelected ? '#1565C011' : '#ffffff',
                                    border: `1px solid ${isSelected ? '#1565C0aa' : '#e0e0e0'}`,
                                }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="size-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-50 border-2"
                                        style={{ borderColor: isSelected ? '#1565C0' : '#e0e0e0' }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/image/truck.png" alt="truck" className="w-7 h-7 object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{delivery.driver_name}</p>
                                        <p className="text-xs text-gray-500">Truck: {delivery.truck_id}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700 border border-green-200">
                                            {delivery.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    <span className="text-blue-600">LAT</span> {delivery.driver_last_lat.toFixed(6)}
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="text-blue-600">LNG</span> {delivery.driver_last_lng.toFixed(6)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}