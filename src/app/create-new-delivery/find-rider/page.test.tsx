
// // /* eslint-disable @next/next/no-img-element */

// // "use client";

// // import CarLite from "@/components/icon/carLite";
// // import { useCancelDeliveryMutation, useGetDeliveryQuery, useRateDeliveryMutation } from "@/redux/feature/deliverySlice";
// // import { Copy, CopyCheck, MessageCircle, Phone, Send, Star, X } from "lucide-react";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { Suspense, useEffect, useMemo, useRef, useState } from "react";
// // import { toast } from "sonner";
// // import { Rating } from 'react-simple-star-rating'
// // import { FaSpinner } from "react-icons/fa";
// // import { useCreateConversationMutation } from "@/redux/feature/chatSlice";

// // type LatLng = {
// //     lat: number;
// //     lng: number;
// // };

// // declare global {
// //     interface Window {
// //         google: any;
// //     }
// // }

// // const loadGoogleMapsScript = (apiKey: string) => {
// //     if (typeof window === "undefined") return Promise.resolve();
// //     if (window.google?.maps) return Promise.resolve();

// //     return new Promise<void>((resolve, reject) => {
// //         const existingScript = document.querySelector("script[data-google-maps='true']");
// //         if (existingScript) {
// //             existingScript.addEventListener("load", () => resolve());
// //             existingScript.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
// //             return;
// //         }

// //         const script = document.createElement("script");
// //         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
// //         script.async = true;
// //         script.defer = true;
// //         script.dataset.googleMaps = "true";
// //         script.onload = () => resolve();
// //         script.onerror = () => reject(new Error("Google Maps failed to load"));
// //         document.head.appendChild(script);
// //     });
// // };

// // const getHeading = (from: LatLng, to: LatLng) => {
// //     const rad = Math.atan2(to.lng - from.lng, to.lat - from.lat);
// //     return (rad * 180) / Math.PI;
// // };

// //  function FindingRider() {
// //     const params = useSearchParams();
// //     const deliveryId = params.get("deliveryId");
// //     const router = useRouter();
// //     const mapRef = useRef<HTMLDivElement | null>(null);
// //     const [showModal, setShowModal] = useState(false);
// //     const [showConfirm, setShowConfirm] = useState(false);
// //     const [message, setMessage] = useState("");
// //     const [pinCopied, setPinCopied] = useState(false);
// //     const [showMessagePanel, setShowMessagePanel] = useState(false);
// //     const [showRating, setShowRating] = useState(false);
// //     const [rating, setRating] = useState(0);
// //     const [mapsLoaded, setMapsLoaded] = useState(false);
// //     const [mapError, setMapError] = useState<string | null>(null);
// //     const [conversationPublicId, setConversationPublicId] = useState<string | null>(null);

// //     const { data, isLoading } = useGetDeliveryQuery(deliveryId, {
// //         skip: !deliveryId,
// //         refetchOnMountOrArgChange: true,
// //     });
// //     console.log(data, '============>')

// //     const [createConversation] = useCreateConversationMutation();

// //     const [cancelDelivery] = useCancelDeliveryMutation();
// //     const [rateDelivery, { isLoading: ratingLoading }] = useRateDeliveryMutation();

// //     const delivery = ((data as { data?: Record<string, unknown> } | undefined)?.data ?? data) as Record<string, unknown> | undefined;
// //     const apiDriver = (delivery?.driver as Record<string, unknown> | null | undefined) ?? null;
// //     const hasDriver = Boolean(apiDriver);

// //     const pinFromApi = String(delivery?.verification_pin ?? "")
// //         .split("")
// //         .filter((char) => /\d/.test(char))
// //         .map((digit) => Number(digit));

// //     const IMAGE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

// //     const GOOGLEAPI = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

// //     const driver = {
// //         name: String(apiDriver?.name ?? "Assigned Driver"),
// //         rating: Number(apiDriver?.average_rating ?? 0),
// //         price: delivery?.price ? `$${String(delivery.price)}` : "$0",
// //         vehicleType: String(apiDriver?.vehicle_type ?? delivery?.vehicle_type ?? "Vehicle"),
// //         brand: String(apiDriver?.brand ?? "N/A"),
// //         model: String(apiDriver?.model ?? "N/A"),
// //         registration: String(apiDriver?.registration_number ?? "N/A"),
// //         plate: String(apiDriver?.vehicle_number ?? apiDriver?.plate_number ?? "N/A"),
// //         phone: String(apiDriver?.phone ?? "N/A"),
// //         pin: pinFromApi.length > 0 ? pinFromApi : [0, 0, 0, 0],
// //         avatar: IMAGE ? `${IMAGE}${apiDriver?.profile_image ?? "/image/user.png"}` : "/image/user.png",
// //     };

// //     const pickup = useMemo<LatLng | null>(() => {
// //         const lat = Number(delivery?.pickup_lat);
// //         const lng = Number(delivery?.pickup_lng);
// //         if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
// //         return { lat, lng };
// //     }, [delivery]);

// //     const dropoff = useMemo<LatLng | null>(() => {
// //         const lat = Number(delivery?.dropoff_lat);
// //         const lng = Number(delivery?.dropoff_lng);
// //         if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
// //         return { lat, lng };
// //     }, [delivery]);

// //     const loading = !deliveryId || isLoading || !mapsLoaded;

// //     const updateConversationQuery = (publicId: string) => {
// //         const nextParams = new URLSearchParams(params.toString());
// //         nextParams.set("conversationId", publicId);
// //         const nextQuery = nextParams.toString();
// //         router.replace(nextQuery ? `/create-new-delivery/find-rider?${nextQuery}` : "/create-new-delivery/find-rider");
// //     };

// //     const ensureConversation = async () => {
// //         if (conversationPublicId) {
// //             updateConversationQuery(conversationPublicId);
// //             return conversationPublicId;
// //         }

// //         const res = await createConversation({ user_id: data?.driver?.user_id, delivery_id: data?.id }).unwrap();
// //         const publicId = String(res.data?.public_id || "");
// //         if (publicId) {
// //             setConversationPublicId(publicId);
// //             updateConversationQuery(publicId);
// //         }
// //         return publicId;
// //     };

// //     // ✅ Helper: close all modals at once
// //     const closeAllModals = () => {
// //         setShowModal(false);
// //         setShowMessagePanel(false);
// //         setShowConfirm(false);
// //         setShowRating(false);
// //     };

// //     // ✅ Helper: open only one modal, close rest
// //     const openModal = (modal: "match" | "message" | "confirm" | "rating") => {
// //         setShowModal(modal === "match");
// //         setShowMessagePanel(modal === "message");
// //         setShowConfirm(modal === "confirm");
// //         setShowRating(modal === "rating");

// //         if (modal === "message" && data?.driver?.user_id && data?.id) {
// //             ensureConversation().catch(() => {
// //                 toast.error("Unable to start chat. Please try again.");
// //             });
// //         }
// //     };

// //     useEffect(() => {
// //         if (hasDriver) {
// //             openModal("match");
// //             return;
// //         }
// //         closeAllModals();
// //     }, [hasDriver]);

// //     useEffect(() => {
// //         if (!GOOGLEAPI) {
// //             setMapError("Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_API_KEY.");
// //             return;
// //         }

// //         loadGoogleMapsScript(GOOGLEAPI)
// //             .then(() => setMapsLoaded(true))
// //             .catch((error: Error) => setMapError(error.message));
// //     }, [GOOGLEAPI]);

// //     useEffect(() => {
// //         if (!mapsLoaded || !pickup || !dropoff || !mapRef.current || !window.google?.maps) return;

// //         const map = new window.google.maps.Map(mapRef.current, {
// //             center: pickup,
// //             zoom: 12,
// //             mapTypeControl: false,
// //             streetViewControl: false,
// //             fullscreenControl: true,
// //         });

// //         const bounds = new window.google.maps.LatLngBounds();
// //         bounds.extend(pickup);
// //         bounds.extend(dropoff);
// //         map.fitBounds(bounds, 120);

// //         const pickupMarker = new window.google.maps.Marker({
// //             position: pickup,
// //             map,
// //             title: "Pickup",
// //             label: "P",
// //         });

// //         const dropoffMarker = new window.google.maps.Marker({
// //             position: dropoff,
// //             map,
// //             title: "Dropoff",
// //             label: "D",
// //         });

// //         const directionsService = new window.google.maps.DirectionsService();
// //         const directionsRenderer = new window.google.maps.DirectionsRenderer({
// //             map,
// //             suppressMarkers: true,
// //             preserveViewport: true,
// //             polylineOptions: {
// //                 strokeColor: "#0A72B9",
// //                 strokeOpacity: 1,
// //                 strokeWeight: 5,
// //             },
// //         });

// //         let timerId: number | null = null;
// //         let carMarker: any = null;

// //         directionsService.route(
// //             {
// //                 origin: pickup,
// //                 destination: dropoff,
// //                 travelMode: window.google.maps.TravelMode.DRIVING,
// //             },
// //             (result: any, status: string) => {
// //                 if (status === "OK" && result) {
// //                     directionsRenderer.setDirections(result);
// //                     const points = result.routes?.[0]?.overview_path ?? [];

// //                     // if (points.length > 1) {
// //                     //     carMarker = new window.google.maps.Marker({
// //                     //         position: points[0],
// //                     //         map,
// //                     //         title: "Driver live location",
// //                     //         icon: {
// //                     //             path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
// //                     //             fillColor: "#16A34A",
// //                     //             fillOpacity: 1,
// //                     //             strokeColor: "#16A34A",
// //                     //             strokeWeight: 2,
// //                     //             scale: 6,
// //                     //             rotation: getHeading(
// //                     //                 { lat: points[0].lat(), lng: points[0].lng() },
// //                     //                 { lat: points[1].lat(), lng: points[1].lng() }
// //                     //             ),
// //                     //         },
// //                     //     });

// //                     //     let pointIndex = 0;
// //                     //     timerId = window.setInterval(() => {
// //                     //         const nextPointIndex = (pointIndex + 1) % points.length;
// //                     //         const currentPoint = points[pointIndex];
// //                     //         const nextPoint = points[nextPointIndex];
// //                     //         const heading = getHeading(
// //                     //             { lat: currentPoint.lat(), lng: currentPoint.lng() },
// //                     //             { lat: nextPoint.lat(), lng: nextPoint.lng() }
// //                     //         );

// //                     //         carMarker.setPosition(nextPoint);
// //                     //         carMarker.setIcon({
// //                     //             path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
// //                     //             fillColor: "#16A34A",
// //                     //             fillOpacity: 1,
// //                     //             strokeColor: "#16A34A",
// //                     //             strokeWeight: 2,
// //                     //             scale: 6,
// //                     //             rotation: heading,
// //                     //         });

// //                     //         pointIndex = nextPointIndex;
// //                     //     }, 1500);
// //                     // }
// //                     return;
// //                 }

