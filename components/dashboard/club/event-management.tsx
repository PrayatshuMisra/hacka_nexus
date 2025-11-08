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
import { Calendar, MapPin, Users, Clock, Plus, Edit, Eye, Download, Search, Filter, CheckCircle, XCircle, UserCheck, UserX, Mail, Phone, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  status: string;
  registrations: number;
  maxParticipants: number;
  budget: number;
};

type Registration = {
  id: number;
  studentName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  department: string;
  yearOfStudy: number;
  registrationDate: string;
  status: "pending" | "approved" | "rejected" | "attended" | "no-show";
  avatar?: string;
  dietaryRestrictions?: string;
  specialRequirements?: string;
};

export function EventManagement() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "TechTatva 2025",
      description: "Annual technical festival",
      date: "2025-10-15",
      venue: "Quadrangle",
      status: "approved",
      registrations: 234,
      maxParticipants: 500,
      budget: 50000,
    },
    {
      id: 2,
      title: "Flutter Workshop",
      description: "Mobile app development workshop",
      date: "2025-07-22",
      venue: "AB2 MV Seminar Hall",
      status: "pending",
      registrations: 89,
      maxParticipants: 150,
      budget: 15000,
    },
  ])

  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      id: 1,
      studentName: "Prayatshu Misra",
      registrationNumber: "240962386",
      email: "prayatshu.mitmpl2024@learner.manipal.edu",
      phone: "+91 79856 38485",
      department: "Computer Science Engineering",
      yearOfStudy: 2,
      registrationDate: "2025-06-26T10:30:00Z",
      status: "approved",
      avatar: "/placeholder.svg?height=40&width=40",
      dietaryRestrictions: "Vegetarian",
    },
    {
      id: 2,
      studentName: "Rohan Mathur",
      registrationNumber: "240911196",
      email: "rohan2.mitmpl2024@learner.manipal.edu",
      phone: "+91 98180 49557",
      department: "Information Technology",
      yearOfStudy: 2,
      registrationDate: "2025-06-27T14:20:00Z",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      studentName: "Mehran Dhakray",
      registrationNumber: "240962344",
      email: "mehran.mitmpl2024@learner.manipal.edu",
      phone: "+91 7428667645",
      department: "Computer Science Engineering",
      yearOfStudy: 3,
      registrationDate: "2025-06-28T09:15:00Z",
      status: "approved",
      avatar: "/placeholder.svg?height=40&width=40",
      specialRequirements: "Wheelchair accessible seating",
    },
    {
      id: 4,
      studentName: "Priya Sharma",
      registrationNumber: "240962389",
      email: "priya.sharma@learner.manipal.edu",
      phone: "+91 98765 43213",
      department: "Electrical Engineering",
      yearOfStudy: 4,
      registrationDate: "2025-06-28T16:45:00Z",
      status: "attended",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      studentName: "Rahul Kumar",
      registrationNumber: "240962390",
      email: "rahul.kumar@learner.manipal.edu",
      phone: "+91 98765 43214",
      department: "Mechanical Engineering",
      yearOfStudy: 1,
      registrationDate: "2025-06-26T11:30:00Z",
      status: "no-show",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    maxParticipants: "",
    budget: "",
  })

  const [viewEvent, setViewEvent] = useState<Event | null>(null)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [manageEvent, setManageEvent] = useState<Event | null>(null)
  const [registrationSearch, setRegistrationSearch] = useState("")
  const [registrationFilter, setRegistrationFilter] = useState<string>("all")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  const { toast } = useToast()

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const event = {
      id: events.length + 1,
      ...newEvent,
      status: "pending",
      registrations: 0,
      maxParticipants: Number.parseInt(newEvent.maxParticipants) || 100,
      budget: Number.parseInt(newEvent.budget) || 0,
    }

    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      venue: "",
      maxParticipants: "",
      budget: "",
    })

    toast({
      title: "Event Created",
      description: "Your event proposal has been submitted for approval",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "attended":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "no-show":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleExport = (event: Event) => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(event.title, 10, 20)
    doc.setFontSize(12)
    doc.text(`Date: ${new Date(event.date).toLocaleString()}`, 10, 35)
    doc.text(`Venue: ${event.venue}`, 10, 45)
    doc.text(`Registrations: ${event.registrations}/${event.maxParticipants}`, 10, 55)
    doc.text(`Budget: ₹${event.budget.toLocaleString()}`, 10, 65)
    doc.text(`Status: ${event.status}`, 10, 75)
    doc.text("Description:", 10, 85)
    doc.setFontSize(11)
    doc.text(event.description || "-", 10, 95, { maxWidth: 180 })
    doc.save(`${event.title.replace(/\s+/g, "_")}_details.pdf`)
    toast({ title: "Exported!", description: `Event details exported as PDF.`, variant: "success" })
  }

  const handleEditSave = (updatedEvent: Event) => {
    setEvents(events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev))
    setEditEvent(null)
    toast({ title: "Event Updated!", description: `Event details have been updated.`, variant: "success" })
  }

  const handleSaveDraft = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }
    const event = {
      id: events.length + 1,
      ...newEvent,
      status: "draft",
      registrations: 0,
      maxParticipants: Number.parseInt(newEvent.maxParticipants) || 100,
      budget: Number.parseInt(newEvent.budget) || 0,
    }
    setEvents([...events, event])
    setNewEvent({ title: "", description: "", date: "", venue: "", maxParticipants: "", budget: "" })
    toast({ title: "Saved as Draft", description: "Event saved as draft.", variant: "success" })
  }

  const updateRegistrationStatus = (registrationId: number, newStatus: Registration["status"]) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: newStatus } : reg
    ))
    toast({
      title: "Status Updated",
      description: `Registration status changed to ${newStatus}`,
      variant: "success"
    })
  }

  const exportRegistrations = (event: Event) => {
    const filteredRegistrations = registrations.filter(reg => {
      if (registrationFilter !== "all") {
        return reg.status === registrationFilter
      }
      return true
    })

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`${event.title} - Registrations`, 10, 20)
    doc.setFontSize(12)
    doc.text(`Total Registrations: ${filteredRegistrations.length}`, 10, 35)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 45)
    
    let yPosition = 60
    filteredRegistrations.forEach((reg, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(10)
      doc.text(`${index + 1}. ${reg.studentName} (${reg.registrationNumber})`, 10, yPosition)
      doc.setFontSize(8)
      doc.text(`   Email: ${reg.email} | Status: ${reg.status}`, 10, yPosition + 5)
      doc.text(`   Department: ${reg.department} | Year: ${reg.yearOfStudy}`, 10, yPosition + 10)
      yPosition += 20
    })
    
    doc.save(`${event.title.replace(/\s+/g, "_")}_registrations.pdf`)
    toast({
      title: "Exported!",
      description: `Registration list exported as PDF.`,
      variant: "success"
    })
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.studentName.toLowerCase().includes(registrationSearch.toLowerCase()) ||
                         reg.registrationNumber.includes(registrationSearch) ||
                         reg.email.toLowerCase().includes(registrationSearch.toLowerCase())
    const matchesFilter = registrationFilter === "all" || reg.status === registrationFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="admin-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl admin-glass animate-fade-in-up">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                    className="admin-input"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe your event"
                  rows={3}
                  className="admin-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venue">Venue *</Label>
                  <Select onValueChange={(value) => setNewEvent({ ...newEvent, venue: value })}>
                    <SelectTrigger className="admin-input">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="innovation-centre">Innovation Centre</SelectItem>
                      <SelectItem value="nlh-auditorium">NLH Auditorium</SelectItem>
                      <SelectItem value="ab5-seminar">AB5 Seminar Hall</SelectItem>
                      <SelectItem value="student-plaza">Student Plaza</SelectItem>
                      <SelectItem value="quadrangle">Quadrangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newEvent.maxParticipants}
                    onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                    placeholder="100"
                    className="admin-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Budget Request (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newEvent.budget}
                  onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                  placeholder="10000"
                  className="admin-input"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleCreateEvent} className="admin-button-primary">Submit for Approval</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="admin-tabs-list">
          <TabsTrigger value="all" className="admin-tabs-trigger">All Events</TabsTrigger>
          <TabsTrigger value="upcoming" className="admin-tabs-trigger">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="admin-tabs-trigger">Past Events</TabsTrigger>
          <TabsTrigger value="drafts" className="admin-tabs-trigger">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="admin-card admin-glass p-0 animate-fade-in-up hover:scale-[1.02] transition-transform duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                        {event.title}
                      </h3>
                      <Badge className={getStatusColor(event.status) + " admin-badge-info"}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">
                          {event.registrations}/{event.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">₹{event.budget.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full mb-4">
                      <div className="admin-progress-bar" style={{ width: `${(event.registrations / event.maxParticipants) * 100}%` }} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => setViewEvent(() => event)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => setEditEvent(() => event)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="admin-button-secondary" onClick={() => handleExport(event)}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      {event.status === "approved" && (
                        <Button size="sm" className="admin-button-primary" onClick={() => setManageEvent(() => event)}>
                          Manage Registrations
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* View Details Dialog */}
          <Dialog open={!!viewEvent} onOpenChange={open => setViewEvent(open ? viewEvent : null)}>
            <DialogContent className="max-w-lg admin-glass animate-fade-in-up">
              <DialogHeader>
                <DialogTitle>Event Details</DialogTitle>
              </DialogHeader>
              {viewEvent && (
                <div className="space-y-2">
                  <div className="font-bold text-lg">{viewEvent.title}</div>
                  <div>Date: {new Date(viewEvent.date).toLocaleString()}</div>
                  <div>Venue: {viewEvent.venue}</div>
                  <div>Registrations: {viewEvent.registrations}/{viewEvent.maxParticipants}</div>
                  <div>Budget: ₹{viewEvent.budget.toLocaleString()}</div>
                  <div>Description: {viewEvent.description}</div>
                  <div>Status: <Badge className={getStatusColor(viewEvent.status)}>{viewEvent.status}</Badge></div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          {/* Edit Event Dialog */}
          <Dialog open={!!editEvent} onOpenChange={open => setEditEvent(open ? editEvent : null)}>
            <DialogContent className="max-w-lg admin-glass animate-fade-in-up">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
              </DialogHeader>
              {editEvent && (
                <div className="space-y-4">
                  <Input value={editEvent.title} onChange={e => setEditEvent({ ...editEvent, title: e.target.value })} className="admin-input" />
                  <Input type="datetime-local" value={editEvent.date} onChange={e => setEditEvent({ ...editEvent, date: e.target.value })} className="admin-input" />
                  <Input value={editEvent.venue} onChange={e => setEditEvent({ ...editEvent, venue: e.target.value })} className="admin-input" />
                  <Input type="number" value={editEvent.maxParticipants} onChange={e => setEditEvent({ ...editEvent, maxParticipants: Number(e.target.value) })} className="admin-input" />
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget (Read-only)</Label>
                    <Input 
                      type="number" 
                      value={editEvent.budget} 
                      disabled 
                      className="admin-input bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-75" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Budget cannot be modified after event creation</p>
                  </div>
                  <Textarea value={editEvent.description} onChange={e => setEditEvent({ ...editEvent, description: e.target.value })} className="admin-input" />
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setEditEvent(null)}>Cancel</Button>
                    <Button className="admin-button-primary ml-2" onClick={() => handleEditSave(editEvent)}>Save</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          {/* Manage Registrations Dialog */}
          <Dialog open={!!manageEvent} onOpenChange={open => setManageEvent(open ? manageEvent : null)}>
            <DialogContent className="max-w-6xl admin-glass animate-fade-in-up">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Manage Registrations - {manageEvent?.title}</span>
                  <Button 
                    size="sm" 
                    className="admin-button-secondary"
                    onClick={() => manageEvent && exportRegistrations(manageEvent)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, registration number, or email..."
                      value={registrationSearch}
                      onChange={(e) => setRegistrationSearch(e.target.value)}
                      className="pl-10 admin-input"
                    />
                  </div>
                  <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
                    <SelectTrigger className="w-48 admin-input">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Registrations</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="attended">Attended</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Registration Stats */}
                <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{registrations.length}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{registrations.filter(r => r.status === "pending").length}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{registrations.filter(r => r.status === "approved").length}</div>
                    <div className="text-sm text-gray-600">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{registrations.filter(r => r.status === "attended").length}</div>
                    <div className="text-sm text-gray-600">Attended</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{registrations.filter(r => r.status === "rejected").length}</div>
                    <div className="text-sm text-gray-600">Rejected</div>
                  </div>
                </div>

                {/* Registrations List */}
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {filteredRegistrations.map((registration) => (
                    <div key={registration.id} className="admin-card admin-glass p-4 hover:scale-[1.02] transition-transform duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={registration.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{registration.studentName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{registration.studentName}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {registration.registrationNumber}
                              </span>
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {registration.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {registration.phone}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {registration.department} • Year {registration.yearOfStudy} • 
                              Registered on {new Date(registration.registrationDate).toLocaleDateString()}
                            </div>
                            {(registration.dietaryRestrictions || registration.specialRequirements) && (
                              <div className="text-xs text-orange-600 mt-1">
                                {registration.dietaryRestrictions && `Dietary: ${registration.dietaryRestrictions}`}
                                {registration.specialRequirements && ` • Special: ${registration.specialRequirements}`}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getRegistrationStatusColor(registration.status)}>
                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {registration.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateRegistrationStatus(registration.id, "approved")}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateRegistrationStatus(registration.id, "rejected")}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {registration.status === "approved" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => updateRegistrationStatus(registration.id, "attended")}
                                >
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Mark Attended
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateRegistrationStatus(registration.id, "no-show")}
                                >
                                  <UserX className="w-3 h-3 mr-1" />
                                  No Show
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRegistration(registration)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No registrations found matching your criteria</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Registration Details Dialog */}
          <Dialog open={!!selectedRegistration} onOpenChange={open => setSelectedRegistration(open ? selectedRegistration : null)}>
            <DialogContent className="max-w-lg admin-glass animate-fade-in-up">
              <DialogHeader>
                <DialogTitle>Registration Details</DialogTitle>
              </DialogHeader>
              {selectedRegistration && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedRegistration.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedRegistration.studentName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedRegistration.studentName}</h3>
                      <p className="text-sm text-gray-600">{selectedRegistration.registrationNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p>{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Phone</Label>
                      <p>{selectedRegistration.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Department</Label>
                      <p>{selectedRegistration.department}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Year of Study</Label>
                      <p>{selectedRegistration.yearOfStudy}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Registration Date</Label>
                      <p>{new Date(selectedRegistration.registrationDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <Badge className={getRegistrationStatusColor(selectedRegistration.status)}>
                        {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  {selectedRegistration.dietaryRestrictions && (
                    <div>
                      <Label className="text-xs text-gray-500">Dietary Restrictions</Label>
                      <p className="text-sm">{selectedRegistration.dietaryRestrictions}</p>
                    </div>
                  )}
                  {selectedRegistration.specialRequirements && (
                    <div>
                      <Label className="text-xs text-gray-500">Special Requirements</Label>
                      <p className="text-sm">{selectedRegistration.specialRequirements}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your first event to get started</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Past Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Your completed events will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Edit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Draft Events</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save events as drafts to continue working on them later
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
