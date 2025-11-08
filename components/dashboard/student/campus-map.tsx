"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Search, Calendar, Clock, Users, Navigation, Zap, BookOpen, Utensils, Car } from "lucide-react"
import { supabase } from "@/lib/supabase"
import dynamic from "next/dynamic"

interface Location {
  id: number
  name: string
  type: "academic" | "hostel" | "dining" | "sports" | "admin" | "parking" | "other"
  coordinates: { x: number; y: number; lat: number; lng: number }
  description: string
  facilities: string[]
  isOpen: boolean
  events?: Event[]
}

interface Event {
  id: number
  title: string
  clubName: string
  time: string
  attendees: number
}

const getLocationIcon = (type: string) => {
  switch (type) {
    case "academic":
      return <BookOpen className="w-4 h-4" />
    case "dining":
      return <Utensils className="w-4 h-4" />
    case "sports":
      return <Zap className="w-4 h-4" />
    case "hostel":
      return <Users className="w-4 h-4" />
    case "admin":
      return <Navigation className="w-4 h-4" />
    case "parking":
      return <Car className="w-4 h-4" />
    default:
      return <MapPin className="w-4 h-4" />
  }
}

const getLocationColor = (type: string) => {
  switch (type) {
    case "academic":
      return "bg-blue-500"
    case "dining":
      return "bg-orange-500"
    case "sports":
      return "bg-green-500"
    case "hostel":
      return "bg-purple-500"
    case "admin":
      return "bg-red-500"
    case "parking":
      return "bg-gray-500"
    default:
      return "bg-emerald-500"
  }
}

export function CampusMap() {
  const [locations, setLocations] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLocations, setFilteredLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [MapComponent, setMapComponent] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically import the map component only on client side
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
        // Import CSS dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        const L = require('leaflet');
        
        const createDivIcon = (jsx: React.ReactElement) => {
          return L.divIcon({
            html: require('react-dom/server').renderToStaticMarkup(jsx),
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });
        };

        const markerIcons: Record<string, any> = {
          academic: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#3b82f6',borderRadius:16}}><BookOpen className="w-6 h-6 text-white" /></span>),
          dining: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#f59e42',borderRadius:16}}><Utensils className="w-6 h-6 text-white" /></span>),
          sports: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#22c55e',borderRadius:16}}><Zap className="w-6 h-6 text-white" /></span>),
          hostel: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#a78bfa',borderRadius:16}}><Users className="w-6 h-6 text-white" /></span>),
          admin: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#ef4444',borderRadius:16}}><Navigation className="w-6 h-6 text-white" /></span>),
          parking: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#6b7280',borderRadius:16}}><Car className="w-6 h-6 text-white" /></span>),
          other: createDivIcon(<span style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#10b981',borderRadius:16}}><MapPin className="w-6 h-6 text-white" /></span>),
        };

        setMapComponent({ MapContainer, TileLayer, Marker, Popup, markerIcons })
      })
    }

    const fetchLocations = async () => {
      setLoading(true)
      const { data: locs, error } = await supabase.from("locations").select("*")
      if (locs) {
   
        const locsWithEvents = await Promise.all(locs.map(async (loc: any) => {
          const { data: events } = await supabase.from("events").select("id,title,club_id,start_date,venue,current_participants,location_id").eq("location_id", loc.id)
          return { ...loc, events: events || [] }
        }))
        setLocations(locsWithEvents)
        setFilteredLocations(locsWithEvents)
      }
      setLoading(false)
    }
    fetchLocations()
  }, [])

  useEffect(() => {
    const filtered = locations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredLocations(filtered)
  }, [searchTerm, locations])

  // Don't render the map until we're on the client side and map component is loaded
  if (!isClient || !MapComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Campus Navigation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Loading campus map...</p>
          </div>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup, markerIcons } = MapComponent

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Campus Navigation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Explore MIT Manipal campus and discover ongoing events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="student-card-gradient h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Campus Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <MapContainer center={[13.353, 74.792]} zoom={16} scrollWheelZoom={true} style={{ height: 500, borderRadius: 16 }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.coordinates.lat, location.coordinates.lng]}
                      icon={markerIcons[location.type] || markerIcons.other}
                    >
                      <Popup>
                        <div className="font-semibold mb-1">{location.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{location.description}</div>
                        <div className="mb-1">
                          <span className="font-medium">Facilities:</span> {(Array.isArray(location.facilities)
                            ? location.facilities
                            : typeof location.facilities === 'string'
                              ? location.facilities.split(',').map((f: string) => f.trim())
                              : []
                          ).join(', ')}
                        </div>
                        {location.events && location.events.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Events:</span>
                            <ul className="list-disc ml-4">
                              {location.events.map((event: any, index: number) => (
                                <li key={event.id}>{event.title} ({event.start_date ? new Date(event.start_date).toLocaleTimeString() : ''})</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </div>

          {/* Location Details & Search */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="student-card">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected Location Details */}
            {selectedLocation && (
              <Card className="student-card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getLocationIcon(selectedLocation.type)}
                    {selectedLocation.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{selectedLocation.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.facilities.map((facility: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedLocation.events && selectedLocation.events.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ongoing Events
                      </h4>
                      <div className="space-y-2">
                        {selectedLocation.events.map((event: any, index: number) => (
                          <div key={event.id} className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                            <h5 className="font-medium">{event.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">by {event.clubName}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.attendees} attending
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full student-button-primary">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Access Locations */}
            <Card className="student-card">
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full ${getLocationColor(location.type)} flex items-center justify-center text-white text-xs`}
                          >
                            {getLocationIcon(location.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{location.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{location.type}</p>
                          </div>
                        </div>
                        {location.events && location.events.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {location.events.length} events
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export a dynamically loaded version to prevent SSR issues
export default dynamic(() => Promise.resolve(CampusMap), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Campus Navigation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Loading campus map...</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    </div>
  )
})