// //                 new window.google.maps.Polyline({
// //                     path: [pickup, dropoff],
// //                     geodesic: true,
// //                     strokeColor: "#0A72B9",
// //                     strokeOpacity: 1,
// //                     strokeWeight: 4,
// //                     map,
// //                 });
// //             }
// //         );

// //         return () => {
// //             if (timerId) window.clearInterval(timerId);
// //             pickupMarker.setMap(null);
// //             dropoffMarker.setMap(null);
// //             if (carMarker) carMarker.setMap(null);
// //             directionsRenderer.setMap(null);
// //         };
// //     }, [mapsLoaded, pickup, dropoff]);

// //     const copyPin = async () => {
// //         try {
// //             const pinStr = driver.pin.join(" ");
// //             if (navigator.clipboard && navigator.clipboard.writeText) {
// //                 await navigator.clipboard.writeText(pinStr);
// //             } else {
// //                 const el = document.createElement("textarea");
// //                 el.value = pinStr;
// //                 document.body.appendChild(el);
// //                 el.select();
// //                 document.execCommand("copy");
// //                 document.body.removeChild(el);
// //             }
// //             setPinCopied(true);
// //             setTimeout(() => setPinCopied(false), 1500);
// //         } catch (e) {
// //             console.error("copy failed", e);
// //         }
// //     };

// //     const handleRating = (rate: number) => {
// //         setRating(rate);
// //     };

// //     const onPointerEnter = () => console.log('Enter');
// //     const onPointerLeave = () => console.log('Leave');
// //     const onPointerMove = (value: number, index: number) => console.log(value, index);

// //     const handleSendMessage = async (message: string) => {
// //         if (!message.trim()) return;
// //         try {
// //             const publicId = await ensureConversation();
// //             if (!publicId) {
// //                 toast.error("Chat not available for this delivery yet.");
// //                 return;
// //             }
// //             router.push(`/inbox?conversationId=${publicId}&text=${encodeURIComponent(message)}`);
// //         } catch (error) {
// //             console.error("Failed to send message:", error);
// //         }
// //     };

// //     const confirmCancel = async () => {
// //         if (!deliveryId) return;
// //         try {
// //             const res = await cancelDelivery(deliveryId).unwrap();
// //             toast.success(res.message || "Delivery canceled successfully!");
// //             closeAllModals();
// //         } catch (error: any) {
// //             toast.error(error.data?.detail || "Failed to cancel delivery. Please try again.");
// //         }
// //     };

// //     const handleSubmitRating = async () => {
// //         if (rating === 0) return;
// //         try {
// //             const res = await rateDelivery({ deliveryId, data: { rating } }).unwrap();
// //             toast.success(res.message || "Rating submitted successfully!");
// //             closeAllModals();
// //         } catch (error: any) {
// //             toast.error(error.data?.detail || "Failed to submit rating. Please try again.");
// //         }
// //     };

// //     return (
// //         <div className="relative w-full h-full overflow-hidden">

// //             <div
// //                 ref={mapRef}
// //                 className={`absolute inset-0 w-full h-full transition-all duration-500 ${loading ? "blur-md scale-105" : "blur-0 scale-100"}`}
// //             />

// //             {mapError && (
// //                 <div className="absolute top-4 left-1/2 z-60 -translate-x-1/2 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
// //                     {mapError}
// //                 </div>
// //             )}

// //             {/* Loading */}
// //             {loading && (
// //                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
// //                     <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
// //                         Finding the best ride for your pickup time....
// //                     </p>
// //                     <div className="flex items-center justify-center">
// //                         <iframe
// //                             src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
// //                             className="w-48 h-48 md:w-80 md:h-80"
// //                         />
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ✅ Match Modal — opens first, closes when X or Message Driver clicked */}
// //             {showModal && hasDriver && (
// //                 <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
// //                     <h1 className="text-xl text-center lg:text-4xl font-medium text-white mb-6">
// //                         We’ve matched you with a trusted driver for your scheduled delivery
// //                     </h1>
// //                     <div className="pointer-events-auto w-[92%] max-w-xl bg-white rounded-xl shadow-lg p-6 mx-4 relative">

// //                         {/* Close → opens Message Panel */}
// //                         <div
// //                             className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-xl"
// //                             onClick={closeAllModals}
// //                         >
// //                             <X className="text-white w-5 h-5" />
// //                         </div>

// //                         <div className="flex items-center gap-4 mt-4 justify-between">
// //                             <div className="flex items-center gap-4">
// //                                 <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
// //                                 <div>
// //                                     <div className="font-medium">{driver.name}</div>
// //                                     <div className="text-sm text-[#0A72B9] flex items-center gap-1">
// //                                         <Star className="inline w-4 h-4" />{driver.rating}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                             <div className="text-2xl font-medium text-[#1E1E1C]">{driver.price}</div>
// //                         </div>

// //                         <div className="mt-4 text-sm text-slate-600">
// //                             <div className="flex items-center gap-2 text-lg font-medium text-[#4B5563] capitalize">
// //                                 <CarLite />
// //                                 <span>{driver.vehicleType} - {driver.brand} {driver.model} • {driver.registration}</span>
// //                             </div>
// //                         </div>

// //                         <div className="mt-4 text-lg font-medium text-[#4B5563]">
// //                             <div className="flex items-center gap-2">
// //                                 <span>Delivery Verification PIN:</span>
// //                                 <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
// //                                 <button onClick={copyPin} className="ml-2 text-sky-600">
// //                                     {pinCopied ? <CopyCheck /> : <Copy />}
// //                                 </button>
// //                             </div>
// //                         </div>

// //                         <div className="mt-4 w-full flex flex-col gap-3 lg:flex-row lg:items-center">
// //                             {/* Cancel → opens Confirm modal */}
// //                             <button
// //                                 onClick={() => openModal("confirm")}
// //                                 className="w-full lg:flex-1 bg-[#E5E5E5] text-[#1E1E1C] px-4 py-3 rounded-md flex items-center justify-center gap-2"
// //                             >
// //                                 <X className="w-5 h-5" />
// //                                 Cancel Delivery
// //                             </button>

// //                             {/* Message Driver → opens Message Panel */}
// //                             <button
// //                                 onClick={() => openModal("message")}
// //                                 className="w-full lg:flex-1 bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white px-4 py-3 rounded-md flex items-center justify-center gap-2"
// //                             >
// //                                 <MessageCircle className="w-5 h-5" />
// //                                 Message Driver
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ✅ Message Panel — opens after Match Modal, closes when Rating opened */}
// //             {showMessagePanel && (
// //                 <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
// //                     <div className="absolute top-8 right-0 lg:right-8 z-70 w-full lg:w-[542px] bg-white rounded-lg shadow-lg pointer-events-auto">
// //                         <p className="p-4 text-2xl font-medium text-center text-[#1E1E1C]">Pickup in {data?.estimate_arrival_time} min</p>

// //                         <div className="flex items-center justify-between p-4">
// //                             <div className="flex items-center gap-4">
// //                                 <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
// //                                 <div>
// //                                     <div className="font-medium">{driver.name}</div>
// //                                     <div className="text-sm text-[#0A72B9] flex items-center gap-1">
// //                                         <Star className="inline w-4 h-4" />{driver.rating}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                             <p>{driver.price}</p>
// //                         </div>

// //                         <div className="p-4 text-sm text-slate-700">
// //                             <div className="flex items-center gap-2 text-lg text-[#4B5563] capitalize">
// //                                 <CarLite />
// //                                 <span>{driver.vehicleType} - {driver.brand} • {driver.model} • {driver.registration}</span>
// //                             </div>
// //                             <div onClick={() => window.open(`tel:${driver.phone}`, "_blank")} className="flex cursor-pointer items-center gap-2 mt-2 text-lg text-[#4B5563]">
// //                                 <Phone />
// //                                 <span>{driver.phone}</span>
// //                             </div>
// //                             <div className="mt-4 text-lg font-medium text-[#4B5563]">
// //                                 <div className="flex items-center gap-2">
// //                                     <span>Delivery Verification PIN:</span>
// //                                     <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
// //                                     <button onClick={copyPin} className="ml-2 text-sky-600">
// //                                         {pinCopied ? <CopyCheck /> : <Copy />}
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="p-4">
// //                             <div className="flex gap-2">
// //                                 <input
// //                                     value={message}
// //                                     onChange={(e) => setMessage(e.target.value)}
// //                                     placeholder="Message driver"
// //                                     className="flex-1 rounded-md border px-3 py-2 text-sm"
// //                                 />
// //                                 <button
// //                                     onClick={() => handleSendMessage(message)}
// //                                     className="w-10 h-10 rounded-full bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center"
// //                                 >
// //                                     <Send />
// //                                 </button>
// //                             </div>

// //                             <div className="mt-3 flex items-center justify-between text-sm bg-[#E5E5E5] p-4 rounded-lg">
// //                                 {/* Cancel → opens Confirm modal */}
// //                                 <button
// //                                     onClick={() => openModal("confirm")}
// //                                     className="text-slate-500"
// //                                 >
// //                                     Cancel this Delivery?
// //                                 </button>
// //                                 {/* Finish → opens Rating modal */}
// //                                 <button
// //                                     onClick={() => openModal("rating")}
// //                                     className="text-red-500"
// //                                 >
// //                                     Finish & Rate
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ✅ Confirmation Modal — opens over any modal, No → goes back to previous */}
// //             {showConfirm && (
// //                 <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm">
// //                     <div className="bg-white rounded-lg p-6 max-w-xl w-[90%] text-center">
// //                         <h4 className="text-lg lg:text-4xl font-medium text-[#1E1E1C]">
// //                             Are you sure you want to cancel this delivery?
// //                         </h4>
// //                         <div className="mt-6 flex gap-4 justify-center">
// //                             {/* No → go back to Message Panel */}
// //                             <button
// //                                 onClick={() => openModal("message")}
// //                                 className="px-6 py-2 rounded bg-[#E5E5E5] w-full"
// //                             >
// //                                 No
// //                             </button>
// //                             <button
// //                                 onClick={confirmCancel}
// //                                 className="px-6 py-2 rounded bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white w-full"
// //                             >
// //                                 Yes, Cancel
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ✅ Rating Modal — final step, submit closes all */}
// //             {showRating && (
// //                 <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm">
// //                     <div className="bg-white rounded-lg p-6 max-w-lg w-[92%] text-center relative">

// //                         {/* Close → go back to Message Panel */}
// //                         <div
// //                             className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-lg"
// //                             onClick={closeAllModals}
// //                         >
// //                             <X className="text-white w-5 h-5" />
// //                         </div>

// //                         <h4 className="text-2xl font-medium text-[#1E1E1C]">Rate your delivery</h4>
// //                         <div className="mt-4 flex items-center gap-4 justify-center">
// //                             <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
// //                             <h4 className="text-2xl font-medium text-[#1E1E1C]">{driver.name}</h4>
// //                         </div>

