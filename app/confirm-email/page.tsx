"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import FallingLeaves from '@/components/ui/FallingLeaves'
import { verifyConfirmationToken } from '@/lib/email-confirmation'
import { supabase } from '@/lib/supabase'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const type = searchParams.get('type')
  const { toast } = useToast()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
 
    if (type === 'signup' || type === 'recovery') {
      handleSupabaseAuthConfirmation()
    } else if (token) {

      verifyConfirmation()
    } else {
      setStatus('error')
      setMessage('No confirmation token provided')
    }
  }, [token, type])

  const handleSupabaseAuthConfirmation = async () => {
    try {

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        setStatus('error')
        setMessage('Failed to verify email confirmation')
        return
      }

      if (session?.user) {
 
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (user && !userError) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to dashboard...')
          setUserData({
            id: user.id,
            registrationNumber: user.registration_number,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            department: user.department,
            yearOfStudy: user.year_of_study,
            profileImageUrl: user.profile_image_url
          })
          
 
          localStorage.setItem('user-data', JSON.stringify(user))
          
 
          toast({
            title: "Email Confirmed!",
            description: "Welcome to NexusSync! Redirecting to your dashboard...",
          })

      
          setTimeout(() => {
            router.push('/dashboard/student')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('User profile not found')
        }
      } else {
        setStatus('error')
        setMessage('Email confirmation failed. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while confirming your email')
      
      toast({
        title: "Error",
        description: "An error occurred while confirming your email",
        variant: "destructive",
      })
    }
  }

  const verifyConfirmation = async () => {
    try {
      const result = await verifyConfirmationToken(token!)

      if (result.success && result.user) {
        setStatus('success')
        setMessage('Email confirmed successfully! Redirecting to dashboard...')
        setUserData(result.user)
        
   
        localStorage.setItem('user-data', JSON.stringify(result.user))
        if (result.sessionToken) {
          localStorage.setItem('session-token', result.sessionToken)
        }
        
 
        toast({
          title: "Email Confirmed!",
          description: "Welcome to NexusSync! Redirecting to your dashboard...",
        })

   
        setTimeout(() => {
          router.push('/dashboard/student')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Failed to confirm email')
        
        toast({
          title: "Confirmation Failed",
          description: result.error || 'Failed to confirm email',
          variant: "destructive",
        })
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while confirming your email')
      
      toast({
        title: "Error",
        description: "An error occurred while confirming your email",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500" style={{position: 'relative'}}>
      <FallingLeaves />
      <Card className="animate-fade-in-up max-w-md w-full rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-900/80 backdrop-blur-xl border-0 p-8">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <img
              src="/title.png"
              alt="NexusSync Logo"
              className="w-full max-w-[85%] h-auto object-contain mx-auto"
              style={{ display: 'block' }}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Confirmation
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Verifying your email address
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            
            <div className={`text-center ${getStatusColor()}`}>
              <h3 className="text-lg font-semibold mb-2">
                {status === 'loading' && 'Verifying Email...'}
                {status === 'success' && 'Email Confirmed!'}
                {status === 'error' && 'Confirmation Failed'}
              </h3>
              <p className="text-sm">{message}</p>
            </div>

            {status === 'success' && userData && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Welcome back, {userData.fullName}! You'll be redirected to your dashboard shortly.
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {message}
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl"
                >
                  Return to Login
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 