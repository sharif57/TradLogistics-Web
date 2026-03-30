"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DeliveryStatus =
    | "pending"
    | "searching"
    | "driver_assigned"
    | "arrived_at_pickup"
    | "picked_up"
    | "in_transit"
    | "arrived_at_dropoff"
    | "delivered"
    | "cancelled";

export type WsConnectionStatus =
    | "idle"
    | "connecting"
    | "connected"
    | "reconnecting"
    | "disconnected";

export type LiveDelivery = Record<string, unknown>;

export interface DeliveryWSContextValue {
    /** Latest delivery object from the WebSocket (null until first message) */
    delivery: LiveDelivery | null;
    /** Live socket connection state */
    wsStatus: WsConnectionStatus;
    /** Currently watched delivery id */
    deliveryId: string | null;
    /** Call this to start/switch watching a delivery. Pass null to disconnect. */
    setDeliveryId: (id: string | null) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_BASE      = "wss://api.tradlogistics.com/ws/ongoing-deliveries";
const RECONNECT_MS = 3000;

// ─── Context ──────────────────────────────────────────────────────────────────

const DeliveryWSContext = createContext<DeliveryWSContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DeliveryWebSocketProvider({ children }: { children: ReactNode }) {
    const [delivery,   setDelivery]   = useState<LiveDelivery | null>(null);
    const [wsStatus,   setWsStatus]   = useState<WsConnectionStatus>("idle");
    const [deliveryId, setDeliveryIdState] = useState<string | null>(null);

    // ── Refs (stable across renders, no stale-closure risk) ──────────────────
    const wsRef              = useRef<WebSocket | null>(null);
    const reconnectTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReconnectRef = useRef(false);
    const deliveryIdRef      = useRef<string | null>(null); // mirrors state

    // ── Helpers ───────────────────────────────────────────────────────────────

    const clearTimer = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    };

    const closeSocket = (code = 1000, reason = "intentional") => {
        if (wsRef.current) {
            wsRef.current.onclose = null; // prevent reconnect callback
            wsRef.current.onerror = null;
            wsRef.current.onmessage = null;
            wsRef.current.close(code, reason);
            wsRef.current = null;
        }
    };