// //                         <div className="mt-6 flex items-center justify-center">
// //                             <Rating
// //                                 onClick={handleRating}
// //                                 onPointerEnter={onPointerEnter}
// //                                 onPointerLeave={onPointerLeave}
// //                                 onPointerMove={onPointerMove}
// //                                 initialValue={rating}
// //                                 size={40}
// //                                 allowFraction={false}
// //                                 transition
// //                                 fillColor="#F59E0B"
// //                                 emptyColor="#D1D5DB"
// //                                 style={{ display: "flex", gap: "8px" }}
// //                                 SVGstyle={{ display: "inline-block" }}
// //                             />
// //                         </div>

// //                         <button
// //                             onClick={handleSubmitRating}
// //                             disabled={rating === 0}
// //                             className={`mt-6 w-full py-2 rounded transition-all ${rating === 0
// //                                 ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
// //                                 : 'bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white'
// //                                 }`}
// //                         >
// //                             {ratingLoading ? (
// //                                 <span className="flex items-center justify-center">
// //                                     <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
// //                                     Submitting...
// //                                 </span>
// //                             ) : (
// //                                 "Submit"
// //                             )}
// //                         </button>
// //                     </div>
// //                 </div>
// //             )}

// //         </div>
// //     );
// // }

// // export default function FindRiderPage() {
// //     return <Suspense fallback={<div>Loading...</div>}><FindingRider /></Suspense>;
// // }

// /* eslint-disable @next/next/no-img-element */
// "use client";

// import CarLite from "@/components/icon/carLite";
// import { useCancelDeliveryMutation, useGetDeliveryQuery, useRateDeliveryMutation } from "@/redux/feature/deliverySlice";
// import { Copy, CopyCheck, MessageCircle, Phone, Send, Star, X } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { toast } from "sonner";
// import { Rating } from 'react-simple-star-rating';
// import { FaSpinner } from "react-icons/fa";
// import { useCreateConversationMutation } from "@/redux/feature/chatSlice";

// type LatLng = { lat: number; lng: number };

// declare global {
//     interface Window { google: any; }
// }

// // ==================== CONFIG ====================
// const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://your-backend.com/ws/deliveries/"; // ← CHANGE THIS

// const loadGoogleMapsScript = (apiKey: string) => {
//     if (typeof window === "undefined" || window.google?.maps) return Promise.resolve();
//     return new Promise<void>((resolve, reject) => {
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
//         script.async = true;
//         script.defer = true;
//         script.dataset.googleMaps = "true";
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error("Google Maps failed to load"));
//         document.head.appendChild(script);
//     });
// };

// const getHeading = (from: LatLng, to: LatLng) => {
//     const rad = Math.atan2(to.lng - from.lng, to.lat - from.lat);
//     return (rad * 180) / Math.PI;
// };

// function FindingRider() {
//     const params = useSearchParams();
//     const deliveryId = params.get("deliveryId");
//     const router = useRouter();

//     const mapRef = useRef<HTMLDivElement | null>(null);
//     const carMarkerRef = useRef<any>(null);
//     const wsRef = useRef<WebSocket | null>(null);
//     const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Modals
//     const [showMatchModal, setShowMatchModal] = useState(false);
//     const [showMessagePanel, setShowMessagePanel] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [showRating, setShowRating] = useState(false);

//     const [message, setMessage] = useState("");
//     const [pinCopied, setPinCopied] = useState(false);
//     const [rating, setRating] = useState(0);
//     const [mapsLoaded, setMapsLoaded] = useState(false);
//     const [mapError, setMapError] = useState<string | null>(null);
//     const [conversationPublicId, setConversationPublicId] = useState<string | null>(null);

//     const { data: apiData, isLoading: queryLoading, refetch } = useGetDeliveryQuery(deliveryId, {
//         skip: !deliveryId,
//         refetchOnMountOrArgChange: true,
//     });

//     const [delivery, setDelivery] = useState<any>(null);

//     const [createConversation] = useCreateConversationMutation();
//     const [cancelDelivery] = useCancelDeliveryMutation();
//     const [rateDelivery, { isLoading: ratingLoading }] = useRateDeliveryMutation();

//     const hasDriver = Boolean(delivery?.driver);
//     const currentStatus = String(delivery?.status || "searching").toLowerCase().trim();

//     const IMAGE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
//     const GOOGLEAPI = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
//     const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

//     const driver = useMemo(() => ({
//         name: String(delivery?.driver?.name ?? "Assigned Driver"),
//         rating: Number(delivery?.driver?.average_rating ?? 0),
//         price: delivery?.price ? `$${String(delivery.price)}` : "$0",
//         vehicleType: String(delivery?.driver?.vehicle_type ?? delivery?.vehicle_type ?? "Vehicle"),
//         brand: String(delivery?.driver?.brand ?? "N/A"),
//         model: String(delivery?.driver?.model ?? "N/A"),
//         phone: String(delivery?.driver?.phone ?? "N/A"),
//         pin: String(delivery?.verification_pin ?? "").split("").filter((c: string) => /\d/.test(c)).map(Number),
//         avatar: IMAGE ? `${IMAGE}${delivery?.driver?.profile_image ?? "/image/user.png"}` : "/image/user.png",
//     }), [delivery, IMAGE]);

//     const isSearching = currentStatus === "searching";
//     const isInitialLoading = !deliveryId || queryLoading || !mapsLoaded || !delivery;

//     // Show loading ONLY when searching or truly initial loading (no driver yet)
//     const showLoadingScreen = isSearching || (isInitialLoading && !hasDriver);

//     // ==================== STATUS HANDLER (Fixed) ====================
//     const handleStatusChange = useCallback((status: string) => {
//         const s = status.toLowerCase().trim();
//         console.log("🔄 Status changed to:", s, "| hasDriver:", hasDriver);

//         setShowMatchModal(false);
//         setShowMessagePanel(false);
//         setShowConfirm(false);
//         setShowRating(false);

//         if (s === "searching") return;

//         if (["driver_assigned", "picked_up", "in_transit", "arrived_at_dropoff"].includes(s) && hasDriver) {
//             console.log("✅ Showing Match Modal");
//             setShowMatchModal(true);
//         }

//         if (s === "delivered") {
//             setShowRating(true);
//         }

//         if (s === "cancelled") {
//             toast.info("This delivery has been cancelled.");
//             setTimeout(() => router.push("/create-new-delivery"), 1500);
//         }
//     }, [hasDriver, router]);

//     // ==================== WEB SOCKET ====================
//     const connectWebSocket = useCallback(() => {
//         if (!deliveryId || !token) return;

//         const socketUrl = `${WEBSOCKET_URL}${deliveryId}/?token=${token}`;
//         const socket = new WebSocket(socketUrl);

//         socket.onopen = () => console.log(`✅ WebSocket connected`);

//         socket.onmessage = (event) => {
//             try {
//                 const msg = JSON.parse(event.data);
//                 console.log("📨 WS Message:", msg);

//                 if ((msg.type === "delivery_update" || msg.type === "ongoing_deliveries") && msg.data) {
//                     const updated = Array.isArray(msg.data) ? msg.data[0] : msg.data;
//                     if (updated?.id === Number(deliveryId) || updated?.public_id === deliveryId) {
//                         setDelivery(updated);   // Important: update state first
//                         refetch();
//                         // Small delay to let React update hasDriver
//                         setTimeout(() => handleStatusChange(updated.status), 50);
//                     }
//                 }
//             } catch (err) {
//                 console.error("WebSocket parse error", err);
//             }
//         };

//         socket.onclose = () => {
//             reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
//         };

//         wsRef.current = socket;
//     }, [deliveryId, token, refetch, handleStatusChange]);

//     // Sync initial data from RTK Query
//     useEffect(() => {
//         if (apiData) {
//             const initial = apiData?.data ?? apiData;
//             setDelivery(initial);
//             if (initial?.status) {
//                 setTimeout(() => handleStatusChange(initial.status), 100);
//             }
//         }
//     }, [apiData, handleStatusChange]);

//     // Connect WebSocket
//     useEffect(() => {
//         if (deliveryId && token) connectWebSocket();
//         return () => {
//             wsRef.current?.close();
//             if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
//         };
//     }, [deliveryId, token, connectWebSocket]);

//     // Google Maps Script
//     useEffect(() => {
//         if (!GOOGLEAPI) {
//             setMapError("Google Maps API key is missing");
//             return;
//         }
//         loadGoogleMapsScript(GOOGLEAPI)
//             .then(() => setMapsLoaded(true))
//             .catch((e) => setMapError(e.message));
//     }, [GOOGLEAPI]);

//     // ==================== HELPER FUNCTIONS ====================
//     const copyPin = async () => {
//         try {
//             await navigator.clipboard.writeText(driver.pin.join(" "));
//             setPinCopied(true);
//             setTimeout(() => setPinCopied(false), 1500);
//         } catch (e) { console.error(e); }
//     };

//     const ensureConversation = async () => { /* your existing ensureConversation code */ };
//     const handleSendMessage = async () => { /* your existing */ };
//     const confirmCancel = async () => { /* your existing */ };
//     const handleSubmitRating = async () => { /* your existing */ };
//     const handleRating = (rate: number) => setRating(rate);

//     const closeAllModals = () => {
//         setShowMatchModal(false);
//         setShowMessagePanel(false);
//         setShowConfirm(false);
//         setShowRating(false);
//     };

//     const openModal = (type: "match" | "message" | "confirm" | "rating") => {
//         closeAllModals();
//         if (type === "match") setShowMatchModal(true);
//         if (type === "message") { setShowMessagePanel(true); ensureConversation(); }
//         if (type === "confirm") setShowConfirm(true);
//         if (type === "rating") setShowRating(true);
//     };

//     const getMatchModalTitle = () => 
//         currentStatus === "picked_up" ? "Driver has picked up your package" : "We’ve matched you with a trusted driver";

//     return (
//         <div className="relative w-full h-full overflow-hidden">
//             <div ref={mapRef} className={`absolute inset-0 w-full h-full ${showLoadingScreen ? "blur-md" : ""}`} />

//             {mapError && <div className="absolute top-4 left-1/2 z-60 bg-red-100 px-4 py-2 text-red-700 rounded">{mapError}</div>}

//             {/* Loading Screen */}
//             {showLoadingScreen && (
//                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
//                         Finding the best ride for your pickup time...
//                     </p>
//                     <iframe src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie" className="w-48 h-48 md:w-80 md:h-80" />
//                 </div>
//             )}

//             {/* MATCH MODAL */}
//             {showMatchModal && hasDriver && (
//                 <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <h1 className="text-xl lg:text-4xl font-medium text-white mb-6 text-center px-4">
//                         {getMatchModalTitle()}
//                     </h1>

//                     <div className="w-[92%] max-w-xl bg-white rounded-xl shadow-lg p-6 relative">
//                         <div className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-xl" onClick={closeAllModals}>
//                             <X className="text-white w-5 h-5" />
//                         </div>

//                         <div className="flex items-center gap-4 mt-4 justify-between">
//                             <div className="flex items-center gap-4">
//                                 <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
//                                 <div>
//                                     <div className="font-medium">{driver.name}</div>
//                                     <div className="text-sm text-[#0A72B9] flex items-center gap-1">
//                                         <Star className="w-4 h-4" /> {driver.rating}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="text-2xl font-medium text-[#1E1E1C]">{driver.price}</div>
//                         </div>

