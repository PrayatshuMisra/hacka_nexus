"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Calendar, MapPin, Users, Clock, CheckCircle, X, Search, Filter, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Conflict {
  id: number
  type: "venue" | "schedule" | "resource"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  affectedEvents: Array<{
    id: number
    name: string
    club: string
    date: string
    time: string
    venue: string
  }>
  status: "pending" | "resolved" | "ignored"
  createdAt: string
}

export function ConflictChecker() {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [filteredConflicts, setFilteredConflicts] = useState<Conflict[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {

    const mockConflicts: Conflict[] = [
      {
        id: 1,
        type: "venue",
        severity: "high",
        title: "Venue Double Booking",
        description: "Library Auditorium is booked for two events at the same time",
        affectedEvents: [
          {
            id: 1,
            name: "Tech Talk: AI in Healthcare",
            club: "ISTE MIT Manipal",
            date: "2025-06-30",
            time: "14:00-16:00",
            venue: "Library Auditorium",
          },
          {
            id: 2,
            name: "Cultural Performance",
            club: "Chords n Co. MIT",
            date: "2025-06-30",
            time: "15:00-17:00",
            venue: "Library Auditorium",
          },
        ],
        status: "pending",
        createdAt: "2025-06-26T10:00:00Z",
      },
      {
        id: 2,
        type: "schedule",
        severity: "medium",
        title: "Overlapping Target Audience",
        description: "Two tech events scheduled at the same time for CS students",
        affectedEvents: [
          {
            id: 3,
            name: "Hackathon Kickoff",
            club: "IECSE Club",
            date: "2025-06-29",
            time: "10:00-12:00",
            venue: "DSCA Lab",
          },
          {
            id: 4,
            name: "Open Source Workshop",
            club: "ISTE MIT Manipal",
            date: "2025-06-29",
            time: "11:00-13:00",
            venue: "DSCA Lab",
          },
        ],
        status: "pending",
        createdAt: "2025-06-26T14:30:00Z",
      },
      {
        id: 3,
        type: "resource",
        severity: "low",
        title: "Equipment Conflict",
        description: "Sound system requested by multiple events",
        affectedEvents: [
          {
            id: 5,
            name: "Poetry Night",
            club: "Literary Club",
            date: "2025-07-01",
            time: "18:00-20:00",
            venue: "Student Plaza",
          },
          {
            id: 6,
            name: "Band Performance",
            club: "Chordsn Co. MIT",
            date: "2025-07-01",
            time: "19:00-21:00",
            venue: "Quadrangle",
          },
        ],
        status: "resolved",
        createdAt: "2025-06-28T16:45:00Z",
      },
    ]

    setConflicts(mockConflicts)
    setFilteredConflicts(mockConflicts)
  }, [])

  useEffect(() => {
    let filtered = conflicts

    if (searchQuery) {
      filtered = filtered.filter(
        (conflict) =>
          conflict.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conflict.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conflict.affectedEvents.some(
            (event) =>
              event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.club.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((conflict) => conflict.type === filterType)
    }

    if (filterSeverity !== "all") {
      filtered = filtered.filter((conflict) => conflict.severity === filterSeverity)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((conflict) => conflict.status === filterStatus)
    }

    setFilteredConflicts(filtered)
  }, [conflicts, searchQuery, filterType, filterSeverity, filterStatus])

  const resolveConflict = (conflictId: number) => {
    setConflicts((prev) =>
      prev.map((conflict) => (conflict.id === conflictId ? { ...conflict, status: "resolved" } : conflict)),
    )
  }

  const ignoreConflict = (conflictId: number) => {
    setConflicts((prev) =>
      prev.map((conflict) => (conflict.id === conflictId ? { ...conflict, status: "ignored" } : conflict)),
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "venue":
        return <MapPin className="w-4 h-4" />
      case "schedule":
        return <Calendar className="w-4 h-4" />
      case "resource":
        return <Users className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const pendingConflicts = conflicts.filter((c) => c.status === "pending")
  const resolvedConflicts = conflicts.filter((c) => c.status === "resolved")
  const highPriorityConflicts = conflicts.filter((c) => c.severity === "high" && c.status === "pending")

  const EventDetailsDialog = ({ event, conflict }: { event: any, conflict: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="glass-button">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl animate-fade-in-up">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold">{event.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{event.club}</span>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ml-2">{event.venue}</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-lg font-bold text-blue-600">{new Date(event.date).toLocaleDateString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Date</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-lg font-bold text-green-600">{event.time}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Time</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">{conflict.type.toUpperCase()} Conflict</Badge>
            <Badge className={getSeverityColor(conflict.severity)}>{conflict.severity.toUpperCase()}</Badge>
            <Badge variant={conflict.status === "resolved" ? "default" : "secondary"}>{conflict.status.toUpperCase()}</Badge>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Affected Events:</span> {conflict.affectedEvents.length}
          </div>
          {conflict.affectedEvents.length > 1 && (
            <div className="mt-2">
              <h4 className="font-semibold text-center mb-2">Clash Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="p-2">Event</th>
                      <th className="p-2">Club</th>
                      <th className="p-2">Venue</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conflict.affectedEvents.map((e: any) => (
                      <tr key={e.id} className="border-t dark:border-gray-700">
                        <td className="p-2 font-medium">{e.name}</td>
                        <td className="p-2">{e.club}</td>
                        <td className="p-2">{e.venue}</td>
                        <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="p-2">{e.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Show overlapping time info if possible */}
              <div className="mt-2 text-xs text-center text-red-600 dark:text-red-400">
                {conflict.type === 'venue' || conflict.type === 'schedule' ? (
                  <>
                    <span className="font-semibold">Clash Time:</span> {conflict.affectedEvents.map((e: any) => e.time).join(' / ')}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-orange-100/80 to-yellow-100/60 dark:from-orange-900/40 dark:to-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Total Conflicts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{conflicts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-red-100/80 to-pink-100/60 dark:from-red-900/40 dark:to-pink-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Pending</p>
                <p className="text-2xl font-bold text-red-600">{pendingConflicts.length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-green-100/80 to-emerald-100/60 dark:from-green-900/40 dark:to-emerald-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedConflicts.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glassy-card animate-scale-in bg-gradient-to-br from-yellow-100/80 to-orange-100/60 dark:from-yellow-900/40 dark:to-orange-900/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">High Priority</p>
              <p className="text-2xl font-bold text-red-600 flex items-center">
                {highPriorityConflicts.length}
                {highPriorityConflicts.length > 0 && <span className="ml-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="admin-glass-strong rounded-xl p-4 mb-6 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center bg-white/60 dark:bg-gray-900/60 rounded-lg px-3">
              <Search className="w-4 h-4 text-blue-500 mr-2" />
              <Input
                placeholder="Search conflicts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nexus-input border-0 bg-transparent shadow-none"
              />
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="nexus-input w-full glassy-select">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="nexus-input w-full glassy-select">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="nexus-input w-full glassy-select">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts List */}
      <div className="space-y-4">
        {filteredConflicts.length === 0 ? (
          <Card className="glassy-card animate-fade-in-up bg-gradient-to-br from-blue-50/80 to-indigo-100/60 dark:from-blue-900/40 dark:to-indigo-900/20">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">No Conflicts Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterType !== "all" || filterSeverity !== "all" || filterStatus !== "all"
                  ? "No conflicts match your current filters."
                  : "All conflicts have been resolved!"}
              </p>
            </CardContent>
          </Card>
        ) :
          filteredConflicts.map((conflict, idx) => (
            <Card
              key={conflict.id}
              className={`glassy-card animate-fade-in-up hover:scale-[1.015] hover:shadow-2xl transition-all duration-300 border-l-4 ${conflict.severity === 'high' ? 'border-l-red-500' : conflict.severity === 'medium' ? 'border-l-yellow-400' : 'border-l-blue-400'} bg-white/70 dark:bg-gray-900/60`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(conflict.type)}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {conflict.title}
                        {conflict.severity === "high" && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                      </CardTitle>
                      <CardDescription className="mt-1">{conflict.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(conflict.severity) + " flex items-center gap-1"}>
                      {conflict.severity === "high" && <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />}
                      {conflict.severity === "medium" && <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />}
                      {conflict.severity === "low" && <AlertTriangle className="w-3 h-3 mr-1 text-blue-500" />}
                      {conflict.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={conflict.status === "resolved" ? "default" : "secondary"} className="flex items-center gap-1">
                      {conflict.status === "pending" && <Clock className="w-3 h-3 mr-1 text-orange-500" />}
                      {conflict.status === "resolved" && <CheckCircle className="w-3 h-3 mr-1 text-green-500" />}
                      {conflict.status === "ignored" && <X className="w-3 h-3 mr-1 text-gray-500" />}
                      {conflict.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Affected Events:</h4>
                    <div className="space-y-2">
                      {conflict.affectedEvents.map((event) => (
                        <div key={event.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{event.club}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 flex items-center"><Calendar className="w-3 h-3 mr-1" />{new Date(event.date).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-500 flex items-center"><Clock className="w-3 h-3 mr-1" />{event.time}</span>
                            <span className="text-xs text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-1" />{event.venue}</span>
                            <EventDetailsDialog event={event} conflict={conflict} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {conflict.status === "pending" && (
                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button onClick={() => resolveConflict(conflict.id)} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                      <Button variant="outline" onClick={() => ignoreConflict(conflict.id)}>
                        <X className="w-4 h-4 mr-2" />
                        Ignore
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
