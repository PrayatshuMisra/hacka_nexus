"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Building,
  Shield,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AnimatedBackground } from "@/components/ui/animated-background"
import {
  checkPasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
  type PasswordStrength,
} from "@/lib/password-strength"
import { createAccount, checkExistence, type SignupData } from "@/lib/signup-api"
import FallingLeaves from "@/components/ui/FallingLeaves"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"

interface SignupFormProps {
  onSignupSuccess: (role: string, user: any) => void
  onBackToLogin: () => void
}

export function SignupForm({ onSignupSuccess, onBackToLogin }: SignupFormProps) {
  const [userRole, setUserRole] = useState<"student" | "club_member" | "admin">("student")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isStrong: false,
  })
  const [fieldValidation, setFieldValidation] = useState<{ [key: string]: { isValid: boolean; message: string } }>({})

  const [formData, setFormData] = useState<SignupData>({
    role: "student",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
    department: "",
    yearOfStudy: 1,
    interests: [],
    clubName: "",
    description: "",
    category: "",
    facultyAdvisor: "",
    adminId: "",
  })

  const { toast } = useToast()

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotechnology",
    "Aeronautical",
    "Automobile",
  ]

  const clubCategories = ["Technical", "Cultural", "Sports", "Literary", "Social Service", "Arts", "Music", "Dance"]

  const interestOptions = [
    "AI/ML",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "IoT",
    "Robotics",
    "Game Development",
  ]

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value, role: userRole }))
    if (error) setError("")

    if (fieldValidation[field]) {
      setFieldValidation((prev) => ({ ...prev, [field]: { isValid: true, message: "" } }))
    }
  }

  useEffect(() => {
    if (formData.password) {
      const strength = checkPasswordStrength(formData.password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [], isStrong: false })
    }
  }, [formData.password])

  useEffect(() => {
    const validateField = async (field: string, value: string) => {
      if (!value) return

      try {
        const exists = await checkExistence(field, value)
        setFieldValidation((prev) => ({
          ...prev,
          [field]: {
            isValid: !exists,
            message: exists ? `This ${field} is already registered` : "",
          },
        }))
      } catch (error) {
        console.error("Validation error:", error)
      }
    }

    const timeouts: { [key: string]: NodeJS.Timeout } = {}


    if (formData.email) {
      timeouts.email = setTimeout(() => validateField("email", formData.email), 500)
    }

    if (userRole === "student" && formData.registrationNumber) {
      timeouts.registrationNumber = setTimeout(
        () => validateField("registrationNumber", formData.registrationNumber!),
        500,
      )
    }

    if (userRole === "admin" && formData.adminId) {
      timeouts.adminId = setTimeout(() => validateField("adminId", formData.adminId!), 500)
    }

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [formData.email, formData.registrationNumber, formData.adminId, userRole])

  const validateForm = (): boolean => {
 
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      return false
    }

    if (!passwordStrength.isStrong) {
      setError("Please create a stronger password")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (userRole === "student" && !formData.registrationNumber) {
      setError("Registration number is required for students")
      return false
    }

    if (userRole === "club_member" && (!formData.clubName || !formData.category)) {
      setError("Club name and category are required")
      return false
    }

    if (userRole === "admin" && !formData.adminId) {
      setError("Admin ID is required")
      return false
    }

    const hasInvalidFields = Object.values(fieldValidation).some((validation) => !validation.isValid)
    if (hasInvalidFields) {
      setError("Please fix the validation errors")
      return false
    }

    return true
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      if (userRole === "club_member") {

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + "/" : "/"
          }
        })
        if (authError) {
          setError(authError.message)
          toast({
            title: "Signup Failed",
            description: authError.message,
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        const { data: existingClub, error: clubCheckError } = await supabase
          .from("clubs")
          .select("id")
          .eq("name", formData.clubName)
          .maybeSingle()
        let clubId = null
        if (!existingClub) {
          const { data: club, error: clubError } = await supabase
            .from("clubs")
            .insert([{
              name: formData.clubName,
              slug: generateSlug(formData.clubName || ""),
              category: formData.category,
              description: formData.description,
              email: formData.email,
              faculty_advisor: formData.facultyAdvisor || null,
              contact_person_id: null, 
              is_active: true,
              recruitment_status: "open"
            }])
            .select()
            .single()
          if (clubError) {
            setError(clubError.message)
            toast({
              title: "Signup Failed",
              description: clubError.message,
              variant: "destructive",
            })
            setLoading(false)
            return
          }
          clubId = club.id
        } else {
          clubId = existingClub.id
        }
  
        const userProfile = {
          full_name: formData.fullName,
          email: formData.email,
          role: userRole,
          registration_number: null,
          department: null,
          year_of_study: null,
          interests: null,
        }
        const { data: userInsert, error: userInsertError } = await supabase
          .from("users")
          .insert([userProfile])
          .select()
          .single()
        if (userInsertError) {
          setError(userInsertError.message)
          toast({
            title: "Signup Failed",
            description: userInsertError.message,
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        await supabase
          .from("clubs")
          .update({ contact_person_id: userInsert.id })
          .eq("id", clubId)

        toast({
          title: "Confirm your email",
          description: `A confirmation link has been sent to ${formData.email}. Please check your inbox and verify your email before logging in as a club.`,
          variant: "success",
        })
        setTimeout(() => onBackToLogin(), 1000)
        setLoading(false)
        return
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + "/" : "/"
        }
      })
      if (authError) {
        setError(authError.message)
        toast({
          title: "Signup Failed",
          description: authError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // First, get the newly created user's ID from the auth response
      if (!authData.user) {
        throw new Error('User creation failed')
      }

      const userProfile = {
        id: authData.user.id,
        full_name: formData.fullName,
        email: formData.email,
        role: userRole,
        registration_number: formData.registrationNumber || null,
        department: formData.department || null,
        year_of_study: formData.yearOfStudy || null,
        interests: (formData.interests || []).join(","),
        password_hash: formData.password, // This will be hashed by Supabase's trigger
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Insert the user profile with the same ID as the auth user
      const { data: userInsert, error: userInsertError } = await supabase
        .from("users")
        .insert([userProfile])
        .select()
        .single()
      if (userInsertError) {
        setError(userInsertError.message)
        toast({
          title: "Signup Failed",
          description: userInsertError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (userRole === "admin") {
        const { error: adminInsertError } = await supabase
          .from("admins")
          .insert([{
            user_id: userInsert.id,
            admin_id: formData.adminId,
            department: formData.department || null,
            permissions: null
          }])
        
        if (adminInsertError) {
          setError(adminInsertError.message)
          toast({
            title: "Signup Failed",
            description: adminInsertError.message,
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      toast({
        title: "Confirm your email",
        description: `A confirmation link has been sent to ${formData.email}. Please check your inbox and verify your email before logging in.`,
        variant: "success",
      })
      setTimeout(() => onBackToLogin(), 1000)
    } catch (error) {
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

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests || []
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest]

    handleInputChange("interests", newInterests)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500" style={{position: 'relative'}}>
      <FallingLeaves />
      <Card className="signup-card animate-fade-in-up max-w-md w-full rounded-3xl shadow-2xl bg-white/60 dark:bg-gray-900/80 backdrop-blur-xl border-0 p-8">
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
          <Button
            variant="ghost"
            onClick={onBackToLogin}
            className="mb-6 text-green-700 font-semibold rounded-xl border-green-300 bg-white/70 hover:bg-green-100 hover:border-green-500 shadow transition-all duration-200 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6 animate-fade-in-up bg-gradient-to-r from-pink-100 via-red-100 to-pink-50 dark:from-red-900 dark:via-pink-900 dark:to-red-800 border-l-8 border-red-500 shadow-xl rounded-xl flex items-center gap-4 p-4">
              <AlertCircle className="h-7 w-7 text-red-500" />
              <AlertDescription className="font-semibold text-red-900 dark:text-red-100 text-base">{error}</AlertDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name" className="text-sm font-medium text-green-900 dark:text-green-200">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                    <Input
                      id="student-name"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`signup-input pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.fullName ? 'border-green-500' : ''}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-number" className="text-sm font-medium text-green-900 dark:text-green-200">Registration Number *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                    <Input
                      id="reg-number"
                      placeholder="220701001"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                      className={`signup-input pr-10 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.registrationNumber ? 'border-green-500' : ''}`}
                    />
                  </div>
                  {fieldValidation.registrationNumber && !fieldValidation.registrationNumber.isValid && (
                    <p className="text-xs text-red-500">{fieldValidation.registrationNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email" className="text-sm font-medium text-green-900 dark:text-green-200">Email Address *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="john.doe@learner.manipal.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`signup-input pr-10 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.email ? 'border-green-500' : ''}`}
                  />
                </div>
                {fieldValidation.email && !fieldValidation.email.isValid && (
                  <p className="text-xs text-red-500">{fieldValidation.email.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-green-900 dark:text-green-200">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger className="signup-input pl-4 rounded-xl border transition-colors duration-200 focus:border-green-500 bg-white/80 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-green-900 dark:text-green-200">Year of Study</Label>
                  <Select
                    value={formData.yearOfStudy?.toString()}
                    onValueChange={(value) => handleInputChange("yearOfStudy", Number.parseInt(value))}
                  >
                    <SelectTrigger className="signup-input pl-4 rounded-xl border transition-colors duration-200 focus:border-green-500 bg-white/80 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">1st Year</SelectItem>
                      <SelectItem value="2" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">2nd Year</SelectItem>
                      <SelectItem value="3" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">3rd Year</SelectItem>
                      <SelectItem value="4" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-900 dark:text-green-200">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interests?.includes(interest) ? "default" : "outline"}
                      className={
                        `cursor-pointer transition-all duration-200 px-4 py-2 text-base rounded-full select-none
                        ${formData.interests?.includes(interest)
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105 border-0 hover:from-green-500 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-700 dark:text-white"
                          : "bg-white/70 text-green-700 border-green-300 hover:bg-green-100 hover:text-green-900 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"}
                        `
                      }
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password" className="text-sm font-medium text-green-900 dark:text-green-200">Password *</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="student-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`signup-input w-full pr-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.password ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.password && (
                  <div>
                    <div className="password-strength-bar">
                      <div
                        className={`password-strength-fill ${getPasswordStrengthColor(passwordStrength.score)}`}
                      />
                    </div>
                    <p className="text-xs mt-1">{getPasswordStrengthText(passwordStrength.score)}</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        {formData.password.length >= 8 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one uppercase letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[a-z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one lowercase letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/\d/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one number</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one special character (!@#$%^&*)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2 mt-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-green-900 dark:text-green-200">Confirm Password *</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`signup-input w-full pr-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.confirmPassword ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <Button
                className="signup-button w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up dark:from-green-700 dark:to-emerald-800 dark:text-white dark:shadow-green-900"
                onClick={handleSignup}
                disabled={loading || !passwordStrength.isStrong}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Create Student Account
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="club_member" className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="club-name" className="text-sm font-medium text-green-900 dark:text-green-200">Club Name *</Label>
                  <Input
                    id="club-name"
                    placeholder="GDSC MIT Manipal"
                    value={formData.clubName}
                    onChange={(e) => handleInputChange("clubName", e.target.value)}
                    className={`signup-input pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.clubName ? 'border-green-500' : ''}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club-category" className="text-sm font-medium text-green-900 dark:text-green-200">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="signup-input pl-4 rounded-xl border transition-colors duration-200 focus:border-green-500 bg-white/80 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubCategories.map((category) => (
                        <SelectItem key={category} value={category} className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-email" className="text-sm font-medium text-green-900 dark:text-green-200">Club Email *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="club-email"
                    type="email"
                    placeholder="gdsc@manipal.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`signup-input pr-10 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.email ? 'border-green-500' : ''}`}
                  />
                </div>
                {fieldValidation.email && !fieldValidation.email.isValid && (
                  <p className="text-xs text-red-500">{fieldValidation.email.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-sm font-medium text-green-900 dark:text-green-200">Contact Person Name *</Label>
                  <Input
                    id="contact-name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`signup-input pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.fullName ? 'border-green-500' : ''}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-advisor" className="text-sm font-medium text-green-900 dark:text-green-200">Faculty Advisor</Label>
                  <Input
                    id="faculty-advisor"
                    placeholder="Dr. Jane Smith"
                    value={formData.facultyAdvisor}
                    onChange={(e) => handleInputChange("facultyAdvisor", e.target.value)}
                    className={`signup-input pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.facultyAdvisor ? 'border-green-500' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-description" className="text-sm font-medium text-green-900 dark:text-green-200">Club Description</Label>
                <Textarea
                  id="club-description"
                  placeholder="Brief description of your club's activities and goals..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="signup-input resize-none pl-10 pr-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-password" className="text-sm font-medium text-green-900 dark:text-green-200">Password *</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="club-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`signup-input w-full pr-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.password ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.password && (
                  <div>
                    <div className="password-strength-bar">
                      <div
                        className={`password-strength-fill ${getPasswordStrengthColor(passwordStrength.score)}`}
                      />
                    </div>
                    <p className="text-xs mt-1">{getPasswordStrengthText(passwordStrength.score)}</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        {formData.password.length >= 8 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one uppercase letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[a-z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one lowercase letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/\d/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one number</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one special character (!@#$%^&*)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-confirm-password" className="text-sm font-medium text-green-900 dark:text-green-200">Confirm Password *</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="club-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`signup-input w-full pr-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.confirmPassword ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <Button
                className="signup-button w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up dark:from-green-700 dark:to-emerald-800 dark:text-white dark:shadow-green-900"
                onClick={handleSignup}
                disabled={loading || !passwordStrength.isStrong}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Building className="w-4 h-4 mr-2" />
                    Create Club Account
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name" className="text-sm font-medium text-green-900 dark:text-green-200">Full Name *</Label>
                  <Input
                    id="admin-name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`signup-input pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.fullName ? 'border-green-500' : ''}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-id-field" className="text-sm font-medium text-green-900 dark:text-green-200">Admin ID *</Label>
                  <div className="relative">
                    <Input
                      id="admin-id-field"
                      placeholder="swo"
                      value={formData.adminId}
                      onChange={(e) => handleInputChange("adminId", e.target.value)}
                      className={`signup-input pr-10 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.adminId ? 'border-green-500' : ''}`}
                    />
                  </div>
                  {fieldValidation.adminId && !fieldValidation.adminId.isValid && (
                    <p className="text-xs text-red-500">{fieldValidation.adminId.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-sm font-medium text-green-900 dark:text-green-200">Official Email *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@manipal.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`signup-input pr-10 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.email ? 'border-green-500' : ''}`}
                    />
                  </div>
                  {fieldValidation.email && !fieldValidation.email.isValid && (
                    <p className="text-xs text-red-500">{fieldValidation.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-department" className="text-sm font-medium text-green-900 dark:text-green-200">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger className="signup-input pl-4 rounded-xl border transition-colors duration-200 focus:border-green-500 bg-white/80 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student Welfare" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">Student Welfare</SelectItem>
                      <SelectItem value="Academic Affairs" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">Academic Affairs</SelectItem>
                      <SelectItem value="Administration" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">Administration</SelectItem>
                      <SelectItem value="IT Services" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">IT Services</SelectItem>
                      <SelectItem value="Finance" className="dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-700 dark:focus:bg-green-900 dark:focus:text-white">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium text-green-900 dark:text-green-200">Password *</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`signup-input w-full pr-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.password ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.password && (
                  <div>
                    <div className="password-strength-bar">
                      <div
                        className={`password-strength-fill ${getPasswordStrengthColor(passwordStrength.score)}`}
                      />
                    </div>
                    <p className="text-xs mt-1">{getPasswordStrengthText(passwordStrength.score)}</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        {formData.password.length >= 8 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one uppercase letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[a-z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one lowercase letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/\d/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one number</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>At least one special character (!@#$%^&*)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-confirm-password" className="text-sm font-medium text-green-900 dark:text-green-200">Confirm Password *</Label>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 h-5 w-5 text-green-300" />
                  <Input
                    id="admin-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`signup-input w-full pr-12 pl-10 rounded-xl border transition-colors duration-200 focus:border-green-500 placeholder:font-normal placeholder:text-gray-400 bg-white/80 dark:bg-gray-900/60 ${formData.confirmPassword ? 'border-green-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <Button
                className="signup-button w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up dark:from-green-700 dark:to-emerald-800 dark:text-white dark:shadow-green-900"
                onClick={handleSignup}
                disabled={loading || !passwordStrength.isStrong}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Create Admin Account
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">Already have an account?</p>
            <Button
              variant="outline"
              onClick={onBackToLogin}
              className="w-full text-green-700 font-semibold rounded-xl border-green-300 bg-white/70 hover:bg-green-100 hover:border-green-500 shadow transition-all duration-200 dark:bg-gray-800 dark:text-green-200 dark:border-green-700 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}