    // ── connect — stable, uses only refs internally ───────────────────────────
    const connect = useCallback(() => {
        const id    = deliveryIdRef.current;
        const token = typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (!id) {
            console.warn("[WS Global] deliveryId is null — skipping connect");
            return;
        }
        if (!token) {
            console.warn("[WS Global] No accessToken in localStorage — cannot connect");
            return;
        }

        // Guard against duplicate sockets
        const state = wsRef.current?.readyState;
        if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
            console.log("[WS Global] Already open/connecting (readyState=%d) — skipping", state);
            return;
        }

        const url = `${WS_BASE}/${id}/?token=${token}`;
        console.log(`[WS Global] ► Connecting → ${url}`);
        setWsStatus("connecting");

        const ws = new WebSocket(url);
        wsRef.current = ws;

        // onopen
        ws.onopen = () => {
            console.log(`[WS Global] ✅ Connected  deliveryId=${id}`);
            clearTimer();
            setWsStatus("connected");
        };

        // onmessage
        ws.onmessage = (event: MessageEvent) => {
            let payload: any;
            try {
                payload = JSON.parse(event.data as string);
            } catch (err) {
                console.error("[WS Global] ❌ JSON parse error:", err, "\nRaw:", event.data);
                return;
            }

            // ── Full structured console log ──────────────────────────────────
            console.group(`[WS Global] 📨 Message  type="${payload?.type}"  ws_status="${payload?.status}"`);
            console.log("Full payload :", payload);
            if (Array.isArray(payload?.data) && payload.data.length > 0) {
                const d = payload.data[0];
                console.log("─────────────── Delivery ───────────────");
                console.log("  id             :", d?.id);
                console.log("  public_id      :", d?.public_id);
                console.log("  status         :", d?.status);
                console.log("  vehicle_type   :", d?.vehicle_type);
                console.log("  price          :", d?.price);
                console.log("  payment_method :", d?.payment_method);
                console.log("  PIN            :", d?.verification_pin);
                console.log("  pickup_addr    :", d?.pickup_address);
                console.log("  pickup_lat/lng :", d?.pickup_lat, "/", d?.pickup_lng);
                console.log("  dropoff_addr   :", d?.dropoff_address);
                console.log("  dropoff_lat/lng:", d?.dropoff_lat, "/", d?.dropoff_lng);
                console.log("  driver_lat/lng :", d?.driver_last_lat, "/", d?.driver_last_lng);
                console.log("  est_pickup_min :", d?.estimated_pickup_time);
                console.log("  est_arrival    :", d?.estimate_arrival_time);
                console.log("  estimate_km    :", d?.estimate_km);
                console.log("  driver         :", d?.driver ?? "(null — may populate later)");
                console.log("  customer       :", d?.customer);
                console.log("  is_scheduled   :", d?.is_scheduled);
                console.log("  scheduled_at   :", d?.scheduled_at);
                console.log("  created_at     :", d?.created_at);
                console.log("  updated_at     :", d?.updated_at);
                console.log("  Full object    :", d);
            } else {
                console.warn("  data array empty or missing");
            }
            console.groupEnd();
            // ── End console log ──────────────────────────────────────────────

            if (
                payload?.type === "ongoing_deliveries" &&
                Array.isArray(payload?.data) &&
                payload.data.length > 0
            ) {
                setDelivery(payload.data[0] as LiveDelivery);
            } else {
                console.warn("[WS Global] Unexpected payload shape — state not updated");
            }
        };

        // onerror
        ws.onerror = (err) => {
            console.error("[WS Global] ⚡ Error:", err);
            // onclose fires right after; reconnect lives there
        };

        // onclose
        ws.onclose = (ev: CloseEvent) => {
            console.warn(
                `[WS Global] 🔌 Closed  code=${ev.code}  reason="${ev.reason}"  wasClean=${ev.wasClean}`
            );
            setWsStatus("disconnected");

            if (shouldReconnectRef.current && ev.code !== 1000) {
                console.log(`[WS Global] Scheduling reconnect in ${RECONNECT_MS}ms…`);
                setWsStatus("reconnecting");
                clearTimer();
                reconnectTimerRef.current = setTimeout(connect, RECONNECT_MS);
            }
        };
    }, []); // zero deps — all access via refs

    // ── Public API: setDeliveryId ─────────────────────────────────────────────
    const setDeliveryId = useCallback((id: string | null) => {
        const prev = deliveryIdRef.current;

        // No-op if same id
        if (id === prev) return;

        console.log(`[WS Global] setDeliveryId: "${prev}" → "${id}"`);

        // Tear down current connection
        shouldReconnectRef.current = false;
        clearTimer();
        closeSocket(1000, "switching delivery");
        setDelivery(null);

        deliveryIdRef.current = id;
        setDeliveryIdState(id);

        if (id) {
            shouldReconnectRef.current = true;
            connect();
        } else {
            setWsStatus("idle");
        }
    }, [connect]);

    // ── App-level cleanup on unmount ──────────────────────────────────────────
    useEffect(() => {
        return () => {
            console.log("[WS Global] 🧹 Provider unmounting — permanent cleanup");
            shouldReconnectRef.current = false;
            clearTimer();
            closeSocket(1000, "provider unmount");
            setWsStatus("disconnected");
        };
    }, []);

    return (
        <DeliveryWSContext.Provider value={{ delivery, wsStatus, deliveryId, setDeliveryId }}>
            {children}
        </DeliveryWSContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDeliveryWS(): DeliveryWSContextValue {
    const ctx = useContext(DeliveryWSContext);
    if (!ctx) {
        throw new Error(
            "useDeliveryWS must be used inside <DeliveryWebSocketProvider>. " +
            "Add it to your root layout."
        );
    }
    return ctx;
}