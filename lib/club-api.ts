import { supabase } from "./supabase"

export const clubMembershipsAPI = {
  joinClub: async (clubId: number, userId: number) => {
    try {
      // Check if already a member
      const { data: existingMember } = await supabase
        .from('club_members')
        .select('id')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .single()

      if (existingMember) {
        throw new Error('Already a member of this club')
      }

      // Add as a new member
      const { error } = await supabase
        .from('club_members')
        .insert({
          club_id: clubId,
          user_id: userId,
          role_in_club: 'member',
          joined_at: new Date().toISOString()
        })

      if (error) throw error

      // Update the club's member count
      const { error: updateError } = await supabase
        .from('clubs')
        .update({ member_count: (supabase as any).raw('member_count + 1') })
        .eq('id', clubId)

      if (updateError) throw updateError

      return true
    } catch (error: any) {
      console.error('Error joining club:', error)
      throw error
    }
  },

  applyToClub: async (clubId: number, userId: number, applicationData: { name: string, why: string }) => {
    try {
      const { error } = await supabase
        .from('club_applications')
        .insert({
          club_id: clubId,
          user_id: userId,
          position: 'member',
          application_text: applicationData.why,
          status: 'pending',
          applied_date: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (error: any) {
      console.error('Error applying to club:', error)
      throw error
    }
  },

  // Check if user is a member of a club
  isMember: async (clubId: number, userId: number) => {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select('id')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return false
        }
        throw error
      }

      return !!data
    } catch (error) {
      console.error('Error checking membership:', error)
      return false
    }
  }
}