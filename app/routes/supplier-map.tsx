"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface Location {
  id: number
  name: string
  city: string
  type: string
  lat: number
  lng: number
}

interface SupplierMapProps {
  locations: Location[]
}

export default function SupplierMap({ locations }: SupplierMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeLocation, setActiveLocation] = useState<Location | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // This is a placeholder for actual map implementation
  // In a real application, you would use a library like Google Maps, Mapbox, or Leaflet
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // In a real implementation, you would initialize your map here
  // and add markers for each location

  return (
    <div className="relative w-full h-full" ref={mapRef}>
      {/* Placeholder Map */}
      <div className="absolute inset-0 bg-gray-200">
        {mapLoaded ? (
          <div className="w-full h-full relative bg-gray-100 overflow-hidden">
            {/* Map background image */}
            <div className="absolute inset-0">
              <img src="/europe-grid-map.png" alt="Map background" className="w-full h-full object-cover" />
            </div>

            {/* Location pins */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${((location.lng - 9) / 5) * 100}%`,
                  top: `${((54 - location.lat) / 6) * 100}%`,
                }}
                onMouseEnter={() => setActiveLocation(location)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`
                    p-1 rounded-full 
                    ${activeLocation?.id === location.id ? "bg-primary text-white scale-125" : "bg-white text-primary"}
                    transition-all duration-200 shadow-md
                  `}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Tooltip */}
                  {activeLocation?.id === location.id && (
                    <div className="absolute bottom-full mb-2 bg-white rounded-md shadow-lg p-3 w-48 z-10">
                      <h4 className="font-medium">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.city}</p>
                      <p className="text-xs text-gray-500 capitalize">{location.type}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  )
}