//                         <div className="mt-4 text-sm text-slate-600">
//                             <div className="flex items-center gap-2 text-lg font-medium text-[#4B5563] capitalize">
//                                 <CarLite />
//                                 <span>{driver.vehicleType} - {driver.brand} {driver.model}</span>
//                             </div>
//                         </div>

//                         {currentStatus === "picked_up" && (
//                             <div className="mt-3 text-center text-lg font-medium text-emerald-600">
//                                 Dropoff at 8:15 PM
//                             </div>
//                         )}

//                         <div className="mt-4 text-lg font-medium text-[#4B5563]">
//                             Delivery Verification PIN: <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
//                             <button onClick={copyPin} className="ml-2 text-sky-600">
//                                 {pinCopied ? <CopyCheck className="inline w-5 h-5" /> : <Copy className="inline w-5 h-5" />}
//                             </button>
//                         </div>

//                         <div className="mt-6 flex flex-col gap-3 lg:flex-row">
//                             <button onClick={() => openModal("confirm")} className="flex-1 bg-[#E5E5E5] text-[#1E1E1C] py-3 rounded-md flex items-center justify-center gap-2">
//                                 <X className="w-5 h-5" /> Cancel Delivery
//                             </button>
//                             <button onClick={() => openModal("message")} className="flex-1 bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white py-3 rounded-md flex items-center justify-center gap-2">
//                                 <MessageCircle className="w-5 h-5" /> Message Driver
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add your Message Panel, Confirm Modal, Rating Modal here (same as before) */}

//             {/* Rating Modal Example */}
//             {showRating && (
//                 <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <div className="bg-white rounded-lg p-6 max-w-lg w-[92%] text-center relative">
//                         <div className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-lg" onClick={closeAllModals}>
//                             <X className="text-white w-5 h-5" />
//                         </div>
//                         <h4 className="text-2xl font-medium">Rate your delivery</h4>
//                         {/* ... rest of rating modal ... */}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default function FindRiderPage() {
//     return <Suspense fallback={<div>Loading tracking...</div>}><FindingRider /></Suspense>;
// }

/* eslint-disable @next/next/no-img-element */
// "use client";

// import CarLite from "@/components/icon/carLite";
// import {
//     useCancelDeliveryMutation,
//     useGetDeliveryQuery,
//     useRateDeliveryMutation,
// } from "@/redux/feature/deliverySlice";
// import {
//     Copy,
//     CopyCheck,
//     MessageCircle,
//     Phone,
//     Send,
//     Star,
//     X,
// } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { toast } from "sonner";
// import { Rating } from "react-simple-star-rating";
// import { FaSpinner } from "react-icons/fa";
// import { useCreateConversationMutation } from "@/redux/feature/chatSlice";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type LatLng = { lat: number; lng: number };

// type DeliveryStatus =
//     | "pending"
//     | "searching"
//     | "driver_assigned"
//     | "arrived_at_pickup"
//     | "picked_up"
//     | "in_transit"
//     | "arrived_at_dropoff"
//     | "delivered"
//     | "cancelled";

// declare global {
//     interface Window {
//         google: any;
//     }
// }

// // ─── Google Maps loader ───────────────────────────────────────────────────────

// const loadGoogleMapsScript = (apiKey: string) => {
//     if (typeof window === "undefined") return Promise.resolve();
//     if (window.google?.maps) return Promise.resolve();

//     return new Promise<void>((resolve, reject) => {
//         const existing = document.querySelector("script[data-google-maps='true']");
//         if (existing) {
//             existing.addEventListener("load", () => resolve());
//             existing.addEventListener("error", () =>
//                 reject(new Error("Google Maps failed to load"))
//             );
//             return;
//         }
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
//         script.async = true;
//         script.defer = true;
//         script.dataset.googleMaps = "true";
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error("Google Maps failed to load"));
//         document.head.appendChild(script);
//     });
// };

// const getHeading = (from: LatLng, to: LatLng) => {
//     const rad = Math.atan2(to.lng - from.lng, to.lat - from.lat);
//     return (rad * 180) / Math.PI;
// };

// // ─── Status helpers ───────────────────────────────────────────────────────────

// /** Statuses that show the "match / driver" modal */
// const DRIVER_MODAL_STATUSES: DeliveryStatus[] = [
//     "driver_assigned",
//     "arrived_at_pickup",
// ];

// /** Statuses that show the "message panel" (tracking panel) */
// const MESSAGE_PANEL_STATUSES: DeliveryStatus[] = [
//     "picked_up",
//     "in_transit",
//     "arrived_at_dropoff",
// ];

// const STATUS_LABELS: Record<DeliveryStatus, string> = {
//     pending: "Pending",
//     searching: "Searching for a driver…",
//     driver_assigned: "Driver Assigned",
//     arrived_at_pickup: "Driver Arrived at Pickup",
//     picked_up: "Package Picked Up",
//     in_transit: "In Transit",
//     arrived_at_dropoff: "Arrived at Drop-off",
//     delivered: "Delivered",
//     cancelled: "Cancelled",
// };

// // ─── Component ───────────────────────────────────────────────────────────────

// function FindingRider() {
//     const params = useSearchParams();
//     const deliveryId = params.get("deliveryId");
//     const router = useRouter();

//     // Map
//     const mapRef = useRef<HTMLDivElement | null>(null);
//     const [mapsLoaded, setMapsLoaded] = useState(false);
//     const [mapError, setMapError] = useState<string | null>(null);

//     // Modal states
//     const [showModal, setShowModal] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [showMessagePanel, setShowMessagePanel] = useState(false);
//     const [showRating, setShowRating] = useState(false);

//     // Misc
//     const [message, setMessage] = useState("");
//     const [pinCopied, setPinCopied] = useState(false);
//     const [rating, setRating] = useState(0);
//     const [conversationPublicId, setConversationPublicId] = useState<string | null>(null);

//     // ── WebSocket live delivery data ──────────────────────────────────────────
//     // We keep a wsDelivery state that is updated on every WS message.
//     // The REST query is still used as the initial/fallback source.
//     const [wsDelivery, setWsDelivery] = useState<Record<string, unknown> | null>(null);
//     const wsRef = useRef<WebSocket | null>(null);

//     const connectWebSocket = useCallback(() => {
//         if (!deliveryId) return;

//         const token =
//             typeof window !== "undefined"
//                 ? localStorage.getItem("accessToken")
//                 : null;

//         if (!token) return;

//         const wsUrl = `wss://api.tradlogistics.com/ws/ongoing-deliveries/${deliveryId}/?token=${token}`;

//         // Close any existing connection first
//         if (wsRef.current) {
//             wsRef.current.onclose = null; // prevent reconnect loop
//             wsRef.current.close();
//         }

//         const ws = new WebSocket(wsUrl);
//         wsRef.current = ws;

//         ws.onopen = () => {
//             console.log("[WS] Connected:", wsUrl);
//         };

//         ws.onmessage = (event) => {
//             try {
//                 const payload = JSON.parse(event.data);
//                 // Expected shape: { type, status, data: [ deliveryObject ] }
//                 if (
//                     payload?.type === "ongoing_deliveries" &&
//                     Array.isArray(payload?.data) &&
//                     payload.data.length > 0
//                 ) {
//                     const live = payload.data[0] as Record<string, unknown>;
//                     setWsDelivery(live);
//                 }
//             } catch (err) {
//                 console.error("[WS] parse error:", err);
//             }
//         };

//         ws.onerror = (err) => {
//             console.error("[WS] error:", err);
//         };

//         ws.onclose = (ev) => {
//             console.warn("[WS] closed:", ev.code, ev.reason);
//             // Auto-reconnect after 3 s (unless intentionally closed)
//             if (ev.code !== 1000) {
//                 setTimeout(() => connectWebSocket(), 3000);
//             }
//         };
//     }, [deliveryId]);

//     // Connect WS once deliveryId is available
//     useEffect(() => {
//         connectWebSocket();
//         return () => {
//             if (wsRef.current) {
//                 wsRef.current.onclose = null;
//                 wsRef.current.close(1000, "component unmount");
//             }
//         };
//     }, [connectWebSocket]);

//     // ── REST query (initial load) ─────────────────────────────────────────────
//     const { data: restData, isLoading } = useGetDeliveryQuery(deliveryId, {
//         skip: !deliveryId,
//         refetchOnMountOrArgChange: true,
//     });

//     // Merge: WS data wins when available, fallback to REST
//     const delivery = useMemo<Record<string, unknown> | undefined>(() => {
//         if (wsDelivery) return wsDelivery;
//         return (
//             ((restData as { data?: Record<string, unknown> } | undefined)?.data ??
//                 restData) as Record<string, unknown> | undefined
//         );
//     }, [wsDelivery, restData]);

//     const status = (delivery?.status ?? "searching") as DeliveryStatus;
//     const apiDriver =
//         (delivery?.driver as Record<string, unknown> | null | undefined) ?? null;
//     const hasDriver = Boolean(apiDriver);

//     const IMAGE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
//     const GOOGLEAPI = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

//     const pinFromApi = String(delivery?.verification_pin ?? "")
//         .split("")
//         .filter((c) => /\d/.test(c))
//         .map(Number);

//     const driver = {
//         name: String(apiDriver?.name ?? "Assigned Driver"),
//         rating: Number(apiDriver?.average_rating ?? 0),
//         price: delivery?.price ? `$${String(delivery.price)}` : "$0",
//         vehicleType: String(
//             apiDriver?.vehicle_type ?? delivery?.vehicle_type ?? "Vehicle"
//         ),
//         brand: String(apiDriver?.brand ?? "N/A"),
//         model: String(apiDriver?.model ?? "N/A"),
//         registration: String(apiDriver?.registration_number ?? "N/A"),
//         plate: String(
//             apiDriver?.vehicle_number ?? apiDriver?.plate_number ?? "N/A"
//         ),
//         phone: String(apiDriver?.phone ?? "N/A"),
//         pin: pinFromApi.length > 0 ? pinFromApi : [0, 0, 0, 0],
//         avatar: IMAGE
//             ? `${IMAGE}${apiDriver?.profile_image ?? "/image/user.png"}`
//             : "/image/user.png",
//     };

//     const pickup = useMemo<LatLng | null>(() => {
//         const lat = Number(delivery?.pickup_lat);
//         const lng = Number(delivery?.pickup_lng);
//         if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
//         return { lat, lng };
//     }, [delivery]);

//     const dropoff = useMemo<LatLng | null>(() => {
//         const lat = Number(delivery?.dropoff_lat);
//         const lng = Number(delivery?.dropoff_lng);
//         if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
//         return { lat, lng };
//     }, [delivery]);

//     const loading = !deliveryId || isLoading || !mapsLoaded;

