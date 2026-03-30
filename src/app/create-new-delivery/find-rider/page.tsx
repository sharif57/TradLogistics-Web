/* eslint-disable @next/next/no-img-element */
"use client";


import CarLite from "@/components/icon/carLite";
import {
    useCancelDeliveryMutation,
    useGetDeliveryQuery,
    useRateDeliveryMutation,
    useUpdateDeliveryStatusMutation,
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
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
import { Rating } from "react-simple-star-rating";
import { FaSpinner } from "react-icons/fa";
import { useCreateConversationMutation } from "@/redux/feature/chatSlice";
import { DeliveryStatus, useDeliveryWS, WsConnectionStatus } from "@/lib/Deliverywebsocketcontext";

// ─── Constants ────────────────────────────────────────────────────────────────

type LatLng = { lat: number; lng: number };

const DRIVER_MODAL_STATUSES: DeliveryStatus[] = [
    "driver_assigned",
    "arrived_at_pickup",
];
const MESSAGE_PANEL_STATUSES: DeliveryStatus[] = [
    "picked_up",
    "in_transit",
    "arrived_at_dropoff",
];

const STATUS_LABELS: Record<DeliveryStatus, string> = {
    pending: "Pending",
    searching: "Searching for a driver…",
    driver_assigned: "Driver Assigned",
    arrived_at_pickup: "Driver Arrived at Pickup",
    picked_up: "Package Picked Up",
    in_transit: "In Transit",
    arrived_at_dropoff: "Arrived at Drop-off",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const WS_INDICATOR: Record<WsConnectionStatus, { dot: string; label: string }> = {
    idle: { dot: "bg-slate-400", label: "Idle" },
    connecting: { dot: "bg-yellow-400 animate-pulse", label: "Connecting" },
    connected: { dot: "bg-green-500", label: "Connected" },
    reconnecting: { dot: "bg-orange-400 animate-pulse", label: "Reconnecting" },
    disconnected: { dot: "bg-red-500", label: "Disconnected" },
};

declare global {
    interface Window { google: any }
}

// ─── Google Maps loader ───────────────────────────────────────────────────────

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.google?.maps) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector("script[data-google-maps='true']");
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
            return;
        }
        const s = document.createElement("script");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        s.async = true; s.defer = true;
        s.dataset.googleMaps = "true";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Google Maps failed to load"));
        document.head.appendChild(s);
    });
};

// ─── FindingRider ─────────────────────────────────────────────────────────────

