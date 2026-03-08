
/* eslint-disable @next/next/no-img-element */

"use client";

import CarLite from "@/components/icon/carLite";
import { useCancelDeliveryMutation, useGetDeliveryQuery, useRateDeliveryMutation } from "@/redux/feature/deliverySlice";
import { Copy, CopyCheck, MessageCircle, Phone, Send, Star, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Rating } from 'react-simple-star-rating'
import { FaSpinner } from "react-icons/fa";
import { useCreateConversationMutation } from "@/redux/feature/chatSlice";

type LatLng = {
    lat: number;
    lng: number;
};

declare global {
    interface Window {
        google: any;
    }
}

const loadGoogleMapsScript = (apiKey: string) => {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.google?.maps) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector("script[data-google-maps='true']");
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMaps = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Maps failed to load"));
        document.head.appendChild(script);
    });
};

const getHeading = (from: LatLng, to: LatLng) => {
    const rad = Math.atan2(to.lng - from.lng, to.lat - from.lat);
    return (rad * 180) / Math.PI;
};

 function FindingRider() {
    const params = useSearchParams();
    const deliveryId = params.get("deliveryId");
    const router = useRouter();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState("");
    const [pinCopied, setPinCopied] = useState(false);
    const [showMessagePanel, setShowMessagePanel] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const [conversationPublicId, setConversationPublicId] = useState<string | null>(null);

    const { data, isLoading } = useGetDeliveryQuery(deliveryId, {
        skip: !deliveryId,
        refetchOnMountOrArgChange: true,
    });
    console.log(data?.customer?.user_id, '============>')

    const [createConversation] = useCreateConversationMutation();

    const [cancelDelivery] = useCancelDeliveryMutation();
    const [rateDelivery, { isLoading: ratingLoading }] = useRateDeliveryMutation();

    const delivery = ((data as { data?: Record<string, unknown> } | undefined)?.data ?? data) as Record<string, unknown> | undefined;
    const apiDriver = (delivery?.driver as Record<string, unknown> | null | undefined) ?? null;
    const hasDriver = Boolean(apiDriver);

    const pinFromApi = String(delivery?.verification_pin ?? "")
        .split("")
        .filter((char) => /\d/.test(char))
        .map((digit) => Number(digit));

    const IMAGE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

    const GOOGLEAPI = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const driver = {
        name: String(apiDriver?.name ?? "Assigned Driver"),
        rating: Number(apiDriver?.average_rating ?? 0),
        price: delivery?.price ? `$${String(delivery.price)}` : "$0",
        vehicleType: String(apiDriver?.vehicle_type ?? delivery?.vehicle_type ?? "Vehicle"),
        brand: String(apiDriver?.brand ?? "N/A"),
        model: String(apiDriver?.model ?? "N/A"),
        registration: String(apiDriver?.registration_number ?? "N/A"),
        plate: String(apiDriver?.vehicle_number ?? apiDriver?.plate_number ?? "N/A"),
        phone: String(apiDriver?.phone ?? "N/A"),
        pin: pinFromApi.length > 0 ? pinFromApi : [0, 0, 0, 0],
        avatar: IMAGE ? `${IMAGE}${apiDriver?.profile_image ?? "/image/user.png"}` : "/image/user.png",
    };

    const pickup = useMemo<LatLng | null>(() => {
        const lat = Number(delivery?.pickup_lat);
        const lng = Number(delivery?.pickup_lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { lat, lng };
    }, [delivery]);

    const dropoff = useMemo<LatLng | null>(() => {
        const lat = Number(delivery?.dropoff_lat);
        const lng = Number(delivery?.dropoff_lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { lat, lng };
    }, [delivery]);

    const loading = !deliveryId || isLoading || !mapsLoaded;

    const updateConversationQuery = (publicId: string) => {
        const nextParams = new URLSearchParams(params.toString());
        nextParams.set("conversationId", publicId);
        const nextQuery = nextParams.toString();
        router.replace(nextQuery ? `/create-new-delivery/find-rider?${nextQuery}` : "/create-new-delivery/find-rider");
    };

    const ensureConversation = async () => {
        if (conversationPublicId) {
            updateConversationQuery(conversationPublicId);
            return conversationPublicId;
        }

        const res = await createConversation({ user_id: data?.driver?.user_id, delivery_id: data?.id }).unwrap();
        const publicId = String(res.data?.public_id || "");
        if (publicId) {
            setConversationPublicId(publicId);
            updateConversationQuery(publicId);
        }
        return publicId;
    };

    // ✅ Helper: close all modals at once
    const closeAllModals = () => {
        setShowModal(false);
        setShowMessagePanel(false);
        setShowConfirm(false);
        setShowRating(false);
    };

    // ✅ Helper: open only one modal, close rest
    const openModal = (modal: "match" | "message" | "confirm" | "rating") => {
        setShowModal(modal === "match");
        setShowMessagePanel(modal === "message");
        setShowConfirm(modal === "confirm");
        setShowRating(modal === "rating");

        if (modal === "message" && data?.driver?.user_id && data?.id) {
            ensureConversation().catch(() => {
                toast.error("Unable to start chat. Please try again.");
            });
        }
    };

    useEffect(() => {
        if (hasDriver) {
            openModal("match");
            return;
        }
        closeAllModals();
    }, [hasDriver]);

    useEffect(() => {
        if (!GOOGLEAPI) {
            setMapError("Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_API_KEY.");
            return;
        }

        loadGoogleMapsScript(GOOGLEAPI)
            .then(() => setMapsLoaded(true))
            .catch((error: Error) => setMapError(error.message));
    }, [GOOGLEAPI]);

    useEffect(() => {
        if (!mapsLoaded || !pickup || !dropoff || !mapRef.current || !window.google?.maps) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: pickup,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
        });

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(pickup);
        bounds.extend(dropoff);
        map.fitBounds(bounds, 120);

        const pickupMarker = new window.google.maps.Marker({
            position: pickup,
            map,
            title: "Pickup",
            label: "P",
        });

        const dropoffMarker = new window.google.maps.Marker({
            position: dropoff,
            map,
            title: "Dropoff",
            label: "D",
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: {
                strokeColor: "#0A72B9",
                strokeOpacity: 1,
                strokeWeight: 5,
            },
        });

        let timerId: number | null = null;
        let carMarker: any = null;

        directionsService.route(
            {
                origin: pickup,
                destination: dropoff,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result: any, status: string) => {
                if (status === "OK" && result) {
                    directionsRenderer.setDirections(result);
                    const points = result.routes?.[0]?.overview_path ?? [];

                    if (points.length > 1) {
                        carMarker = new window.google.maps.Marker({
                            position: points[0],
                            map,
                            title: "Driver live location",
                            icon: {
                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                fillColor: "#16A34A",
                                fillOpacity: 1,
                                strokeColor: "#16A34A",
                                strokeWeight: 2,
                                scale: 6,
                                rotation: getHeading(
                                    { lat: points[0].lat(), lng: points[0].lng() },
                                    { lat: points[1].lat(), lng: points[1].lng() }
                                ),
                            },
                        });

                        let pointIndex = 0;
                        timerId = window.setInterval(() => {
                            const nextPointIndex = (pointIndex + 1) % points.length;
                            const currentPoint = points[pointIndex];
                            const nextPoint = points[nextPointIndex];
                            const heading = getHeading(
                                { lat: currentPoint.lat(), lng: currentPoint.lng() },
                                { lat: nextPoint.lat(), lng: nextPoint.lng() }
                            );

                            carMarker.setPosition(nextPoint);
                            carMarker.setIcon({
                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                fillColor: "#16A34A",
                                fillOpacity: 1,
                                strokeColor: "#16A34A",
                                strokeWeight: 2,
                                scale: 6,
                                rotation: heading,
                            });

                            pointIndex = nextPointIndex;
                        }, 1500);
                    }
                    return;
                }

                new window.google.maps.Polyline({
                    path: [pickup, dropoff],
                    geodesic: true,
                    strokeColor: "#0A72B9",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    map,
                });
            }
        );

        return () => {
            if (timerId) window.clearInterval(timerId);
            pickupMarker.setMap(null);
            dropoffMarker.setMap(null);
            if (carMarker) carMarker.setMap(null);
            directionsRenderer.setMap(null);
        };
    }, [mapsLoaded, pickup, dropoff]);

    const copyPin = async () => {
        try {
            const pinStr = driver.pin.join(" ");
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(pinStr);
            } else {
                const el = document.createElement("textarea");
                el.value = pinStr;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }
            setPinCopied(true);
            setTimeout(() => setPinCopied(false), 1500);
        } catch (e) {
            console.error("copy failed", e);
        }
    };

    const handleRating = (rate: number) => {
        setRating(rate);
    };

    const onPointerEnter = () => console.log('Enter');
    const onPointerLeave = () => console.log('Leave');
    const onPointerMove = (value: number, index: number) => console.log(value, index);

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;
        try {
            const publicId = await ensureConversation();
            if (!publicId) {
                toast.error("Chat not available for this delivery yet.");
                return;
            }
            router.push(`/inbox?conversationId=${publicId}&text=${encodeURIComponent(message)}`);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const confirmCancel = async () => {
        if (!deliveryId) return;
        try {
            const res = await cancelDelivery(deliveryId).unwrap();
            toast.success(res.message || "Delivery canceled successfully!");
            closeAllModals();
        } catch (error: any) {
            toast.error(error.data?.detail || "Failed to cancel delivery. Please try again.");
        }
    };

    const handleSubmitRating = async () => {
        if (rating === 0) return;
        try {
            const res = await rateDelivery({ deliveryId, data: { rating } }).unwrap();
            toast.success(res.message || "Rating submitted successfully!");
            closeAllModals();
        } catch (error: any) {
            toast.error(error.data?.detail || "Failed to submit rating. Please try again.");
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden">

            <div
                ref={mapRef}
                className={`absolute inset-0 w-full h-full transition-all duration-500 ${loading ? "blur-md scale-105" : "blur-0 scale-100"}`}
            />

            {mapError && (
                <div className="absolute top-4 left-1/2 z-60 -translate-x-1/2 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
                    {mapError}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
                        Finding the best ride for your pickup time....
                    </p>
                    <div className="flex items-center justify-center">
                        <iframe
                            src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
                            className="w-48 h-48 md:w-80 md:h-80"
                        />
                    </div>
                </div>
            )}

            {/* ✅ Match Modal — opens first, closes when X or Message Driver clicked */}
            {showModal && hasDriver && (
                <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <h1 className="text-xl text-center lg:text-4xl font-medium text-white mb-6">
                        We've matched you with a trusted driver for your scheduled delivery
                    </h1>
                    <div className="pointer-events-auto w-[92%] max-w-xl bg-white rounded-xl shadow-lg p-6 mx-4 relative">

                        {/* Close → opens Message Panel */}
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
                            {/* Cancel → opens Confirm modal */}
                            <button
                                onClick={() => openModal("confirm")}
                                className="w-full lg:flex-1 bg-[#E5E5E5] text-[#1E1E1C] px-4 py-3 rounded-md flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel Delivery
                            </button>

                            {/* Message Driver → opens Message Panel */}
                            <button
                                onClick={() => openModal("message")}
                                className="w-full lg:flex-1 bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white px-4 py-3 rounded-md flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Message Driver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Message Panel — opens after Match Modal, closes when Rating opened */}
            {showMessagePanel && (
                <div className="absolute inset-0 z-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="absolute top-8 right-0 lg:right-8 z-70 w-full lg:w-[542px] bg-white rounded-lg shadow-lg pointer-events-auto">
                        <p className="p-4 text-2xl font-medium text-center text-[#1E1E1C]">Pickup in {data?.estimate_arrival_time} min</p>

                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <div className="font-medium">{driver.name}</div>
                                    <div className="text-sm text-[#0A72B9] flex items-center gap-1">
                                        <Star className="inline w-4 h-4" />{driver.rating}
                                    </div>
                                </div>
                            </div>
                            <p>{driver.price}</p>
                        </div>

                        <div className="p-4 text-sm text-slate-700">
                            <div className="flex items-center gap-2 text-lg text-[#4B5563] capitalize">
                                <CarLite />
                                <span>{driver.vehicleType} - {driver.brand} • {driver.model} • {driver.registration}</span>
                            </div>
                            <div onClick={() => window.open(`tel:${driver.phone}`, "_blank")} className="flex cursor-pointer items-center gap-2 mt-2 text-lg text-[#4B5563]">
                                <Phone />
                                <span>{driver.phone}</span>
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
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Message driver"
                                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={() => handleSendMessage(message)}
                                    className="w-10 h-10 rounded-full bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center"
                                >
                                    <Send />
                                </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-sm bg-[#E5E5E5] p-4 rounded-lg">
                                {/* Cancel → opens Confirm modal */}
                                <button
                                    onClick={() => openModal("confirm")}
                                    className="text-slate-500"
                                >
                                    Cancel this Delivery?
                                </button>
                                {/* Finish → opens Rating modal */}
                                <button
                                    onClick={() => openModal("rating")}
                                    className="text-red-500"
                                >
                                    Finish & Rate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Confirmation Modal — opens over any modal, No → goes back to previous */}
            {showConfirm && (
                <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-xl w-[90%] text-center">
                        <h4 className="text-lg lg:text-4xl font-medium text-[#1E1E1C]">
                            Are you sure you want to cancel this delivery?
                        </h4>
                        <div className="mt-6 flex gap-4 justify-center">
                            {/* No → go back to Message Panel */}
                            <button
                                onClick={() => openModal("message")}
                                className="px-6 py-2 rounded bg-[#E5E5E5] w-full"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-6 py-2 rounded bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white w-full"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Rating Modal — final step, submit closes all */}
            {showRating && (
                <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-[92%] text-center relative">

                        {/* Close → go back to Message Panel */}
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
                                onClick={handleRating}
                                onPointerEnter={onPointerEnter}
                                onPointerLeave={onPointerLeave}
                                onPointerMove={onPointerMove}
                                initialValue={rating}
                                size={40}
                                allowFraction={false}
                                transition
                                fillColor="#F59E0B"
                                emptyColor="#D1D5DB"
                                style={{ display: "flex", gap: "8px" }}
                                SVGstyle={{ display: "inline-block" }}
                            />
                        </div>

                        <button
                            onClick={handleSubmitRating}
                            disabled={rating === 0}
                            className={`mt-6 w-full py-2 rounded transition-all ${rating === 0
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-linear-to-r from-[#51C7E1] to-[#0776BD] text-white'
                                }`}
                        >
                            {ratingLoading ? (
                                <span className="flex items-center justify-center">
                                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function FindRiderPage() {
    return <Suspense fallback={<div>Loading...</div>}><FindingRider /></Suspense>;
}