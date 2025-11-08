"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface UpcomingEventsProps {
  search?: string;
  category?: string;
}

export function UpcomingEvents({ search = '', category = 'All' }: UpcomingEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [userId, setUserId] = useState<number | null>(null)
  const [registeringEvent, setRegisteringEvent] = useState<any | null>(null)
  const [form, setForm] = useState({
    studentName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    department: '',
    yearOfStudy: '',
    dietaryRestrictions: '',
    specialRequirements: '',
  })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data')
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          setUserId(parsed.id)
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (typeof userId === 'number') loadUpcomingEvents()
  
  }, [userId])

  const loadUpcomingEvents = async () => {
    if (typeof userId !== 'number') return
    try {
      setLoading(true)
 
      // First, check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase.from('events').select('count').limit(1)
      if (testError) {
        console.error('Supabase connection test failed:', testError)
        throw new Error('Database connection failed')
      }
      
      // Now fetch the events data
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          club:clubs (
            id,
            name,
            logo_url
          )
        `)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
      if (eventsError) throw eventsError

      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .select('event_id')
        .eq('user_id', userId)
      if (regError) throw regError

      const registeredEventIds = new Set((regData || []).map(r => r.event_id))

      console.log('Events data:', eventsData) // Debug log
      
      setEvents((eventsData || []).map((event: any) => {
        // Debug log for each event
        console.log('Processing event:', event)
        
        return {
          id: event.id,
          clubId: event.club_id,
          title: event.title,
          description: event.description || '',
          eventType: event.event_type || '',
          venue: event.venue || '',
          startDate: event.start_date,
          endDate: event.end_date || null,
          registrationDeadline: event.registration_deadline || null,
          maxParticipants: event.max_participants || 0,
          currentParticipants: event.current_participants || 0,
          status: event.status || 'pending_approval',
          budgetRequested: event.budget_requested || 0,
          budgetApproved: event.budget_approved || 0,
          approvalNotes: event.approval_notes || '',
          createdAt: event.created_at || '',
          updatedAt: event.updated_at || '',
          registrationStatus: registeredEventIds.has(event.id) ? 'registered' : 'not_registered',
          posterUrl: event.poster_url || null,
          club: event.club ? {
            id: event.club.id,
            name: event.club.name || "Unknown Club",
            slug: event.club.slug || '',
            category: event.club.category || '',
            description: event.club.description || '',
            email: event.club.email || '',
            facultyAdvisor: event.club.faculty_advisor || '',
            isActive: event.club.is_active ?? true,
            memberCount: event.club.member_count || 0,
            rating: event.club.rating || 0,
            totalEvents: event.club.total_events || 0,
            createdAt: event.club.created_at || '',
            updatedAt: event.club.updated_at || '',
            tags: event.club.tags ? (typeof event.club.tags === 'string' ? event.club.tags.split(',') : event.club.tags) : [],
            logoUrl: event.club.logo_url || null
          } : undefined
        }
      }))
    } catch (error: any) {
      console.error('Error loading events:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load upcoming events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEventAction = async (eventId: number, action: "register" | "unregister") => {
    try {
      if (!userId) return
      if (action === "register") {

        const userData = localStorage.getItem('user-data')
        let parsed: any = {}
        if (userData) {
          try { parsed = JSON.parse(userData) } catch {}
        }
        setForm({
          studentName: parsed?.fullName ?? '',
          registrationNumber: parsed?.registrationNumber ?? '',
          email: parsed?.email ?? '',
          phone: parsed?.phone ?? '',
          department: parsed?.department ?? '',
          yearOfStudy: parsed?.yearOfStudy ? String(parsed.yearOfStudy) : '',
          dietaryRestrictions: '',
          specialRequirements: '',
        })
        setRegisteringEvent(events.find(e => e.id === eventId))
        return
      } else {
  
        const { error } = await supabase.from('registrations').delete().eq('event_id', eventId).eq('user_id', userId)
        if (error) throw error
        toast({
          title: "Unregistered",
          description: "You have been unregistered from the event.",
        })
      }
  
      loadUpcomingEvents()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = async () => {
    if (!registeringEvent || !userId) return
    setFormLoading(true)
    try {
      const { error } = await supabase.from('registrations').insert({
        event_id: registeringEvent.id,
        user_id: userId,
        student_name: form.studentName,
        registration_number: form.registrationNumber,
        email: form.email,
        phone: form.phone,
        department: form.department,
        year_of_study: form.yearOfStudy ? parseInt(form.yearOfStudy) : null,
        dietary_restrictions: form.dietaryRestrictions,
        special_requirements: form.specialRequirements,
      })
      if (error) throw error
      toast({ title: 'Registered!', description: 'You have successfully registered for the event.' })
      setRegisteringEvent(null)
      setFormLoading(false)
      loadUpcomingEvents()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to register. Please try again.', variant: 'destructive' })
      setFormLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      !search ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.club?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (event.venue || '').toLowerCase().includes(search.toLowerCase()) ||
      (event.description || '').toLowerCase().includes(search.toLowerCase())
    const eventTags = Array.isArray((event as any).tags)
      ? (event as any).tags
      : typeof (event as any).tags === 'string'
        ? (event as any).tags.split(',').map((t: string) => t.trim())
        : [];
    const matchesCategory =
      category === 'All' ||
      (event.eventType && event.eventType.toLowerCase() === category.toLowerCase()) ||
      eventTags.some((tag: string) => tag.toLowerCase() === category.toLowerCase())
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading events...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-4">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">No upcoming events</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border-l-4 border-emerald-500 pl-4 py-3 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 rounded-r-lg"
              >
                <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                <p className="text-xs text-gray-500 mb-2">{event.club?.name || "Club Name"}</p>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(event.startDate)}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.venue}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Users className="w-3 h-3 mr-1" />
                    {event.currentParticipants} registered
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      event.registrationStatus === "registered"
                        ? "default"
                        : event.registrationStatus === "interested"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {event.registrationStatus === "registered"
                      ? "Registered"
                      : event.registrationStatus === "interested"
                        ? "Interested"
                        : "Available"}
                  </Badge>

                  {event.registrationStatus === "registered" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6"
                      onClick={() => handleEventAction(event.id, "unregister")}
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="text-xs h-6 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                      onClick={() => handleEventAction(event.id, "register")}
                    >
                      Register
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Registration Form Dialog */}
      <Dialog open={!!registeringEvent} onOpenChange={v => { if (!v) setRegisteringEvent(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {registeringEvent?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleFormSubmit() }} className="space-y-3">
            <Input
              placeholder="Full Name"
              value={form.studentName}
              onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
              required
            />
            <Input
              placeholder="Registration Number"
              value={form.registrationNumber}
              onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              required
            />
            <Input
              placeholder="Department"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              required
            />
            <Input
              placeholder="Year of Study"
              type="number"
              min={1}
              max={5}
              value={form.yearOfStudy}
              onChange={e => setForm(f => ({ ...f, yearOfStudy: e.target.value }))}
              required
            />
            <Input
              placeholder="Dietary Restrictions (optional)"
              value={form.dietaryRestrictions}
              onChange={e => setForm(f => ({ ...f, dietaryRestrictions: e.target.value }))}
            />
            <Input
              placeholder="Special Requirements (optional)"
              value={form.specialRequirements}
              onChange={e => setForm(f => ({ ...f, specialRequirements: e.target.value }))}
            />
            <DialogFooter>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Registering...' : 'Submit & Register'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