//     // ── Mutations ─────────────────────────────────────────────────────────────
//     const [createConversation] = useCreateConversationMutation();
//     const [cancelDelivery] = useCancelDeliveryMutation();
//     const [rateDelivery, { isLoading: ratingLoading }] = useRateDeliveryMutation();

//     // ── Conversation helpers ──────────────────────────────────────────────────
//     const updateConversationQuery = (publicId: string) => {
//         const nextParams = new URLSearchParams(params.toString());
//         nextParams.set("conversationId", publicId);
//         router.replace(
//             `/create-new-delivery/find-rider?${nextParams.toString()}`
//         );
//     };

//     const ensureConversation = async () => {
//         if (conversationPublicId) {
//             updateConversationQuery(conversationPublicId);
//             return conversationPublicId;
//         }
//         const res = await createConversation({
//             user_id: delivery?.driver
//                 ? (delivery.driver as Record<string, unknown>).user_id
//                 : undefined,
//             delivery_id: delivery?.id,
//         }).unwrap();
//         const publicId = String(res.data?.public_id || "");
//         if (publicId) {
//             setConversationPublicId(publicId);
//             updateConversationQuery(publicId);
//         }
//         return publicId;
//     };

//     // ── Modal helpers ─────────────────────────────────────────────────────────
//     const closeAllModals = () => {
//         setShowModal(false);
//         setShowMessagePanel(false);
//         setShowConfirm(false);
//         setShowRating(false);
//     };

//     const openModal = (
//         modal: "match" | "message" | "confirm" | "rating"
//     ) => {
//         setShowModal(modal === "match");
//         setShowMessagePanel(modal === "message");
//         setShowConfirm(modal === "confirm");
//         setShowRating(modal === "rating");

//         if (modal === "message" && delivery?.driver && delivery?.id) {
//             ensureConversation().catch(() =>
//                 toast.error("Unable to start chat. Please try again.")
//             );
//         }
//     };

//     // ── Status-driven modal logic ─────────────────────────────────────────────
//     // NOTE: We drive UI entirely from `status` — the WS response can have
//     // `driver: null` even when status is "driver_assigned", so we never
//     // gate on `hasDriver` here.
//     useEffect(() => {
//         if (status === "searching" || status === "pending") {
//             closeAllModals();
//             return;
//         }

//         if (DRIVER_MODAL_STATUSES.includes(status)) {
//             setShowModal(true);
//             setShowMessagePanel(false);
//             setShowConfirm(false);
//             setShowRating(false);
//             return;
//         }

//         if (MESSAGE_PANEL_STATUSES.includes(status)) {
//             setShowModal(false);
//             setShowMessagePanel(true);
//             setShowConfirm(false);
//             setShowRating(false);
//             return;
//         }

//         if (status === "delivered") {
//             setShowModal(false);
//             setShowMessagePanel(false);
//             setShowConfirm(false);
//             setShowRating(true);
//             return;
//         }

//         if (status === "cancelled") {
//             closeAllModals();
//             return;
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [status]);

//     // ── Google Maps load ──────────────────────────────────────────────────────
//     useEffect(() => {
//         if (!GOOGLEAPI) {
//             setMapError("Google Maps API key not found.");
//             return;
//         }
//         loadGoogleMapsScript(GOOGLEAPI)
//             .then(() => setMapsLoaded(true))
//             .catch((e: Error) => setMapError(e.message));
//     }, [GOOGLEAPI]);

//     // ── Map render ────────────────────────────────────────────────────────────
//     useEffect(() => {
//         if (!mapsLoaded || !pickup || !dropoff || !mapRef.current || !window.google?.maps)
//             return;

//         const map = new window.google.maps.Map(mapRef.current, {
//             center: pickup,
//             zoom: 12,
//             mapTypeControl: false,
//             streetViewControl: false,
//             fullscreenControl: true,
//         });

//         const bounds = new window.google.maps.LatLngBounds();
//         bounds.extend(pickup);
//         bounds.extend(dropoff);
//         map.fitBounds(bounds, 120);

//         const pickupMarker = new window.google.maps.Marker({
//             position: pickup,
//             map,
//             title: "Pickup",
//             label: "P",
//         });
//         const dropoffMarker = new window.google.maps.Marker({
//             position: dropoff,
//             map,
//             title: "Dropoff",
//             label: "D",
//         });

//         const directionsService = new window.google.maps.DirectionsService();
//         const directionsRenderer = new window.google.maps.DirectionsRenderer({
//             map,
//             suppressMarkers: true,
//             preserveViewport: true,
//             polylineOptions: {
//                 strokeColor: "#0A72B9",
//                 strokeOpacity: 1,
//                 strokeWeight: 5,
//             },
//         });

//         directionsService.route(
//             {
//                 origin: pickup,
//                 destination: dropoff,
//                 travelMode: window.google.maps.TravelMode.DRIVING,
//             },
//             (result: any, status: string) => {
//                 if (status === "OK" && result) {
//                     directionsRenderer.setDirections(result);
//                 } else {
//                     new window.google.maps.Polyline({
//                         path: [pickup, dropoff],
//                         geodesic: true,
//                         strokeColor: "#0A72B9",
//                         strokeOpacity: 1,
//                         strokeWeight: 4,
//                         map,
//                     });
//                 }
//             }
//         );

//         return () => {
//             pickupMarker.setMap(null);
//             dropoffMarker.setMap(null);
//             directionsRenderer.setMap(null);
//         };
//     }, [mapsLoaded, pickup, dropoff]);

//     // ── Helpers ───────────────────────────────────────────────────────────────
//     const copyPin = async () => {
//         try {
//             const pinStr = driver.pin.join(" ");
//             if (navigator.clipboard?.writeText) {
//                 await navigator.clipboard.writeText(pinStr);
//             } else {
//                 const el = document.createElement("textarea");
//                 el.value = pinStr;
//                 document.body.appendChild(el);
//                 el.select();
//                 document.execCommand("copy");
//                 document.body.removeChild(el);
//             }
//             setPinCopied(true);
//             setTimeout(() => setPinCopied(false), 1500);
//         } catch (e) {
//             console.error("copy failed", e);
//         }
//     };

//     const handleSendMessage = async (msg: string) => {
//         if (!msg.trim()) return;
//         try {
//             const publicId = await ensureConversation();
//             if (!publicId) {
//                 toast.error("Chat not available for this delivery yet.");
//                 return;
//             }
//             router.push(
//                 `/inbox?conversationId=${publicId}&text=${encodeURIComponent(msg)}`
//             );
//         } catch (error) {
//             console.error("Failed to send message:", error);
//         }
//     };

//     const confirmCancel = async () => {
//         if (!deliveryId) return;
//         try {
//             const res = await cancelDelivery(deliveryId).unwrap();
//             toast.success(res.message || "Delivery canceled successfully!");
//             closeAllModals();
//         } catch (error: any) {
//             toast.error(
//                 error.data?.detail || "Failed to cancel delivery. Please try again."
//             );
//         }
//     };

//     const handleSubmitRating = async () => {
//         if (rating === 0) return;
//         try {
//             const res = await rateDelivery({
//                 deliveryId,
//                 data: { rating },
//             }).unwrap();
//             toast.success(res.message || "Rating submitted successfully!");
//             closeAllModals();
//         } catch (error: any) {
//             toast.error(
//                 error.data?.detail || "Failed to submit rating. Please try again."
//             );
//         }
//     };

//     // Determine ETA label based on status
//     const etaLabel = MESSAGE_PANEL_STATUSES.includes(status)
//         ? `Dropoff at ${delivery?.estimate_arrival_time ?? "—"}`
//         : `Pickup in ${delivery?.estimated_pickup_time ?? delivery?.estimate_arrival_time ?? "—"} min`;

//     // ── Render ────────────────────────────────────────────────────────────────
//     return (
//         <div className="relative w-full h-full overflow-hidden">

//             {/* Map */}
//             <div
//                 ref={mapRef}
//                 className={`absolute inset-0 w-full h-full transition-all duration-500 ${
//                     (!mapsLoaded || isLoading) ? "blur-md scale-105" : "blur-0 scale-100"
//                 }`}
//             />

//             {mapError && (
//                 <div className="absolute top-4 left-1/2 z-60 -translate-x-1/2 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
//                     {mapError}
//                 </div>
//             )}

//             {/* ── Loading / Searching ────────────────────────────────────────── */}
//             {(!mapsLoaded || isLoading || status === "searching" || status === "pending") &&
//                 !showModal &&
//                 !showMessagePanel &&
//                 !showRating && (
//                     <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
//                         <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
//                             Finding the best ride for your pickup time....
//                         </p>
//                         <div className="flex items-center justify-center">
//                             <iframe
//                                 src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
//                                 className="w-48 h-48 md:w-80 md:h-80"
//                             />
//                         </div>
//                     </div>
//                 )}

//             {/* ── Match Modal (driver_assigned / arrived_at_pickup) ─────────── */}
//             {showModal && (
//                 <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <h1 className="text-xl text-center lg:text-4xl font-medium text-white mb-6 px-4">
//                         We've matched you with a trusted driver for your scheduled delivery
//                     </h1>
//                     <div className="pointer-events-auto w-[92%] max-w-xl bg-white rounded-xl shadow-lg p-6 mx-4 relative">

//                         {/* Status badge */}
//                         <div className="mb-3 flex justify-center">
//                             <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
//                                 {STATUS_LABELS[status]}
//                             </span>
//                         </div>

//                         <div
//                             className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-xl"
//                             onClick={closeAllModals}
//                         >
//                             <X className="text-white w-5 h-5" />
//                         </div>

//                         <div className="flex items-center gap-4 mt-4 justify-between">
//                             <div className="flex items-center gap-4">
//                                 <img
//                                     src={driver.avatar}
//                                     alt="driver"
//                                     className="w-12 h-12 rounded-full object-cover"
//                                 />
//                                 <div>
//                                     <div className="font-medium">{driver.name}</div>
//                                     <div className="text-sm text-[#0A72B9] flex items-center gap-1">
//                                         <Star className="inline w-4 h-4" />
//                                         {driver.rating}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="text-2xl font-medium text-[#1E1E1C]">
//                                 {driver.price}
//                             </div>
//                         </div>

//                         <div className="mt-4 text-sm text-slate-600">
//                             <div className="flex items-center gap-2 text-lg font-medium text-[#4B5563] capitalize">
//                                 <CarLite />
//                                 <span>
//                                     {driver.vehicleType} - {driver.brand} {driver.model} •{" "}
//                                     {driver.registration}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="mt-4 text-lg font-medium text-[#4B5563]">
//                             <div className="flex items-center gap-2">
//                                 <span>Delivery Verification PIN:</span>
//                                 <strong className="tracking-widest">
//                                     {driver.pin.join(" ")}
//                                 </strong>
//                                 <button onClick={copyPin} className="ml-2 text-sky-600">
//                                     {pinCopied ? <CopyCheck /> : <Copy />}
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="mt-4 w-full flex flex-col gap-3 lg:flex-row lg:items-center">
//                             <button
//                                 onClick={() => openModal("confirm")}
//                                 className="w-full lg:flex-1 bg-[#E5E5E5] text-[#1E1E1C] px-4 py-3 rounded-md flex items-center justify-center gap-2"
//                             >
//                                 <X className="w-5 h-5" />
//                                 Cancel Delivery
//                             </button>
//                             <button
//                                 onClick={() => openModal("message")}
//                                 className="w-full lg:flex-1 bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white px-4 py-3 rounded-md flex items-center justify-center gap-2"
//                             >
//                                 <MessageCircle className="w-5 h-5" />
//                                 Message Driver
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── Message / Tracking Panel (picked_up / in_transit / arrived_at_dropoff) ── */}
//             {showMessagePanel && (
//                 <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <div className="absolute top-8 right-0 lg:right-8 z-70 w-full lg:w-[542px] bg-white rounded-lg shadow-lg pointer-events-auto">

