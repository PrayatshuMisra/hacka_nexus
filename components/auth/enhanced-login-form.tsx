"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Building, Shield, Loader2, AlertCircle, Eye, EyeOff, UserPlus, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AnimatedBackground } from "@/components/ui/animated-background"
import FallingLeaves from "@/components/ui/FallingLeaves"
import { supabase } from "@/lib/supabase"
import { sendConfirmationEmail } from "@/lib/email-confirmation"
import { loginStudentDirectly, authenticate } from "@/lib/auth"

interface EnhancedLoginFormProps {
  onLogin: (role: string, user: any) => void
  onSignupClick: () => void
}

export function EnhancedLoginForm({ onLogin, onSignupClick }: EnhancedLoginFormProps) {
  const [userRole, setUserRole] = useState<"student" | "club_member" | "admin">("student")
  const [loading, setLoading] = useState(false)
  const [processingLogin, setProcessingLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    registrationNumber: "",
    email: "",
    password: "",
    adminId: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
    if (field === "registrationNumber" && emailSent) {
      setEmailSent(false) // Reset email sent status when registration number changes
    }
  }

  const handleStudentLogin = async () => {
    if (!formData.registrationNumber && !formData.email) {
      setError("Please enter your registration number or email")
      return
    }

    setProcessingLogin(true)
    setError("")

    try {
      const identifier = formData.registrationNumber || formData.email!
      console.log('🔍 Starting student login with identifier:', identifier)
      
      const directLoginResult = await loginStudentDirectly(identifier)
      console.log('🔍 Direct login result:', directLoginResult)
      
      if (directLoginResult.success && directLoginResult.user) {
        // Student exists and can login directly
        console.log('✅ Login successful, user data:', directLoginResult.user)
        localStorage.setItem("user-data", JSON.stringify(directLoginResult.user))
        
        onLogin(directLoginResult.user.role, {
          ...directLoginResult.user,
          fullName: directLoginResult.user.fullName,
          email: directLoginResult.user.email,
          profileImageUrl: directLoginResult.user.profileImageUrl
        })
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${directLoginResult.user.fullName}!`,
        })
        
        return
      }
      
      if (directLoginResult.requiresConfirmation) {
        console.log('⚠️ User requires email confirmation')
        const result = await sendConfirmationEmail(identifier)

        if (result.success) {
          setEmailSent(true)
          toast({
            title: "Email Sent!",
            description: `Confirmation email has been sent to ${result.email}`,
          })
        } else {
          setError(result.error || 'Failed to send confirmation email')
          toast({
            title: "Email Failed",
            description: result.error || 'Failed to send confirmation email',
            variant: "destructive",
          })
        }
        return
      }

      console.log('❌ Login failed:', directLoginResult.error)
      setError(directLoginResult.error || 'Student not found')
      toast({
        title: "Login Failed",
        description: directLoginResult.error || 'Student not found',
        variant: "destructive",
      })
      
    } catch (error) {
      console.error('❌ Login error:', error)
      const errorMessage = "Failed to process login. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setProcessingLogin(false)
    }
  }

  const validateForm = (): boolean => {
    if (userRole === "student") {
      if (!formData.registrationNumber && !formData.email) {
        setError("Please enter your registration number or email")
        return false
      }
    } else if (userRole === "club_member") {
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password")
        return false
      }
    } else if (userRole === "admin") {
      if (!formData.adminId || !formData.password) {
        setError("Please enter both admin ID and password")
        return false
      }
    }
    return true
  }

  const handleLogin = async () => {
    if (userRole === "student") {
      await handleStudentLogin()
      return
    }

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
        const credentials = {
        role: userRole,
        email: formData.email || '',
        password: formData.password || '',
        ...(userRole === 'admin' && { adminId: formData.adminId }),
          ...((userRole as any) === 'student' && { registrationNumber: formData.registrationNumber })
      }

      console.log('Login attempt with credentials:', credentials);
      const result = await authenticate(credentials as any);
      console.log('Authentication result:', result);

      if (result.success && result.user) {
        localStorage.setItem("user-data", JSON.stringify(result.user))
        localStorage.setItem("auth-token", result.token || '')
        
        onLogin(result.user.role, {
          ...result.user,
          fullName: result.user.fullName,
          email: result.user.email,
          profileImageUrl: result.user.profileImageUrl
        })
      } else {
        setError(result.error || 'Invalid credentials. Please try again.')
        toast({
          title: "Login Failed",
          description: result.error || 'Invalid credentials. Please try again.',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = "Something went wrong. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500" style={{position: 'relative'}}>
      <FallingLeaves />
      <Card className="login-card animate-fade-in-up max-w-md w-full rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-900/80 backdrop-blur-xl border-0 p-8">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <img
              src="/title.png"
              alt="NexusSync Logo"
              className="w-full max-w-[85%] h-auto object-contain mx-auto"
              style={{ display: 'block' }}
            />
          </div>
          <CardDescription
            className="text-2xl font-extrabold text-black dark:text-white drop-shadow-lg tracking-tight mt-4 mb-2"
          >
            MIT Manipal Club Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 animate-fade-in-up bg-gradient-to-r from-pink-100 via-red-100 to-pink-50 dark:from-red-900 dark:via-pink-900 dark:to-red-800 border-l-8 border-red-500 shadow-xl rounded-xl flex items-center gap-4 p-4">
              <AlertCircle className="h-7 w-7 text-red-500" />
              <AlertDescription className="font-semibold text-red-900 dark:text-red-100 text-base">{error}</AlertDescription>
            </Alert>
          )}

          {emailSent && (
            <Alert className="mb-6 animate-fade-in-up bg-gradient-to-r from-green-100 via-emerald-100 to-green-50 dark:from-green-900 dark:via-emerald-900 dark:to-green-800 border-l-8 border-green-500 shadow-xl rounded-xl flex items-center gap-4 p-4">
              <Mail className="h-7 w-7 text-green-500" />
              <AlertDescription className="font-semibold text-green-900 dark:text-green-100 text-base">
                Confirmation email sent! Please check your inbox and click the link to complete your registration and access your dashboard.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={userRole} onValueChange={(value) => setUserRole(value as any)} className="w-full">
            <TabsList className="admin-tabs-list grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 rounded-xl p-1 shadow-md">
              <TabsTrigger value="student" className="admin-tabs-trigger text-sm font-semibold text-white data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:rounded-xl rounded-lg transition-all duration-200 hover:bg-white/30 focus:ring-2 focus:ring-green-300">
                <User className="w-5 h-5 mr-1" />
                Student
              </TabsTrigger>
              <TabsTrigger value="club_member" className="admin-tabs-trigger text-sm font-semibold text-white data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:rounded-xl rounded-lg transition-all duration-200 hover:bg-white/30 focus:ring-2 focus:ring-green-300">
                <Building className="w-5 h-5 mr-1" />
                Club
              </TabsTrigger>
              <TabsTrigger value="admin" className="admin-tabs-trigger text-sm font-semibold text-white data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-lg data-[state=active]:rounded-xl rounded-lg transition-all duration-200 hover:bg-white/30 focus:ring-2 focus:ring-green-300">
                <Shield className="w-5 h-5 mr-1" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-6 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-green-900 dark:text-green-200">Student Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@learner.manipal.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`signup-input h-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.email ? 'border-green-500' : ''}`}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter your registered email address to sign in
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  onClick={handleLogin}
                  disabled={loading || processingLogin}
                >
                  {loading || processingLogin ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {processingLogin ? "Processing..." : "Signing In..."}
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demo email: <span className="font-mono text-green-600 dark:text-green-400">prayatshu.mitmpl2024@learner.manipal.edu</span>
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="club_member" className="space-y-6 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="club-email" className="text-sm font-medium text-green-900 dark:text-green-200">Club Email</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="club-email"
                    type="email"
                    placeholder="gdsc@manipal.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`signup-input h-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.email ? 'border-green-500' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-password" className="text-sm font-medium text-green-900 dark:text-green-200">Password</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="club-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`signup-input h-12 pl-10 pr-12 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.password ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-green-400 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/50 font-medium rounded-xl transition-all duration-300"
                  onClick={() => {
                    handleInputChange("email", "demo.club@nexussync.com");
                    handleInputChange("password", "demoClub123");
                    handleLogin();
                  }}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Demo Club Login
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="admin-id" className="text-sm font-medium text-green-900 dark:text-green-200">Admin ID</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="admin-id"
                    placeholder="e.g., swo"
                    value={formData.adminId}
                    onChange={(e) => handleInputChange("adminId", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`signup-input h-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.adminId ? 'border-green-500' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium text-green-900 dark:text-green-200">Password</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`signup-input h-12 pl-10 pr-12 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.password ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Login as Admin
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-green-400 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/50 font-medium rounded-xl transition-all duration-300"
                  onClick={() => {
                    handleInputChange("email", "demo.admin@nexussync.com");
                    handleInputChange("password", "demoAdmin123");
                    handleInputChange("adminId", "demoAdmin");
                    handleLogin();
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Demo Admin Login
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">Don't have an account?</p>
            <Button variant="outline" onClick={onSignupClick} className="w-full text-green-700 font-semibold rounded-xl border-green-300 bg-white/70 hover:bg-green-100 hover:border-green-500 shadow transition-all duration-200 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Create New Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}