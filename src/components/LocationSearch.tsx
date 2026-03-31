'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'

interface LocationSearchProps {
    onLocationSelect: (address: string, lat: number, lng: number) => void
    placeholder?: string
    initialValue?: string
    initialLat?: number
    initialLng?: number
}

interface PlacePrediction {
    description: string
    place_id: string
    main_text: string
}

type GoogleMapsWindow = Window & {
    google?: any
}

export default function LocationSearch({
    onLocationSelect,
    placeholder = 'Enter location',
    initialValue = '',
    initialLat,
    initialLng,
}: LocationSearchProps) {
    const [input, setInput] = useState(initialValue)
    const [predictions, setPredictions] = useState<PlacePrediction[]>([])
    const [loading, setLoading] = useState(false)
    const [isApiReady, setIsApiReady] = useState(false)
    const [showPredictions, setShowPredictions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const autocompleteService = useRef<any>(null)
    const geocoder = useRef<any>(null)
    const sessionToken = useRef<any>(null)

    const initializeGoogleServices = () => {
        const googleWindow = window as GoogleMapsWindow
        if (!googleWindow.google?.maps?.places) return false

        const google = googleWindow.google
        autocompleteService.current = new google.maps.places.AutocompleteService()
        geocoder.current = new google.maps.Geocoder()
        sessionToken.current = new google.maps.places.AutocompleteSessionToken()
        setIsApiReady(true)
        return true
    }

    // Initialize Google Places API
    useEffect(() => {
        if (typeof window === 'undefined') return

        if (initializeGoogleServices()) return

        const interval = window.setInterval(() => {
            if (initializeGoogleServices()) {
                window.clearInterval(interval)
            }
        }, 300)

        return () => window.clearInterval(interval)
    }, [])

    useEffect(() => {
        setInput(initialValue)
    }, [initialValue])

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInput(value)

        if (value.length > 2) {
            fetchPredictions(value)
            setShowPredictions(true)
        } else {
            setPredictions([])
            setShowPredictions(false)
        }
    }

    // Fetch predictions from Google Places
    const fetchPredictions = async (input: string) => {
        if (!autocompleteService.current) {
            setPredictions([])
            return
        }

        try {
            setLoading(true)
            const request: any = {
                input,
                sessionToken: sessionToken.current,
                types: ['geocode'],
            }

            if (typeof initialLat === 'number' && typeof initialLng === 'number') {
                request.locationBias = {
                    center: { lat: initialLat, lng: initialLng },
                    radius: 20000,
                }
            }

            const response = await autocompleteService.current.getPlacePredictions(request)

            const mappedPredictions = (response.predictions || []).map((prediction: any) => ({
                description: prediction.description,
                place_id: prediction.place_id,
                main_text:
                    prediction.structured_formatting?.main_text ||
                    prediction.description?.split(',')[0] ||
                    'Unknown location',
            }))

            setPredictions(mappedPredictions)
        } catch (error) {
            console.error('Error fetching predictions:', error)
            setPredictions([])
        } finally {
            setLoading(false)
        }
    }

    // Get coordinates from place_id
    const getCoordinates = async (placeId: string, description: string) => {
        if (!geocoder.current) return

        try {
            setLoading(true)

            // Use Geocoding API to get coordinates
            const response = await geocoder.current.geocode({
                placeId,
            })

            if (response.results && response.results.length > 0) {
                const result = response.results[0]
                const lat = result.geometry.location.lat()
                const lng = result.geometry.location.lng()
                const address = result.formatted_address

                setInput(address)
                setShowPredictions(false)
                setPredictions([])

                // Call the callback with address and coordinates
                onLocationSelect(address, lat, lng)

                // Reset session token for new prediction
                const googleWindow = window as GoogleMapsWindow
                sessionToken.current = new googleWindow.google.maps.places.AutocompleteSessionToken()
            } else {
                onLocationSelect(description, 0, 0)
            }
        } catch (error) {
            console.error('Error getting coordinates:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle prediction selection
    const handleSelectPrediction = (prediction: PlacePrediction) => {
        getCoordinates(prediction.place_id, prediction.description)
    }

    // Close predictions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowPredictions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Clear input
    const handleClear = () => {
        setInput('')
        setPredictions([])
        setShowPredictions(false)
        onLocationSelect('', 0, 0)
        inputRef.current?.focus()
    }

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-5 h-5 text-blue-500 shrink-0 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    required
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm"
                />
                {loading ? (
                    <Loader2 className="absolute right-3 w-4 h-4 text-blue-500 animate-spin" />
                ) : input ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                ) : null}
            </div>

            {!isApiReady && (
                <p className="mt-2 text-xs text-gray-500">Loading location service...</p>
            )}

            {/* Predictions Dropdown */}
            {showPredictions && predictions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {predictions.map((prediction) => (
                        <button
                            key={prediction.place_id}
                            type="button"
                            onClick={() => handleSelectPrediction(prediction)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-start gap-3"
                        >
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                    {prediction.main_text}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {prediction.description.split(',').slice(1).join(',').trim()}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {showPredictions && input.length > 2 && predictions.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-3">
                    <p className="text-gray-500 text-sm">No locations found</p>
                </div>
            )}
        </div>
    )
}
