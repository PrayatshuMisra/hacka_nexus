"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Download,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveAs } from "file-saver"

export function EventApprovals() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "AI/ML Workshop Series",
      club: "ISTE MIT Manipal",
      clubLogo: "/placeholder.svg?height=40&width=40",
      description: "A comprehensive 3-day workshop series on Artificial Intelligence and Machine Learning",
      date: "2025-06-30",
      venue: "Innovation Centre Auditorium",
      expectedParticipants: 200,
      budgetRequested: 45000,
      status: "pending",
      submittedDate: "2025-06-26",
      category: "Technical",
      duration: "3 days",
      requirements: ["Projector", "Sound System", "WiFi", "Refreshments"],
    },
    {
      id: 2,
      title: "Cultural Night 2024",
      club: "CHords n Co. MIT",
      clubLogo: "/placeholder.svg?height=40&width=40",
      description: "Annual cultural night featuring music, dance, and drama performances",
      date: "2025-07-02",
      venue: "Student Plaza",
      expectedParticipants: 500,
      budgetRequested: 75000,
      status: "pending",
      submittedDate: "2025-06-27",
      category: "Cultural",
      duration: "1 day",
      requirements: ["Stage Setup", "Sound System", "Lighting", "Security"],
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      club: "E-Cell MIT",
      clubLogo: "/placeholder.svg?height=40&width=40",
      description: "Platform for budding entrepreneurs to pitch their innovative ideas",
      date: "2025-07-01",
      venue: "AB2 MV Seminar Hall",
      expectedParticipants: 150,
      budgetRequested: 25000,
      status: "approved",
      submittedDate: "2025-06-29",
      category: "Entrepreneurship",
      duration: "1 day",
      requirements: ["Projector", "Microphones", "Judging Panel Setup"],
    },
  ])

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterClub, setFilterClub] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleApproval = (eventId: number, status: "approved" | "rejected", comments?: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, status, reviewComments: comments } : event)))

    toast({
      title: status === "approved" ? "Event Approved" : "Event Rejected",
      description: `${events.find((e) => e.id === eventId)?.title} has been ${status}`,
    })
  }

  const filteredEvents = events.filter((event) => {
    const matchesStatus = filterStatus === "all" || event.status === filterStatus
    const matchesClub = filterClub === "all" || event.club === filterClub
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesClub && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "status-approved"
      case "pending":
        return "status-pending"
      case "rejected":
        return "status-rejected"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const EventDetailDialog = ({ event }: { event: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={event.clubLogo || "/placeholder.svg"} />
              <AvatarFallback>{event.club.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.club}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{event.duration}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Venue</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{event.venue}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Expected Participants</Label>
                  <div className="flex items-center mt-1">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{event.expectedParticipants}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget Requested</Label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">₹{event.budgetRequested.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Badge className="mt-1">{event.category}</Badge>
              </div>

              <div>
                <Label className="text-sm font-medium">Requirements</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.requirements.map((req: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Approval Actions */}
          {event.status === "pending" && (
            <div className="border-t pt-6">
              <Label className="text-sm font-medium">Review Comments</Label>
              <Textarea placeholder="Add your review comments here..." className="mt-2" rows={3} />
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="destructive" onClick={() => handleApproval(event.id, "rejected")}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button className="nexus-button-primary" onClick={() => handleApproval(event.id, "approved")}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  const handleExport = () => {
    const headers = ["Title", "Club", "Date", "Venue", "Participants", "Budget", "Status", "Category"]
    const rows = filteredEvents.map(e => [
      e.title,
      e.club,
      new Date(e.date).toLocaleDateString(),
      e.venue,
      e.expectedParticipants,
      e.budgetRequested,
      e.status,
      e.category
    ])
    const csv = [headers, ...rows].map(row => row.map(String).map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "event-approvals.csv")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Approvals</h2>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="nexus-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Events</Label>
              <Input
                id="search"
                placeholder="Search by title or club..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nexus-input"
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="nexus-select-trigger">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="club-filter">Club</Label>
              <Select value={filterClub} onValueChange={setFilterClub}>
                <SelectTrigger className="nexus-select-trigger">
                  <SelectValue placeholder="All Clubs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  <SelectItem value="GDSC MIT Manipal">ISTE MIT Manipal</SelectItem>
                  <SelectItem value="Music Club MIT">Chords n Co. MIT</SelectItem>
                  <SelectItem value="E-Cell MIT">E-Cell MIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select>
                <SelectTrigger className="nexus-select-trigger">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({events.filter((e) => e.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({events.filter((e) => e.status === "approved").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({events.filter((e) => e.status === "rejected").length})</TabsTrigger>
          <TabsTrigger value="all">All Events ({events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredEvents
            .filter((e) => e.status === "pending")
            .map((event) => (
              <Card key={event.id} className="nexus-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={event.clubLogo || "/placeholder.svg"} />
                        <AvatarFallback>{event.club.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                          {event.status === "pending" && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{event.expectedParticipants} participants</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">₹{event.budgetRequested.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Submitted by {event.club}</span>
                          <span>•</span>
                          <span>{new Date(event.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <EventDetailDialog event={event} />
                      <Button variant="destructive" size="sm" onClick={() => handleApproval(event.id, "rejected")}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="nexus-button-primary"
                        onClick={() => handleApproval(event.id, "approved")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredEvents
            .filter((e) => e.status === "approved")
            .map((event) => (
              <Card key={event.id} className="nexus-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={event.clubLogo || "/placeholder.svg"} />
                        <AvatarFallback>{event.club.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{event.expectedParticipants} participants</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">₹{event.budgetRequested.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <EventDetailDialog event={event} />
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredEvents.filter((e) => e.status === "rejected").length === 0 ? (
            <Card className="nexus-card">
              <CardContent className="p-8 text-center">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Rejected Events</h3>
                <p className="text-gray-600 dark:text-gray-400">All events are either approved or pending review</p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents
              .filter((e) => e.status === "rejected")
              .map((event) => (
                <Card key={event.id} className="nexus-card">
                  <CardContent className="p-6">{/* Similar structure as approved events */}</CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="nexus-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={event.clubLogo || "/placeholder.svg"} />
                      <AvatarFallback>{event.club.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{event.expectedParticipants} participants</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">₹{event.budgetRequested.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <EventDetailDialog event={event} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
