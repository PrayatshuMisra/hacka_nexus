import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ppfwrsfkcrqtwnxzylon.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZndyc2ZrY3JxdHdueHp5bG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTY0OTcsImV4cCI6MjA3ODA5MjQ5N30.YeMKZcMcWvOEt-OEHeUCMRR2l76_KsSO5bt1czoLavk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection and fetch events
async function testEvents() {
  console.log('Testing Supabase connection...')
  
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('count')
    
    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('Connected successfully!')
    console.log('Events count:', events)

    // Insert a test event if no events exist
    if (events[0].count === 0) {
      console.log('No events found, inserting test event...')
      
      // First create a test club if needed
      const { data: clubs, error: clubError } = await supabase
        .from('clubs')
        .select('id')
        .limit(1)
      
      if (clubError) {
        console.error('Error checking clubs:', clubError)
        return
      }

      let clubId
      if (!clubs || clubs.length === 0) {
        const { data: newClub, error: createClubError } = await supabase
          .from('clubs')
          .insert({
            name: 'Test Club',
            slug: 'test-club',
            category: 'Technical',
            description: 'A test club',
            email: 'test@club.com',
            faculty_advisor: 'Dr. Test',
            is_active: true,
            member_count: 0,
            rating: 4.5,
            total_events: 0
          })
          .select()
          .single()

        if (createClubError) {
          console.error('Error creating club:', createClubError)
          return
        }
        clubId = newClub.id
      } else {
        clubId = clubs[0].id
      }

      // Insert test event
      const { data: newEvent, error: createEventError } = await supabase
        .from('events')
        .insert({
          club_id: clubId,
          title: 'Test Event',
          description: 'A test event description',
          event_type: 'Workshop',
          venue: 'Main Hall',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
          max_participants: 100,
          current_participants: 0,
          status: 'approved'
        })
        .select()

      if (createEventError) {
        console.error('Error creating event:', createEventError)
      } else {
        console.log('Test event created:', newEvent)
      }
    }

    // Fetch all events to verify
    const { data: allEvents, error: fetchError } = await supabase
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

    if (fetchError) {
      console.error('Error fetching events:', fetchError)
    } else {
      console.log('All upcoming events:', allEvents)
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testEvents()