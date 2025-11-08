import { supabase } from './supabase'
import { EmailService } from './email-service'
import { randomUUID } from 'crypto'

export interface EmailConfirmationData {
  registrationNumber: string
  email: string
  confirmationUrl: string
  studentName: string
}

export interface ConfirmationResponse {
  success: boolean
  message?: string
  email?: string
  error?: string
}

export interface VerificationResponse {
  success: boolean
  user?: any
  sessionToken?: string
  error?: string
}

// Helper function to get the correct base URL
function getBaseUrl(): string {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_BASE_URL || 
         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
         'http://localhost:3000'
}

export async function sendConfirmationEmail(identifier: string): Promise<ConfirmationResponse> {
  try {
    console.log('🔍 sendConfirmationEmail called with identifier:', identifier)
    const isEmail = identifier.includes('@')
    
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
    
    if (isEmail) {
      query = query.eq('email', identifier)
    } else {
      query = query.eq('registration_number', identifier)
    }
    
    const { data: student, error: studentError } = await query.single()

    if (studentError || !student) {
      console.log('❌ Student not found:', studentError)
      return {
        success: false,
        error: isEmail ? 'Student not found with this email address' : 'Student not found with this registration number'
      }
    }

    console.log('✅ Student found:', student)

    // For Supabase Auth email confirmation, we don't need custom tokens
    // Supabase will handle the email confirmation automatically
    // We just need to ensure the user exists in our database
    
    // Update user status to indicate email confirmation is pending
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        status: 'pending_confirmation',
        updated_at: new Date().toISOString()
      })
      .eq('id', student.id)

    if (updateError) {
      console.error('Error updating user status:', updateError)
    }

    // Trigger Supabase Auth email confirmation
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: student.email,
      options: {
        emailRedirectTo: `${getBaseUrl()}/confirm-email?type=signup`
      }
    })

    if (authError) {
      console.error('Supabase Auth error:', authError)
      return {
        success: false,
        error: 'Failed to send confirmation email'
      }
    }

    console.log('✅ Confirmation email sent successfully')
    return {
      success: true,
      message: `Confirmation email sent to ${student.email}`,
      email: student.email
    }

  } catch (error) {
    console.error('❌ Error in sendConfirmationEmail:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

export async function verifyConfirmationToken(token: string): Promise<VerificationResponse> {
  try {
    console.log('🔍 verifyConfirmationToken called with token:', token)
    
    const { data: confirmationData, error: tokenError } = await supabase
      .from('confirmation_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (tokenError || !confirmationData) {
      console.log('❌ Invalid or expired token:', tokenError)
      return {
        success: false,
        error: 'Invalid or expired confirmation token'
      }
    }

    if (new Date(confirmationData.expires_at) < new Date()) {
      console.log('❌ Token expired')
      return {
        success: false,
        error: 'Confirmation token has expired'
      }
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', confirmationData.user_id)
      .single()

    if (userError || !user) {
      console.log('❌ User not found:', userError)
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Mark token as used
    await supabase
      .from('confirmation_tokens')
      .update({ used: true })
      .eq('token', token)

    // Update user status to confirmed
    await supabase
      .from('users')
      .update({ 
        status: 'active',
        email_confirmed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    const sessionToken = randomUUID()
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await supabase
      .from('user_sessions')
      .insert({
        token: sessionToken,
        user_id: user.id,
        expires_at: sessionExpiresAt.toISOString()
      })

    console.log('✅ Token verified successfully for user:', user.id)
    return {
      success: true,
      user: {
        id: user.id,
        registrationNumber: user.registration_number,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        department: user.department,
        yearOfStudy: user.year_of_study,
        profileImageUrl: user.profile_image_url
      },
      sessionToken
    }

  } catch (error) {
    console.error('❌ Error in verifyConfirmationToken:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

export async function checkStudentExists(registrationNumber: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('registration_number', registrationNumber)
      .eq('role', 'student')
      .single()

    return !error && !!data
  } catch (error) {
    return false
  }
} 