//                         {/* Status badge */}
//                         <div className="flex justify-center pt-3">
//                             <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
//                                 {STATUS_LABELS[status]}
//                             </span>
//                         </div>

//                         {/* ETA — "Dropoff at X" for in-transit statuses */}
//                         <p className="p-4 text-2xl font-medium text-center text-[#1E1E1C]">
//                             {etaLabel}
//                         </p>

//                         <div className="flex items-center justify-between p-4">
//                             <div className="flex items-center gap-4">
//                                 <img
//                                     src={driver.avatar}
//                                     alt="driver"
//                                     className="w-12 h-12 rounded-full object-cover"
//                                 />
//                                 <div>
//                                     <div className="font-medium">{driver.name}</div>
//                                     <div className="text-sm text-[#0A72B9] flex items-center gap-1">
//                                         <Star className="inline w-4 h-4" />
//                                         {driver.rating}
//                                     </div>
//                                 </div>
//                             </div>
//                             <p>{driver.price}</p>
//                         </div>

//                         <div className="p-4 text-sm text-slate-700">
//                             <div className="flex items-center gap-2 text-lg text-[#4B5563] capitalize">
//                                 <CarLite />
//                                 <span>
//                                     {driver.vehicleType} - {driver.brand} • {driver.model} •{" "}
//                                     {driver.registration}
//                                 </span>
//                             </div>
//                             <div
//                                 onClick={() =>
//                                     window.open(`tel:${driver.phone}`, "_blank")
//                                 }
//                                 className="flex cursor-pointer items-center gap-2 mt-2 text-lg text-[#4B5563]"
//                             >
//                                 <Phone />
//                                 <span>{driver.phone}</span>
//                             </div>
//                             <div className="mt-4 text-lg font-medium text-[#4B5563]">
//                                 <div className="flex items-center gap-2">
//                                     <span>Delivery Verification PIN:</span>
//                                     <strong className="tracking-widest">
//                                         {driver.pin.join(" ")}
//                                     </strong>
//                                     <button onClick={copyPin} className="ml-2 text-sky-600">
//                                         {pinCopied ? <CopyCheck /> : <Copy />}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="p-4">
//                             <div className="flex gap-2">
//                                 <input
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     placeholder="Message driver"
//                                     className="flex-1 rounded-md border px-3 py-2 text-sm"
//                                 />
//                                 <button
//                                     onClick={() => handleSendMessage(message)}
//                                     className="w-10 h-10 rounded-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center"
//                                 >
//                                     <Send />
//                                 </button>
//                             </div>

//                             <div className="mt-3 flex items-center justify-between text-sm bg-[#E5E5E5] p-4 rounded-lg">
//                                 <button
//                                     onClick={() => openModal("confirm")}
//                                     className="text-slate-500"
//                                 >
//                                     Cancel this Delivery?
//                                 </button>
//                                 <button
//                                     onClick={() => openModal("rating")}
//                                     className="text-red-500"
//                                 >
//                                     Finish & Rate
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── Cancel Confirmation Modal ─────────────────────────────────── */}
//             {showConfirm && (
//                 <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <div className="bg-white rounded-lg p-6 max-w-xl w-[90%] text-center">
//                         <h4 className="text-lg lg:text-4xl font-medium text-[#1E1E1C]">
//                             Are you sure you want to cancel this delivery?
//                         </h4>
//                         <div className="mt-6 flex gap-4 justify-center">
//                             {/* No → go back to appropriate panel */}
//                             <button
//                                 onClick={() =>
//                                     MESSAGE_PANEL_STATUSES.includes(status)
//                                         ? openModal("message")
//                                         : openModal("match")
//                                 }
//                                 className="px-6 py-2 rounded bg-[#E5E5E5] w-full"
//                             >
//                                 No
//                             </button>
//                             <button
//                                 onClick={confirmCancel}
//                                 className="px-6 py-2 rounded bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white w-full"
//                             >
//                                 Yes, Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── Rating Modal (delivered) ──────────────────────────────────── */}
//             {showRating && (
//                 <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <div className="bg-white rounded-lg p-6 max-w-lg w-[92%] text-center relative">
//                         <div
//                             className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-lg"
//                             onClick={closeAllModals}
//                         >
//                             <X className="text-white w-5 h-5" />
//                         </div>

//                         <h4 className="text-2xl font-medium text-[#1E1E1C]">
//                             Rate your delivery
//                         </h4>
//                         <div className="mt-4 flex items-center gap-4 justify-center">
//                             <img
//                                 src={driver.avatar}
//                                 alt="driver"
//                                 className="w-12 h-12 rounded-full object-cover"
//                             />
//                             <h4 className="text-2xl font-medium text-[#1E1E1C]">
//                                 {driver.name}
//                             </h4>
//                         </div>

//                         <div className="mt-6 flex items-center justify-center">
//                             <Rating
//                                 onClick={(rate) => setRating(rate)}
//                                 onPointerEnter={() => {}}
//                                 onPointerLeave={() => {}}
//                                 onPointerMove={() => {}}
//                                 initialValue={rating}
//                                 size={40}
//                                 allowFraction={false}
//                                 transition
//                                 fillColor="#F59E0B"
//                                 emptyColor="#D1D5DB"
//                                 style={{ display: "flex", gap: "8px" }}
//                                 SVGstyle={{ display: "inline-block" }}
//                             />
//                         </div>

//                         <button
//                             onClick={handleSubmitRating}
//                             disabled={rating === 0}
//                             className={`mt-6 w-full py-2 rounded transition-all ${
//                                 rating === 0
//                                     ? "bg-slate-200 text-slate-400 cursor-not-allowed"
//                                     : "bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white"
//                             }`}
//                         >
//                             {ratingLoading ? (
//                                 <span className="flex items-center justify-center">
//                                     <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
//                                     Submitting...
//                                 </span>
//                             ) : (
//                                 "Submit"
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default function FindRiderPage() {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <FindingRider />
//         </Suspense>
//     );
// }

/* eslint-disable @next/next/no-img-element */
"use client";

import CarLite from "@/components/icon/carLite";
import {
    useCancelDeliveryMutation,
    useGetDeliveryQuery,
    useRateDeliveryMutation,
} from "@/redux/feature/deliverySlice";
import {
    Copy,
    CopyCheck,
    MessageCircle,
    Phone,
    Send,
    Star,
    X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import { toast } from "sonner";
import { Rating } from "react-simple-star-rating";
import { FaSpinner } from "react-icons/fa";
import { useCreateConversationMutation } from "@/redux/feature/chatSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

type LatLng = { lat: number; lng: number };

type DeliveryStatus =
    | "pending"
    | "searching"
    | "driver_assigned"
    | "arrived_at_pickup"
    | "picked_up"
    | "in_transit"
    | "arrived_at_dropoff"
    | "delivered"
    | "cancelled";

type WsStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

declare global {
    interface Window { google: any }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DRIVER_MODAL_STATUSES: DeliveryStatus[] = ["driver_assigned", "arrived_at_pickup"];
const MESSAGE_PANEL_STATUSES: DeliveryStatus[] = ["picked_up", "in_transit", "arrived_at_dropoff"];

const STATUS_LABELS: Record<DeliveryStatus, string> = {
    pending:              "Pending",
    searching:            "Searching for a driver…",
    driver_assigned:      "Driver Assigned",
    arrived_at_pickup:    "Driver Arrived at Pickup",
    picked_up:            "Package Picked Up",
    in_transit:           "In Transit",
    arrived_at_dropoff:   "Arrived at Drop-off",
    delivered:            "Delivered",
    cancelled:            "Cancelled",
};

const WS_BASE        = "wss://api.tradlogistics.com/ws/ongoing-deliveries";
const RECONNECT_MS   = 3000;

// ─── Google Maps loader ───────────────────────────────────────────────────────

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.google?.maps) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector("script[data-google-maps='true']");
        if (existing) {
            existing.addEventListener("load",  () => resolve());
            existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
            return;
        }
        const s = document.createElement("script");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        s.async = true;
        s.defer = true;
        s.dataset.googleMaps = "true";
        s.onload  = () => resolve();
        s.onerror = () => reject(new Error("Google Maps failed to load"));
        document.head.appendChild(s);
    });
};

// ─── useDeliveryWebSocket ─────────────────────────────────────────────────────
// Isolated hook with stable callbacks (no stale-closure reconnect loops).
// All mutable state accessed inside callbacks lives in refs.

