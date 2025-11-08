import type { User } from "@/types"
import { supabase } from './supabase'

const mockUsers = [
  // Demo Student
  {
    id: 1,
    registrationNumber: "240962386",
    email: "prayatshu.mitmpl2024@learner.manipal.edu",
    passwordHash: "demoStudent123",
    fullName: "Demo Student",
    role: "student" as const,
    department: "Computer Science Engineering",
    yearOfStudy: 2,
  },
  // Additional test student
  {
    id: 2,
    registrationNumber: "demoStudent123",
    email: "demo.student2@nexussync.com",
    passwordHash: "demoStudent123",
    fullName: "Demo Student 2",
    role: "student" as const,
    department: "Information Technology",
    yearOfStudy: 3,
  },
  
  // Demo Club
  {
    id: 10,
    email: "demo.club@nexussync.com",
    passwordHash: "demoClub123",
    fullName: "Demo Club",
    role: "club_member" as const,
  },
  
  // Demo Admin
  {
    id: 20,
    email: "demo.admin@nexussync.com",
    passwordHash: "demoAdmin123",
    fullName: "Demo Admin",
    role: "admin" as const,
    department: "Administration",
  },
  
  // Additional test users
  {
    id: 2,
    registrationNumber: "220701002",
    email: "jane.smith@learner.manipal.edu",
    passwordHash: "student123",
    fullName: "Jane Smith",
    role: "student" as const,
    department: "Information Technology",
    yearOfStudy: 3,
  },
  {
    id: 11,
    email: "music@manipal.edu",
    passwordHash: "club123",
    fullName: "Music Club MIT",
    role: "club_member" as const,
  },
]

export interface LoginCredentials {
  email: string
  registrationNumber?: string
  password: string
  role: "student" | "club_member" | "admin"
  adminId?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authenticate = async (credentials: LoginCredentials): Promise<AuthResult> => {
  await delay(1000)

  try {
    let user = null

    if (credentials.role === "student") {
 
      if (credentials.registrationNumber) {
        user = mockUsers.find((u) => u.registrationNumber === credentials.registrationNumber && u.role === "student")
      } else if (credentials.email) {
        user = mockUsers.find((u) => u.email === credentials.email && u.role === "student")
      }

      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            registrationNumber: user.registrationNumber,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            department: user.department,
            yearOfStudy: user.yearOfStudy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: `mock-jwt-token-${user.id}`,
        }
      }
    } else if (credentials.role === "club_member") {

      user = mockUsers.find(
        (u) => u.email === credentials.email && u.passwordHash === credentials.password && u.role === "club_member",
      )

      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: `mock-jwt-token-${user.id}`,
        }
      }
    } else if (credentials.role === "admin") {
      // First try exact email match (for demo)
      user = mockUsers.find(
        (u) => u.email === credentials.email && u.passwordHash === credentials.password && u.role === "admin",
      )
      
      // If not found with email, try with adminId (for backward compatibility)
      if (!user && credentials.adminId) {
        const adminEmail = `${credentials.adminId}@manipal.edu`
        user = mockUsers.find(
          (u) => u.email === adminEmail && u.passwordHash === credentials.password && u.role === "admin",
        )
      }

      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            department: user.department,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: `mock-jwt-token-${user.id}`,
        }
      }
    }

    return {
      success: false,
      error: "Invalid credentials. Please check your login details and try again.",
    }
  } catch (error) {
    return {
      success: false,
      error: "An error occurred during authentication. Please try again.",
    }
  }
}

export const getCurrentUser = async (token: string): Promise<User | null> => {
  await delay(300)

  const userId = Number.parseInt(token.split("-").pop() || "0")
  const user = mockUsers.find((u) => u.id === userId)

  if (user) {
    return {
      id: user.id,
      registrationNumber: user.registrationNumber,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  return null
}

export const logout = () => {

  localStorage.removeItem("auth-token")
  localStorage.removeItem("user-data")
}

export interface StudentLoginResult {
  success: boolean
  user?: any
  error?: string
  requiresConfirmation?: boolean
}

export async function checkStudentExists(identifier: string): Promise<boolean> {
  try {
    const isEmail = identifier.includes('@')
    
    let query = supabase
      .from('users')
      .select('id')
      .eq('role', 'student')
    
    if (isEmail) {
      query = query.eq('email', identifier)
    } else {
      query = query.eq('registration_number', identifier)
    }
    
    const { data, error } = await query.single()
    return !error && !!data
  } catch (error) {
    return false
  }
}

export async function loginStudentDirectly(identifier: string): Promise<StudentLoginResult> {
  try {
    console.log('🔍 loginStudentDirectly called with identifier:', identifier)
    const isEmail = identifier.includes('@')
    
    // First, try to get the user from the database
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
    
    if (isEmail) {
      query = query.eq('email', identifier)
    } else {
      query = query.eq('registration_number', identifier)
    }
    
    console.log('🔍 Executing database query...')
    const { data: student, error } = await query.single()
    console.log('🔍 Database response:', { student, error })

    if (error) {
      console.error('❌ Database error:', error)
      return {
        success: false,
        error: `Database error: ${error.message}`
      }
    }

    if (!student) {
      console.log('❌ Student not found in database')
      return {
        success: false,
        error: isEmail ? 'Student not found with this email address' : 'Student not found with this registration number'
      }
    }

    console.log('✅ Student found in database:', student)

    // Check if student has completed their profile (has full_name and other required fields)
    // This indicates they've gone through the signup process
    if (!student.full_name || !student.email) {
      console.log('⚠️ Student exists but profile incomplete')
      // Student exists but hasn't completed signup, so they need email confirmation
      return {
        success: false,
        requiresConfirmation: true,
        error: 'Please use email confirmation to complete your registration'
      }
    }

    // Student exists and has completed signup, allow direct login
    const userData = {
      id: student.id,
      registrationNumber: student.registration_number,
      email: student.email,
      fullName: student.full_name,
      role: student.role,
      department: student.department,
      yearOfStudy: student.year_of_study,
      profileImageUrl: student.profile_image_url || '/placeholder.svg?height=100&width=100'
    }
    
    console.log('✅ Returning user data:', userData)
    return {
      success: true,
      user: userData
    }

  } catch (error) {
    console.error('❌ Error in loginStudentDirectly:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}