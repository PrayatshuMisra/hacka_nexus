"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, TrendingUp, CheckCircle, AlertCircle, Plus, Eye, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ClubOverview({ onNavigate, quickActionsRef }: { onNavigate?: (view: string) => void, quickActionsRef?: React.RefObject<HTMLDivElement> }) {
  const recentActivities = [
    {
      id: 1,
      type: "event",
      title: "TechTatva 2025 registration opened",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "member",
      title: "5 new members joined",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "post",
      title: "AI/ML Workshop post published",
      time: "6 hours ago",
      status: "success",
    },
    {
      id: 4,
      type: "budget",
      title: "Budget request approved",
      time: "1 day ago",
      status: "success",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "TechTatva 2025",
      date: "Oct 15, 2025",
      registrations: 234,
      maxParticipants: 500,
      description: "Annual technical festival.",
    },
    {
      id: 2,
      title: "Flutter Workshop",
      date: "July 22, 2025",
      registrations: 89,
      maxParticipants: 150,
      description: "Mobile app development workshop.",
    },
  ]

  const topMembers = [
    {
      id: 1,
      name: "Rohan Mathur",
      role: "Web Development Lead",
      avatar: "/placeholder.svg?height=40&width=40",
      contributions: 15,
    },
    {
      id: 2,
      name: "Mehran Pratap Singh Dhakray",
      role: "Design Lead",
      avatar: "/placeholder.svg?height=40&width=40",
      contributions: 12,
    },
    {
      id: 3,
      name: "Prayatshu Misra",
      role: "Event Coordinator",
      avatar: "/placeholder.svg?height=40&width=40",
      contributions: 11,
    },
  ]

  const [eventProgress, setEventProgress] = useState(upcomingEvents.map(() => 0))
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    upcomingEvents.forEach((event, i) => {
      const target = (event.registrations / event.maxParticipants) * 100
      if (eventProgress[i] < target) {
        intervals[i] = setInterval(() => {
          setEventProgress(prev => {
            const next = [...prev]
            if (next[i] < target) {
              next[i] = Math.min(next[i] + 2, target)
            }
            return next
          })
        }, 16)
      }
    })
    return () => intervals.forEach(interval => interval && clearInterval(interval))

  }, [upcomingEvents])

  const clubHealthTargets = [87, 92, 68, 75]
  const [clubHealthProgress, setClubHealthProgress] = useState(clubHealthTargets.map(() => 0))
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    clubHealthTargets.forEach((target, i) => {
      if (clubHealthProgress[i] < target) {
        intervals[i] = setInterval(() => {
          setClubHealthProgress(prev => {
            const next = [...prev]
            if (next[i] < target) {
              next[i] = Math.min(next[i] + 2, target)
            }
            return next
          })
        }, 16)
      }
    })
    return () => intervals.forEach(interval => interval && clearInterval(interval))

  }, [])

  const [events, setEvents] = useState(upcomingEvents)
  const [open, setOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    maxParticipants: "",
    registrations: 0,
    description: "",
  })
  const [openMeeting, setOpenMeeting] = useState(false)
  const [openAnnouncement, setOpenAnnouncement] = useState(false)
  const [openMembers, setOpenMembers] = useState(false)
  const { toast } = useToast()
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    datetime: "",
    location: "",
    agenda: "",
  })
  const [notifications, setNotifications] = useState<{
    id: number
    type: string
    title: string
    time: string
    status: string
  }[]>([])
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Activities */}
        <div className="admin-card admin-glass-strong p-0 animate-fade-in-up">
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent flex items-center">
              <span className="mr-2">Recent Activities</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </h2>
            <Button variant="outline" size="sm" className="admin-button-secondary">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {([...notifications, ...recentActivities] as typeof recentActivities).map((activity, idx) => (
                <div
                  key={activity.id ?? `activity-${idx}`}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-gray-900/40 dark:to-blue-900/30 shadow-sm hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className={`w-4 h-4 rounded-full shadow-md flex items-center justify-center ${activity.status === "success" ? "bg-green-400" : activity.status === "info" ? "bg-blue-400" : "bg-yellow-400"}`}>
                    {activity.status === "success" && <CheckCircle className="w-3 h-3 text-white" />}
                    {activity.status === "info" && <AlertCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Upcoming Events */}
        <div className="admin-card admin-glass p-0 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center">
              Upcoming Events
            </h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="admin-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                  <Input
                    type="date"
                    placeholder="Event Date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max Participants"
                    value={newEvent.maxParticipants}
                    onChange={e => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                      className="admin-button-primary"
                      onClick={() => {
                        if (!newEvent.title || !newEvent.date || !newEvent.maxParticipants) return
                        setEvents([
                          ...events,
                          {
                            id: events.length + 1,
                            title: newEvent.title,
                            date: newEvent.date,
                            registrations: 0,
                            maxParticipants: Number(newEvent.maxParticipants),
                            description: newEvent.description,
                          },
                        ])
                        setNewEvent({ title: "", date: "", maxParticipants: "", registrations: 0, description: "" })
                        setOpen(false)
                      }}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {events.map((event, idx) => (
                <div key={event.id} className="rounded-xl p-4 bg-gradient-to-br from-blue-100/60 to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/20 shadow-md hover:scale-[1.02] transition-transform duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-200 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                      {event.title}
                    </h4>
                    <Badge variant="outline" className="admin-badge-info">{event.date}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Registrations</span>
                      <span>
                        {event.registrations}/{event.maxParticipants}
                      </span>
                    </div>
                    <Progress value={event.maxParticipants ? (event.registrations / event.maxParticipants) * 100 : 0} className="admin-progress" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-200">
          <div className="admin-card admin-glass p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 animate-pulse">15</div>
            <div className="text-sm text-gray-500">Total Posts</div>
          </div>
          <div className="admin-card admin-glass p-4 text-center">
            <div className="text-2xl font-bold text-green-600 animate-pulse">1.3K</div>
            <div className="text-sm text-gray-500">Total Likes</div>
          </div>
          <div className="admin-card admin-glass p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 animate-pulse">89%</div>
            <div className="text-sm text-gray-500">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Top Contributors */}
        <div className="admin-card admin-glass p-0 animate-fade-in-up delay-300">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Top Contributors</h2>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {topMembers.map((member, index) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-white/60 to-purple-50/60 dark:from-gray-900/40 dark:to-purple-900/30 shadow-sm hover:scale-[1.02] transition-transform duration-200">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-lg shadow-lg ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse' : index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`}>{index + 1}</div>
                  <Avatar className="w-12 h-12 shadow-md ring-2 ring-blue-400">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-base">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600">{member.contributions}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Club Health */}
        <div className="admin-card admin-glass p-0 animate-fade-in-up delay-400">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Club Health</h2>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Member Engagement</span>
                <span>87%</span>
              </div>
              <Progress value={clubHealthProgress[0]} className="admin-progress" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Event Attendance</span>
                <span>92%</span>
              </div>
              <Progress value={clubHealthProgress[1]} className="admin-progress" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Budget Utilization</span>
                <span>68%</span>
              </div>
              <Progress value={clubHealthProgress[2]} className="admin-progress" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Social Media Reach</span>
                <span>75%</span>
              </div>
              <Progress value={clubHealthProgress[3]} className="admin-progress" />
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div ref={quickActionsRef} className="admin-card admin-glass p-0 animate-fade-in-up delay-500">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">Quick Actions</h2>
          </div>
          <div className="px-6 pb-6 space-y-3">
            <Dialog open={openMeeting} onOpenChange={setOpenMeeting}>
              <DialogTrigger asChild>
                <Button variant="outline" className="admin-button-primary w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Schedule Meeting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Meeting Title" value={meetingForm.title} onChange={e => setMeetingForm(f => ({ ...f, title: e.target.value }))} />
                  <Input type="datetime-local" placeholder="Date & Time" value={meetingForm.datetime} onChange={e => setMeetingForm(f => ({ ...f, datetime: e.target.value }))} />
                  <Input placeholder="Location" value={meetingForm.location} onChange={e => setMeetingForm(f => ({ ...f, location: e.target.value }))} />
                  <Textarea placeholder="Agenda (optional)" value={meetingForm.agenda} onChange={e => setMeetingForm(f => ({ ...f, agenda: e.target.value }))} />
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenMeeting(false)}>Close</Button>
                    <Button className="admin-button-primary ml-2" onClick={() => {
                      if (!meetingForm.title || !meetingForm.datetime || !meetingForm.location) return
                      setNotifications(prev => [
                        {
                          id: Date.now(),
                          type: "meeting",
                          title: `Meeting Scheduled: ${meetingForm.title}`,
                          time: "Just now",
                          status: "info",
                        },
                        ...prev,
                      ])
                      toast({
                        title: "Meeting Scheduled!",
                        description: `A notification has been sent to all members about '${meetingForm.title}'.`,
                        variant: "success",
                      })
                      setMeetingForm({ title: "", datetime: "", location: "", agenda: "" })
                      setOpenMeeting(false)
                    }}>Schedule</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={openAnnouncement} onOpenChange={setOpenAnnouncement}>
              <DialogTrigger asChild>
                <Button variant="outline" className="admin-button-primary w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Send Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Announcement Title" value={announcementForm.title} onChange={e => setAnnouncementForm(f => ({ ...f, title: e.target.value }))} />
                  <Textarea placeholder="Message" value={announcementForm.message} onChange={e => setAnnouncementForm(f => ({ ...f, message: e.target.value }))} />
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenAnnouncement(false)}>Close</Button>
                    <Button className="admin-button-primary ml-2" onClick={() => {
                      if (!announcementForm.title || !announcementForm.message) return
                      setNotifications(prev => [
                        {
                          id: Date.now(),
                          type: "announcement",
                          title: `Announcement: ${announcementForm.title}`,
                          time: "Just now",
                          status: "info",
                        },
                        ...prev,
                      ])
                      toast({
                        title: "Announcement Sent!",
                        description: `A notification has been sent to all members about '${announcementForm.title}'.`,
                        variant: "success",
                      })
                      setAnnouncementForm({ title: "", message: "" })
                      setOpenAnnouncement(false)
                    }}>Send</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={openMembers} onOpenChange={setOpenMembers}>
              <DialogTrigger asChild>
                <Button variant="outline" className="admin-button-primary w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Members
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Manage Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Search members..." />
                  <div className="text-gray-500 text-sm">(Member management UI coming soon)</div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenMembers(false)}>Close</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="admin-button-primary w-full justify-start"
              onClick={() => onNavigate && onNavigate('analytics')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