function useDeliveryWebSocket(deliveryId: string | null) {
    const [wsDelivery, setWsDelivery] = useState<Record<string, unknown> | null>(null);
    const [wsStatus,   setWsStatus]   = useState<WsStatus>("disconnected");

    const wsRef              = useRef<WebSocket | null>(null);
    const reconnectTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReconnectRef = useRef(true);
    const deliveryIdRef      = useRef(deliveryId);
    deliveryIdRef.current = deliveryId; // keep ref in sync every render

    const clearTimer = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    };

    // connect is stable — uses only refs inside, no captured state
    const connect = useCallback(() => {
        const id    = deliveryIdRef.current;
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        if (!id) {
            console.warn("[WS] deliveryId missing — aborting connect");
            return;
        }
        if (!token) {
            console.warn("[WS] accessToken not found in localStorage — aborting connect");
            return;
        }

        // Guard: don't open a duplicate socket
        const existingState = wsRef.current?.readyState;
        if (existingState === WebSocket.OPEN || existingState === WebSocket.CONNECTING) {
            console.log("[WS] Already open/connecting (readyState=%d) — skipping", existingState);
            return;
        }

        const url = `${WS_BASE}/${id}/?token=${token}`;
        console.log(`[WS] ► Connecting to ${url}`);
        setWsStatus("connecting");

        const ws = new WebSocket(url);
        wsRef.current = ws;

        // ── onopen ─────────────────────────────────────────────────────────
        ws.onopen = () => {
            console.log(`[WS] ✅ Connected  url=${url}`);
            clearTimer();
            setWsStatus("connected");
        };

        // ── onmessage ──────────────────────────────────────────────────────
        ws.onmessage = (event: MessageEvent) => {
            let payload: any;
            try {
                payload = JSON.parse(event.data as string);
            } catch (err) {
                console.error("[WS] ❌ JSON parse error:", err, "\nRaw:", event.data);
                return;
            }


            // ── Structured console output ───────────────────────────────────
            console.group(`[WS] 📨 Message  type="${payload?.type}"  status="${payload?.status}"`);
            console.log("Full payload:", payload);

            if (Array.isArray(payload?.data) && payload.data.length > 0) {
                const d = payload.data[0];
                console.log("──────────────── Delivery ────────────────");
                console.log("  id           :", d?.id);
                console.log("  public_id    :", d?.public_id);
                console.log("  status       :", d?.status);
                console.log("  vehicle_type :", d?.vehicle_type);
                console.log("  price        :", d?.price);
                console.log("  payment      :", d?.payment_method);
                console.log("  PIN          :", d?.verification_pin);
                console.log("  pickup_addr  :", d?.pickup_address);
                console.log("  pickup_lat   :", d?.pickup_lat, "  lng:", d?.pickup_lng);
                console.log("  dropoff_addr :", d?.dropoff_address);
                console.log("  dropoff_lat  :", d?.dropoff_lat, "  lng:", d?.dropoff_lng);
                console.log("  driver_lat   :", d?.driver_last_lat, "  lng:", d?.driver_last_lng);
                console.log("  est_pickup   :", d?.estimated_pickup_time, "min");
                console.log("  est_arrival  :", d?.estimate_arrival_time);
                console.log("  est_km       :", d?.estimate_km);
                console.log("  driver       :", d?.driver ?? "(null — backend may populate later)");
                console.log("  customer     :", d?.customer);
                console.log("  scheduled_at :", d?.scheduled_at);
                console.log("  created_at   :", d?.created_at);
                console.log("  updated_at   :", d?.updated_at);
            } else {
                console.warn("  data array empty or missing");
            }
            console.groupEnd();
            // ── End structured log ──────────────────────────────────────────

            if (
                payload?.type === "ongoing_deliveries" &&
                Array.isArray(payload?.data) &&
                payload.data.length > 0
            ) {
                setWsDelivery(payload.data[0] as Record<string, unknown>);
            } else {
                console.warn("[WS] Payload shape unexpected — state not updated");
            }
        };

        // ── onerror ────────────────────────────────────────────────────────
        ws.onerror = (err) => {
            // onclose fires right after; reconnect logic lives there
            console.error("[WS] ⚡ Error event:", err);
        };

        // ── onclose ────────────────────────────────────────────────────────
        ws.onclose = (ev: CloseEvent) => {
            console.warn(
                `[WS] 🔌 Closed  code=${ev.code}  reason="${ev.reason}"  wasClean=${ev.wasClean}`
            );
            setWsStatus("disconnected");

            if (shouldReconnectRef.current && ev.code !== 1000) {
                console.log(`[WS] Scheduling reconnect in ${RECONNECT_MS}ms…`);
                setWsStatus("reconnecting");
                clearTimer();
                reconnectTimerRef.current = setTimeout(connect, RECONNECT_MS);
            }
        };
    }, []); // stable — uses only refs

    // Mount / deliveryId-change: connect. Unmount: clean up permanently.
    useEffect(() => {
        if (!deliveryId) return;

        shouldReconnectRef.current = true;
        connect();

        return () => {
            console.log("[WS] 🧹 Unmounting — closing socket, cancelling reconnect");
            shouldReconnectRef.current = false;
            clearTimer();
            if (wsRef.current) {
                wsRef.current.onclose = null; // prevent reconnect callback
                wsRef.current.close(1000, "component unmount");
                wsRef.current = null;
            }
            setWsStatus("disconnected");
        };
    }, [deliveryId, connect]);

    return { wsDelivery, wsStatus };
}

// ─── FindingRider ─────────────────────────────────────────────────────────────

