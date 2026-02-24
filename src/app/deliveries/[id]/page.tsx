'use client';

import { useGetDeliveryByIdQuery } from '@/redux/feature/deliverySlice';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type LatLng = {
    lat: number;
    lng: number;
};

type DeliveryResponse = {
    pickup_address?: string;
    dropoff_address?: string;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_lat?: number;
    dropoff_lng?: number;
    data?: Record<string, unknown>;
};

declare global {
    interface Window {
        google?: any;
    }
}

const getMidpoint = (start: LatLng, end: LatLng): LatLng => ({
    lat: (start.lat + end.lat) / 2,
    lng: (start.lng + end.lng) / 2,
});

const createMarkerIcon = (label: string, color: string) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" fill="${color}" />
            <circle cx="22" cy="22" r="16" fill="white" />
            <text x="22" y="27" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="${color}" font-weight="700">${label}</text>
        </svg>
    `;

    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(44, 44),
    };
};

const loadGoogleMapsScript = (apiKey: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.google?.maps) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector('script[data-google-maps="true"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMaps = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google Maps failed to load'));
        document.head.appendChild(script);
    });
};

export default function Page() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { data, isLoading, isError } = useGetDeliveryByIdQuery(id, { skip: !id });

    const mapRef = useRef<HTMLDivElement | null>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const delivery = useMemo(() => {
        const response = data as DeliveryResponse | undefined;
        return (response?.data ?? response ?? {}) as Record<string, unknown>;
    }, [data]);

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

    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setMapError('Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_API_KEY.');
            return;
        }

        loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
            .then(() => setMapsLoaded(true))
            .catch((error: Error) => setMapError(error.message));
    }, [GOOGLE_MAPS_API_KEY]);

    useEffect(() => {
        if (!mapsLoaded || !pickup || !dropoff || !mapRef.current || !window.google?.maps) return;

        const midpoint = getMidpoint(pickup, dropoff);

        const map = new window.google.maps.Map(mapRef.current, {
            center: midpoint,
            zoom: 7,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
        });

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(pickup);
        bounds.extend(dropoff);
        map.fitBounds(bounds, 120);

        new window.google.maps.Marker({
            position: pickup,
            map,
            title: 'Pickup',
            icon: createMarkerIcon('S', '#2563EB'),
        });

        new window.google.maps.Marker({
            position: dropoff,
            map,
            title: 'Dropoff',
            icon: createMarkerIcon('E', '#DC2626'),
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: {
                strokeColor: '#0A72B9',
                strokeOpacity: 1,
                strokeWeight: 5,
            },
        });

        directionsService.route(
            {
                origin: pickup,
                destination: dropoff,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result: any, status: string) => {
                if (status === 'OK' && result) {
                    directionsRenderer.setDirections(result);
                    return;
                }

                new window.google.maps.Polyline({
                    path: [pickup, dropoff],
                    geodesic: true,
                    strokeColor: '#0A72B9',
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    map,
                });
            }
        );
    }, [mapsLoaded, pickup, dropoff]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center text-lg">
                Loading delivery location...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-screen w-full flex items-center justify-center text-red-600 text-lg">
                Failed to load delivery details.
            </div>
        );
    }

    if (mapError) {
        return (
            <div className="h-screen w-full flex items-center justify-center text-red-600 text-lg px-4 text-center">
                {mapError}
            </div>
        );
    }

    if (!pickup || !dropoff) {
        return (
            <div className="h-screen w-full flex items-center justify-center text-lg">
                Pickup/Dropoff coordinates are missing.
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen">
            <div ref={mapRef} className="h-full w-full" />

            <div className="absolute top-4 left-4 z-10 bg-white/95 rounded-lg shadow-md p-4 max-w-md">
                <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-semibold">S</span>
                        <span>Start Point</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[11px] font-semibold">E</span>
                        <span>End Point</span>
                    </div>
                </div>
                <p className="text-sm font-medium text-gray-500">Pickup</p>
                <p className="text-base text-gray-900">{String(delivery.pickup_address ?? 'N/A')}</p>
                <p className="text-sm font-medium text-gray-500 mt-3">Dropoff</p>
                <p className="text-base text-gray-900">{String(delivery.dropoff_address ?? 'N/A')}</p>
            </div>
        </div>
    );
}