function FindingRider() {
    const params = useSearchParams();
    const deliveryId = params.get("deliveryId");
    const router = useRouter();

    // ── Global WebSocket — already alive from layout ──────────────────────────
    const { delivery: wsDelivery, wsStatus, setDeliveryId } = useDeliveryWS();

    const [updateDeliveryStatus, { isLoading: completingDelivery }] = useUpdateDeliveryStatusMutation();

    // Tell the global WS which delivery to watch whenever the URL param changes
    useEffect(() => {
        console.log(`[FindRiderPage] deliveryId from URL: "${deliveryId}"`);
        setDeliveryId(deliveryId);
        // On unmount, keep the socket alive (layout owns it).
        // If you want to stop watching when leaving the page, uncomment:
        // return () => setDeliveryId(null);
    }, [deliveryId, setDeliveryId]);

    // ── REST query (initial render / fallback before first WS message) ────────
    const { data: restData, isLoading } = useGetDeliveryQuery(deliveryId, {
        skip: !deliveryId,
        refetchOnMountOrArgChange: true,
    });

    // ── Merge: WS wins, REST is fallback ─────────────────────────────────────
    const delivery = useMemo<Record<string, unknown> | undefined>(() => {
        if (wsDelivery) {
            console.log("[DATA] ✅ Source = WebSocket:", wsDelivery);
            return wsDelivery as Record<string, unknown>;
        }
        const rest = (
            (restData as { data?: Record<string, unknown> } | undefined)?.data ?? restData
        ) as Record<string, unknown> | undefined;
        if (rest) console.log("[DATA] ℹ️  Source = REST (no WS data yet):", rest);
        return rest;
    }, [wsDelivery, restData]);

    // ── Derived values ────────────────────────────────────────────────────────
    const status = (delivery?.status ?? "searching") as DeliveryStatus;
    const apiDriver = (delivery?.driver as Record<string, unknown> | null | undefined) ?? null;

    const IMAGE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const GOOGLEAPI = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const pinDigits = String(delivery?.verification_pin ?? "")
        .split("").filter(c => /\d/.test(c)).map(Number);

    const driver = {
        name: String(apiDriver?.name ?? "Assigned Driver"),
        rating: Number(apiDriver?.average_rating ?? 0),
        price: delivery?.price ? `$${String(delivery.price)}` : "$0",
        vehicleType: String(apiDriver?.vehicle_type ?? delivery?.vehicle_type ?? "Vehicle"),
        brand: String(apiDriver?.brand ?? "N/A"),
        model: String(apiDriver?.model ?? "N/A"),
        registration: String(apiDriver?.registration_number ?? "N/A"),
        phone: String(apiDriver?.phone ?? "N/A"),
        pin: pinDigits.length > 0 ? pinDigits : [0, 0, 0, 0],
        avatar: IMAGE
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

    // Log state changes
    useEffect(() => {
        console.log(
            `[STATE] status="${status}" | wsStatus="${wsStatus}" | pickup=${JSON.stringify(pickup)} | dropoff=${JSON.stringify(dropoff)}`
        );
    }, [status, wsStatus, pickup, dropoff]);

    // ── Map ───────────────────────────────────────────────────────────────────
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        if (!GOOGLEAPI) { setMapError("NEXT_PUBLIC_GOOGLE_API_KEY not set"); return; }
        loadGoogleMapsScript(GOOGLEAPI)
            .then(() => { console.log("[MAPS] Loaded ✅"); setMapsLoaded(true); })
            .catch((e: Error) => { console.error("[MAPS] Error:", e.message); setMapError(e.message); });
    }, [GOOGLEAPI]);

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

        const pM = new window.google.maps.Marker({ position: pickup, map, title: "Pickup", label: "P" });
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
                    console.warn("[MAPS] Directions failed:", s, "— fallback polyline");
                    new window.google.maps.Polyline({
                        path: [pickup, dropoff], geodesic: true,
                        strokeColor: "#0A72B9", strokeOpacity: 1, strokeWeight: 4, map,
                    });
                }
            }
        );
        return () => { pM.setMap(null); dM.setMap(null); dr.setMap(null); };
    }, [mapsLoaded, pickup, dropoff]);

    // ── Modals ────────────────────────────────────────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMessagePanel, setShowMessagePanel] = useState(false);
    const [showRating, setShowRating] = useState(false);

    const closeAllModals = useCallback(() => {

        setShowModal(false); setShowMessagePanel(false);
        setShowConfirm(false); setShowRating(false);
    }, []);

    // ── Mutations ─────────────────────────────────────────────────────────────
    const [createConversation] = useCreateConversationMutation();
    const [cancelDelivery] = useCancelDeliveryMutation();
    const [rateDelivery, { isLoading: ratingLoading }] = useRateDeliveryMutation();

    // ── Misc state ────────────────────────────────────────────────────────────
    const [message, setMessage] = useState("");
    const [pinCopied, setPinCopied] = useState(false);
    const [rating, setRating] = useState(0);
    const [conversationPublicId, setConversationPublicId] = useState<string | null>(null);

    // ── Conversation ──────────────────────────────────────────────────────────
    const updateConversationQuery = (publicId: string) => {
        const next = new URLSearchParams(params.toString());
        next.set("conversationId", publicId);
        router.replace(`/create-new-delivery/find-rider?${next.toString()}`);
    };

    const ensureConversation = async () => {
        if (conversationPublicId) { updateConversationQuery(conversationPublicId); return conversationPublicId; }
        const res = await createConversation({
            user_id: apiDriver ? (apiDriver as Record<string, unknown>).user_id : undefined,
            delivery_id: delivery?.id,
        }).unwrap();
        const publicId = String(res.data?.public_id || "");
        if (publicId) { setConversationPublicId(publicId); updateConversationQuery(publicId); }
        return publicId;
    };

    const openModal = useCallback((modal: "match" | "message" | "confirm" | "rating") => {
        setShowModal(modal === "match");
        setShowMessagePanel(modal === "message");
        setShowConfirm(modal === "confirm");
        setShowRating(modal === "rating");
        if (modal === "message" && delivery?.id) {
            ensureConversation().catch(() => toast.error("Unable to start chat."));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delivery?.id]);

    // ── Status → modal ────────────────────────────────────────────────────────
    useEffect(() => {
        console.log(`[MODAL] Evaluating status="${status}"`);
        if (status === "searching" || status === "pending") { closeAllModals(); return; }
        if (DRIVER_MODAL_STATUSES.includes(status)) {
            console.log("[MODAL] → Match modal");
            setShowModal(true); setShowMessagePanel(false); setShowConfirm(false); setShowRating(false);
            return;
        }
        if (MESSAGE_PANEL_STATUSES.includes(status)) {
            console.log("[MODAL] → Message panel");
            setShowModal(false); setShowMessagePanel(true); setShowConfirm(false); setShowRating(false);
            return;
        }
        if (status === "delivered") {
            console.log("[MODAL] → Rating modal");
            setShowModal(false); setShowMessagePanel(false); setShowConfirm(false); setShowRating(true);
            return;
        }
        if (status === "cancelled") { console.log("[MODAL] → Cancelled"); closeAllModals(); }
    }, [status, closeAllModals]);

    // ── is_completed from WS → auto close ─────────────────────────────────────
    useEffect(() => {
        const isCompleted = delivery?.is_completed === true;
        if (isCompleted) {
            console.log("[WS] is_completed=true received, closing modals");
            closeAllModals();
            setDeliveryId(null);
        }
    }, [delivery?.is_completed, closeAllModals]);

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
            if (!publicId) { toast.error("Chat not available yet."); return; }
            router.push(`/inbox?conversationId=${publicId}&text=${encodeURIComponent(msg)}`);
        } catch (e) { console.error("[CHAT] Error:", e); }
    };

    const confirmCancel = async () => {
        if (!deliveryId) return;
        try {
            const res = await cancelDelivery(deliveryId).unwrap();
            toast.success(res.message || "Delivery canceled!");
            closeAllModals();
            setDeliveryId(null); // stop watching after cancel
        } catch (e: any) { toast.error(e.data?.detail || "Failed to cancel delivery."); }
    };

    const handleCompleteAndOpenRating = async () => {
        if (!deliveryId || completingDelivery) return;
        try {
            await updateDeliveryStatus({ deliveryId, data: { is_completed: true } }).unwrap();
            toast.success("Delivery completed!");
            closeAllModals();
            setDeliveryId(null);
        } catch (e: any) {
            toast.error(e.data?.detail || "Failed to complete delivery.");
        }
    };



    const handleSubmitRating = async () => {
        if (!deliveryId || rating === 0 || completingDelivery) return;
        try {
            await updateDeliveryStatus({ deliveryId, data: { is_completed: true } }).unwrap();
            const res = await rateDelivery({ deliveryId, data: { rating } }).unwrap();
            toast.success(res.message || "Rating submitted!");
            closeAllModals();
            setDeliveryId(null);
        } catch (e: any) { toast.error(e.data?.detail || "Failed to submit rating."); }
    };

    // ── Derived UI values ─────────────────────────────────────────────────────
    const isTechLoading = !mapsLoaded || (isLoading && !wsDelivery);

    const etaLabel = MESSAGE_PANEL_STATUSES.includes(status)
        ? `Dropoff at ${delivery?.estimate_arrival_time
            ? `${Math.floor(Number(delivery.estimate_arrival_time) / 60)}h ${Number(delivery.estimate_arrival_time) % 60}min` : "—"}`
        : `Pickup in ${String(delivery?.estimated_pickup_time ?? delivery?.estimate_arrival_time ?? "—")} min`;

    const wsIndicator = WS_INDICATOR[wsStatus];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="relative w-full h-full overflow-hidden">

            {/* Map canvas */}
            <div
                ref={mapRef}
                className={`absolute inset-0 w-full h-full transition-all duration-500 ${isTechLoading ? "blur-md scale-105" : "blur-0 scale-100"
                    }`}
            />

            {/* WS status pill — top-left corner */}
            <div className="absolute top-3 left-3 z-50 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium shadow-sm pointer-events-none select-none">
                <span className={`w-2 h-2 rounded-full ${wsIndicator.dot}`} />
                <span className="text-slate-600">{wsIndicator.label}</span>
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
                            className={`absolute top-0 right-0 p-2 rounded-bl-3xl rounded-tr-xl ${completingDelivery ? "bg-slate-400 cursor-not-allowed" : "bg-[#BF0C0A] cursor-pointer"
                                }`}
                            onClick={handleCompleteAndOpenRating}
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

                        <div className="mt-4">
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

            {/* ── Message / Tracking Panel ──────────────────────────────────── */}
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

                        <div className="px-4 pb-2 text-slate-700">
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
                            <div className="mt-4 text-lg font-medium text-[#4B5563] flex items-center gap-2">
                                <span>Delivery Verification PIN:</span>
                                <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
                                <button onClick={copyPin} className="ml-2 text-sky-600">
                                    {pinCopied ? <CopyCheck /> : <Copy />}
                                </button>
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
                                <button
                                    onClick={handleCompleteAndOpenRating}
                                    disabled={completingDelivery}
                                    className="text-red-500 disabled:cursor-not-allowed disabled:text-red-300"
                                >
                                    {completingDelivery ? "Finishing..." : "Finish & Rate"}
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
                                onClick={() =>
                                    MESSAGE_PANEL_STATUSES.includes(status)
                                        ? openModal("message")
                                        : openModal("match")
                                }
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

            {/* ── Rating Modal ──────────────────────────────────────────────── */}
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
                                onPointerEnter={() => { }} onPointerLeave={() => { }} onPointerMove={() => { }}
                                initialValue={rating} size={40} allowFraction={false} transition
                                fillColor="#F59E0B" emptyColor="#D1D5DB"
                                style={{ display: "flex", gap: "8px" }}
                                SVGstyle={{ display: "inline-block" }}
                            />
                        </div>
                        <button
                            onClick={handleSubmitRating}
                            disabled={rating === 0}
                            className={`mt-6 w-full py-2 rounded transition-all ${rating === 0
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