import { supabase } from './supabase'
import { randomUUID } from 'crypto'

export interface EmailConfirmationData {
  registrationNumber: string
  email: string
  confirmationUrl: string
  studentName: string
}

export class EmailService {
  static async sendConfirmationEmail(data: EmailConfirmationData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Attempting to send confirmation email to:', data.email)
      console.log('📧 Email data:', data)

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: data.confirmationUrl
      })
      
      if (resetError) {
        console.error('❌ Password reset error:', resetError)
      
        console.log('🔄 Trying to create new user for email confirmation...')
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: randomUUID(),
          options: {
            data: {
              registration_number: data.registrationNumber,
              student_name: data.studentName,
              confirmation_url: data.confirmationUrl,
              full_name: data.studentName
            },
            emailRedirectTo: data.confirmationUrl
          }
        })

        if (signUpError) {
          console.error('❌ Signup error:', signUpError)
          return { success: false, error: signUpError.message }
        }

        console.log('✅ New user confirmation email sent to:', data.email)
        console.log('📧 Check your email inbox for the confirmation link')
        console.log('🔗 Confirmation URL:', data.confirmationUrl)
        return { success: true }
      }
      
      console.log('✅ Password reset email sent to:', data.email)
      console.log('📧 Check your email inbox for the confirmation link')
      console.log('🔗 Confirmation URL:', data.confirmationUrl)
      return { success: true }
      
    } catch (error) {
      console.error('❌ Email service error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      }
    }
  }

  static async sendCustomEmail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string }> {
    try {

      
      console.log('📧 Sending custom email to:', to)
      console.log('📝 Subject:', subject)
      console.log('📄 Content length:', htmlContent.length, 'characters')

      const { error } = await supabase.auth.resetPasswordForEmail(to, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-app.vercel.app'}/dashboard/student`
      })
      
      if (error) {
        console.error('❌ Custom email error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Custom email sent successfully')
      return { success: true }
    } catch (error) {
      console.error('❌ Custom email error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      }
    }
  }

  static generateConfirmationEmailHTML(data: EmailConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Email - NexusSync</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to NexusSync!</h1>
            <p>MIT Manipal Club Management Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${data.studentName},</h2>
            <p>Thank you for logging into NexusSync! To access your student dashboard, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${data.confirmationUrl}" class="button">Confirm Email & Access Dashboard</a>
            </div>
            
            <p><strong>Registration Number:</strong> ${data.registrationNumber}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            
            <p>This confirmation link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't request this login, please ignore this email.</p>
            
            <p>Best regards,<br>The NexusSync Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email from NexusSync. Please do not reply to this email.</p>
            <p>&copy; 2024 MIT Manipal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
} 