function FindingRider() {
    const params     = useSearchParams();
    const deliveryId = params.get("deliveryId");
    const router     = useRouter();

    // Map
    const mapRef     = useRef<HTMLDivElement | null>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mapError,   setMapError]   = useState<string | null>(null);

    // Modals
    const [showModal,        setShowModal]        = useState(false);
    const [showConfirm,      setShowConfirm]      = useState(false);
    const [showMessagePanel, setShowMessagePanel] = useState(false);
    const [showRating,       setShowRating]       = useState(false);

    // Misc
    const [message,              setMessage]              = useState("");
    const [pinCopied,            setPinCopied]            = useState(false);
    const [rating,               setRating]               = useState(0);
    const [conversationPublicId, setConversationPublicId] = useState<string | null>(null);

    // ── WS ───────────────────────────────────────────────────────────────────
    const { wsDelivery, wsStatus } = useDeliveryWebSocket(deliveryId);

    // ── REST (initial / fallback) ─────────────────────────────────────────────
    const { data: restData, isLoading } = useGetDeliveryQuery(deliveryId, {
        skip: !deliveryId,
        refetchOnMountOrArgChange: true,
    });

    // ── Merge: WS wins, REST is fallback ─────────────────────────────────────
    const delivery = useMemo<Record<string, unknown> | undefined>(() => {
        if (wsDelivery) {
            console.log("[DATA] ✅ Source = WebSocket:", wsDelivery);
            return wsDelivery;
        }
        const rest = (
            (restData as { data?: Record<string, unknown> } | undefined)?.data ?? restData
        ) as Record<string, unknown> | undefined;
        if (rest) console.log("[DATA] ℹ️  Source = REST (no WS data yet):", rest);
        return rest;
    }, [wsDelivery, restData]);

    // ── Derived values ────────────────────────────────────────────────────────
    const status    = (delivery?.status ?? "searching") as DeliveryStatus;
    const apiDriver = (delivery?.driver as Record<string, unknown> | null | undefined) ?? null;

    const IMAGE     = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const GOOGLEAPI = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const pinDigits = String(delivery?.verification_pin ?? "")
        .split("").filter(c => /\d/.test(c)).map(Number);

    const driver = {
        name:         String(apiDriver?.name         ?? "Assigned Driver"),
        rating:       Number(apiDriver?.average_rating ?? 0),
        price:        delivery?.price ? `$${String(delivery.price)}` : "$0",
        vehicleType:  String(apiDriver?.vehicle_type  ?? delivery?.vehicle_type ?? "Vehicle"),
        brand:        String(apiDriver?.brand         ?? "N/A"),
        model:        String(apiDriver?.model         ?? "N/A"),
        registration: String(apiDriver?.registration_number ?? "N/A"),
        phone:        String(apiDriver?.phone         ?? "N/A"),
        pin:          pinDigits.length > 0 ? pinDigits : [0, 0, 0, 0],
        avatar:       IMAGE
            ? `${IMAGE}${String(apiDriver?.profile_image ?? "/image/user.png")}`
            : "/image/user.png",
    };

    const pickup = useMemo<LatLng | null>(() => {
        const lat = Number(delivery?.pickup_lat);
        const lng = Number(delivery?.pickup_lng);
        if (!delivery || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;
        return { lat, lng };
    }, [delivery]);

    const dropoff = useMemo<LatLng | null>(() => {
        const lat = Number(delivery?.dropoff_lat);
        const lng = Number(delivery?.dropoff_lng);
        if (!delivery || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;
        return { lat, lng };
    }, [delivery]);

    // State change log
    useEffect(() => {
        console.log(
            `[STATE] status="${status}" | wsStatus="${wsStatus}" | pickup=${JSON.stringify(pickup)} | dropoff=${JSON.stringify(dropoff)}`
        );
    }, [status, wsStatus, pickup, dropoff]);

    // ── Mutations ─────────────────────────────────────────────────────────────
    const [createConversation]                      = useCreateConversationMutation();
    const [cancelDelivery]                          = useCancelDeliveryMutation();
    const [rateDelivery, { isLoading: ratingLoading }] = useRateDeliveryMutation();

    // ── Conversation ──────────────────────────────────────────────────────────
    const updateConversationQuery = (publicId: string) => {
        const next = new URLSearchParams(params.toString());
        next.set("conversationId", publicId);
        router.replace(`/create-new-delivery/find-rider?${next.toString()}`);
    };

    const ensureConversation = async () => {
        if (conversationPublicId) {
            updateConversationQuery(conversationPublicId);
            return conversationPublicId;
        }
        const res = await createConversation({
            user_id:     apiDriver ? (apiDriver as Record<string, unknown>).user_id : undefined,
            delivery_id: delivery?.id,
        }).unwrap();
        const publicId = String(res.data?.public_id || "");
        if (publicId) {
            setConversationPublicId(publicId);
            updateConversationQuery(publicId);
        }
        return publicId;
    };

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const closeAllModals = useCallback(() => {
        setShowModal(false);
        setShowMessagePanel(false);
        setShowConfirm(false);
        setShowRating(false);
    }, []);

    const openModal = useCallback((modal: "match" | "message" | "confirm" | "rating") => {
        setShowModal       (modal === "match");
        setShowMessagePanel(modal === "message");
        setShowConfirm     (modal === "confirm");
        setShowRating      (modal === "rating");

        if (modal === "message" && delivery?.id) {
            ensureConversation().catch(() =>
                toast.error("Unable to start chat. Please try again.")
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delivery?.id]);

    // ── Status → modal ────────────────────────────────────────────────────────
    useEffect(() => {
        console.log(`[MODAL] status="${status}" → evaluating…`);

        if (status === "searching" || status === "pending") {
            closeAllModals();
            return;
        }
        if (DRIVER_MODAL_STATUSES.includes(status)) {
            console.log("[MODAL] Opening match modal");
            setShowModal(true); setShowMessagePanel(false); setShowConfirm(false); setShowRating(false);
            return;
        }
        if (MESSAGE_PANEL_STATUSES.includes(status)) {
            console.log("[MODAL] Opening message panel");
            setShowModal(false); setShowMessagePanel(true); setShowConfirm(false); setShowRating(false);
            return;
        }
        if (status === "delivered") {
            console.log("[MODAL] Opening rating modal");
            setShowModal(false); setShowMessagePanel(false); setShowConfirm(false); setShowRating(true);
            return;
        }
        if (status === "cancelled") {
            console.log("[MODAL] Cancelled — closing all");
            closeAllModals();
        }
    }, [status, closeAllModals]);

    // ── Google Maps load ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!GOOGLEAPI) { setMapError("NEXT_PUBLIC_GOOGLE_API_KEY not set"); return; }
        loadGoogleMapsScript(GOOGLEAPI)
            .then(() => { console.log("[MAPS] Loaded ✅"); setMapsLoaded(true); })
            .catch((e: Error) => { console.error("[MAPS] Error:", e.message); setMapError(e.message); });
    }, [GOOGLEAPI]);

    // ── Map render ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!mapsLoaded || !pickup || !dropoff || !mapRef.current || !window.google?.maps) return;
        console.log("[MAPS] Rendering route", pickup, "→", dropoff);

        const map = new window.google.maps.Map(mapRef.current, {
            center: pickup, zoom: 12,
            mapTypeControl: false, streetViewControl: false, fullscreenControl: true,
        });
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(pickup); bounds.extend(dropoff);
        map.fitBounds(bounds, 120);

        const pM = new window.google.maps.Marker({ position: pickup,  map, title: "Pickup",  label: "P" });
        const dM = new window.google.maps.Marker({ position: dropoff, map, title: "Dropoff", label: "D" });

        const dr = new window.google.maps.DirectionsRenderer({
            map, suppressMarkers: true, preserveViewport: true,
            polylineOptions: { strokeColor: "#0A72B9", strokeOpacity: 1, strokeWeight: 5 },
        });

        new window.google.maps.DirectionsService().route(
            { origin: pickup, destination: dropoff, travelMode: window.google.maps.TravelMode.DRIVING },
            (result: any, s: string) => {
                if (s === "OK" && result) {
                    dr.setDirections(result);
                    console.log("[MAPS] Route drawn ✅");
                } else {
                    console.warn("[MAPS] Directions failed:", s, "— drawing straight line");
                    new window.google.maps.Polyline({
                        path: [pickup, dropoff], geodesic: true,
                        strokeColor: "#0A72B9", strokeOpacity: 1, strokeWeight: 4, map,
                    });
                }
            }
        );
        return () => { pM.setMap(null); dM.setMap(null); dr.setMap(null); };
    }, [mapsLoaded, pickup, dropoff]);

    // ── Action handlers ───────────────────────────────────────────────────────
    const copyPin = async () => {
        const pinStr = driver.pin.join(" ");
        try {
            if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(pinStr);
            else {
                const el = Object.assign(document.createElement("textarea"), { value: pinStr });
                document.body.appendChild(el); el.select();
                document.execCommand("copy"); document.body.removeChild(el);
            }
            setPinCopied(true);
            setTimeout(() => setPinCopied(false), 1500);
        } catch (e) { console.error("[PIN] Copy failed:", e); }
    };

    const handleSendMessage = async (msg: string) => {
        if (!msg.trim()) return;
        try {
            const publicId = await ensureConversation();
            if (!publicId) { toast.error("Chat not available for this delivery yet."); return; }
            router.push(`/inbox?conversationId=${publicId}&text=${encodeURIComponent(msg)}`);
        } catch (e) { console.error("[CHAT] Error:", e); }
    };

    const confirmCancel = async () => {
        if (!deliveryId) return;
        try {
            const res = await cancelDelivery(deliveryId).unwrap();
            toast.success(res.message || "Delivery canceled successfully!");
            closeAllModals();
        } catch (e: any) {
            toast.error(e.data?.detail || "Failed to cancel delivery.");
        }
    };

    const handleSubmitRating = async () => {
        if (rating === 0) return;
        try {
            const res = await rateDelivery({ deliveryId, data: { rating } }).unwrap();
            toast.success(res.message || "Rating submitted!");
            closeAllModals();
        } catch (e: any) {
            toast.error(e.data?.detail || "Failed to submit rating.");
        }
    };

    // ── Derived UI ────────────────────────────────────────────────────────────
    const isTechLoading = !mapsLoaded || (isLoading && !wsDelivery);

    const etaLabel = MESSAGE_PANEL_STATUSES.includes(status)
        ? `Dropoff at ${String(delivery?.estimate_arrival_time ?? "—")}`
        : `Pickup in ${String(delivery?.estimated_pickup_time ?? delivery?.estimate_arrival_time ?? "—")} min`;

    const wsColors: Record<WsStatus, string> = {
        connected:    "bg-green-500",
        connecting:   "bg-yellow-400 animate-pulse",
        reconnecting: "bg-orange-400 animate-pulse",
        disconnected: "bg-red-500",
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="relative w-full h-full overflow-hidden">

            {/* Map canvas */}
            <div
                ref={mapRef}
                className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                    isTechLoading ? "blur-md scale-105" : "blur-0 scale-100"
                }`}
            />

            {/* WS status pill — top-left */}
            <div className="absolute top-3 left-3 z-50 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium shadow-sm pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${wsColors[wsStatus]}`} />
                <span className="text-slate-600 capitalize">{wsStatus}</span>
            </div>

            {mapError && (
                <div className="absolute top-4 left-1/2 z-60 -translate-x-1/2 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 shadow">
                    {mapError}
                </div>
            )}

            {/* ── Loading / Searching ──────────────────────────────────────── */}
            {(isTechLoading || status === "searching" || status === "pending") &&
                !showModal && !showMessagePanel && !showRating && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse px-6">
                        Finding the best ride for your pickup time....
                    </p>
                    <iframe
                        src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
                        className="w-48 h-48 md:w-80 md:h-80"
                    />
                </div>
            )}

            {/* ── Match Modal (driver_assigned / arrived_at_pickup) ─────────── */}
            {showModal && (
                <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <h1 className="text-xl text-center lg:text-4xl font-medium text-white mb-6 px-4">
                        We've matched you with a trusted driver for your scheduled delivery
                    </h1>
                    <div className="pointer-events-auto w-[92%] max-w-xl bg-white rounded-xl shadow-lg p-6 mx-4 relative">

                        <div className="mb-3 flex justify-center">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                                {STATUS_LABELS[status]}
                            </span>
                        </div>

                        <div
                            className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-xl"
                            onClick={closeAllModals}
                        >
                            <X className="text-white w-5 h-5" />
                        </div>

                        <div className="flex items-center gap-4 mt-4 justify-between">
                            <div className="flex items-center gap-4">
                                <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <div className="font-medium">{driver.name}</div>
                                    <div className="text-sm text-[#0A72B9] flex items-center gap-1">
                                        <Star className="inline w-4 h-4" />{driver.rating}
                                    </div>
                                </div>
                            </div>
                            <div className="text-2xl font-medium text-[#1E1E1C]">{driver.price}</div>
                        </div>

                        <div className="mt-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2 text-lg font-medium text-[#4B5563] capitalize">
                                <CarLite />
                                <span>{driver.vehicleType} - {driver.brand} {driver.model} • {driver.registration}</span>
                            </div>
                        </div>

                        <div className="mt-4 text-lg font-medium text-[#4B5563]">
                            <div className="flex items-center gap-2">
                                <span>Delivery Verification PIN:</span>
                                <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
                                <button onClick={copyPin} className="ml-2 text-sky-600">
                                    {pinCopied ? <CopyCheck /> : <Copy />}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 w-full flex flex-col gap-3 lg:flex-row lg:items-center">
                            <button
                                onClick={() => openModal("confirm")}
                                className="w-full lg:flex-1 bg-[#E5E5E5] text-[#1E1E1C] px-4 py-3 rounded-md flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" /> Cancel Delivery
                            </button>
                            <button
                                onClick={() => openModal("message")}
                                className="w-full lg:flex-1 bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white px-4 py-3 rounded-md flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" /> Message Driver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Message / Tracking Panel (picked_up / in_transit / arrived_at_dropoff) ── */}
            {showMessagePanel && (
                <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="absolute top-8 right-0 lg:right-8 z-70 w-full lg:w-[542px] bg-white rounded-lg shadow-lg pointer-events-auto">

                        <div className="flex justify-center pt-3">
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                                {STATUS_LABELS[status]}
                            </span>
                        </div>

                        <p className="p-4 text-2xl font-medium text-center text-[#1E1E1C]">{etaLabel}</p>

                        <div className="flex items-center justify-between px-4 pb-2">
                            <div className="flex items-center gap-4">
                                <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <div className="font-medium">{driver.name}</div>
                                    <div className="text-sm text-[#0A72B9] flex items-center gap-1">
                                        <Star className="inline w-4 h-4" />{driver.rating}
                                    </div>
                                </div>
                            </div>
                            <p className="font-medium">{driver.price}</p>
                        </div>

                        <div className="px-4 pb-2 text-sm text-slate-700">
                            <div className="flex items-center gap-2 text-lg text-[#4B5563] capitalize">
                                <CarLite />
                                <span>{driver.vehicleType} - {driver.brand} • {driver.model} • {driver.registration}</span>
                            </div>
                            <div
                                onClick={() => window.open(`tel:${driver.phone}`, "_blank")}
                                className="flex cursor-pointer items-center gap-2 mt-2 text-lg text-[#4B5563]"
                            >
                                <Phone /><span>{driver.phone}</span>
                            </div>
                            <div className="mt-4 text-lg font-medium text-[#4B5563]">
                                <div className="flex items-center gap-2">
                                    <span>Delivery Verification PIN:</span>
                                    <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
                                    <button onClick={copyPin} className="ml-2 text-sky-600">
                                        {pinCopied ? <CopyCheck /> : <Copy />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex gap-2">
                                <input
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSendMessage(message)}
                                    placeholder="Message driver"
                                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={() => handleSendMessage(message)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center"
                                >
                                    <Send />
                                </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm bg-[#E5E5E5] p-4 rounded-lg">
                                <button onClick={() => openModal("confirm")} className="text-slate-500">
                                    Cancel this Delivery?
                                </button>
                                <button onClick={() => openModal("rating")} className="text-red-500">
                                    Finish & Rate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Cancel Confirm ────────────────────────────────────────────── */}
            {showConfirm && (
                <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-xl w-[90%] text-center">
                        <h4 className="text-lg lg:text-4xl font-medium text-[#1E1E1C]">
                            Are you sure you want to cancel this delivery?
                        </h4>
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => MESSAGE_PANEL_STATUSES.includes(status) ? openModal("message") : openModal("match")}
                                className="px-6 py-2 rounded bg-[#E5E5E5] w-full"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-6 py-2 rounded bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white w-full"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Rating Modal (delivered) ──────────────────────────────────── */}
            {showRating && (
                <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-[92%] text-center relative">
                        <div
                            className="absolute top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl rounded-tr-lg"
                            onClick={closeAllModals}
                        >
                            <X className="text-white w-5 h-5" />
                        </div>
                        <h4 className="text-2xl font-medium text-[#1E1E1C]">Rate your delivery</h4>
                        <div className="mt-4 flex items-center gap-4 justify-center">
                            <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
                            <h4 className="text-2xl font-medium text-[#1E1E1C]">{driver.name}</h4>
                        </div>
                        <div className="mt-6 flex items-center justify-center">
                            <Rating
                                onClick={r => setRating(r)}
                                onPointerEnter={() => {}} onPointerLeave={() => {}} onPointerMove={() => {}}
                                initialValue={rating} size={40} allowFraction={false} transition
                                fillColor="#F59E0B" emptyColor="#D1D5DB"
                                style={{ display: "flex", gap: "8px" }}
                                SVGstyle={{ display: "inline-block" }}
                            />
                        </div>
                        <button
                            onClick={handleSubmitRating}
                            disabled={rating === 0}
                            className={`mt-6 w-full py-2 rounded transition-all ${
                                rating === 0
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white"
                            }`}
                        >
                            {ratingLoading ? (
                                <span className="flex items-center justify-center">
                                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                                </span>
                            ) : "Submit"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FindRiderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FindingRider />
        </Suspense>
    );
}