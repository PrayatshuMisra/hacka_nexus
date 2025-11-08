import type { User } from "@/types"

export interface SignupData {
  role: "student" | "club_member" | "admin"

  registrationNumber?: string
  fullName: string
  email: string
  password: string
  confirmPassword: string
  department?: string
  yearOfStudy?: number
  interests?: string[]

  clubName?: string
  description?: string
  category?: string
  facultyAdvisor?: string

  adminId?: string
}

export interface SignupResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function checkExistence(field: string, value: string): Promise<boolean> {

  await new Promise((resolve) => setTimeout(resolve, 500))

  const existingEmails = ["john.doe@learner.manipal.edu", "gdsc@manipal.edu", "admin@manipal.edu"]

  const existingRegNumbers = ["220701001", "220701002", "220701003"]

  const existingAdminIds = ["swo", "admin", "registrar"]

  if (field === "email") {
    return existingEmails.includes(value.toLowerCase())
  } else if (field === "registrationNumber") {
    return existingRegNumbers.includes(value)
  } else if (field === "adminId") {
    return existingAdminIds.includes(value.toLowerCase())
  }

  return false
}

export async function createAccount(signupData: SignupData): Promise<SignupResponse> {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {

    if (!signupData.fullName || !signupData.email || !signupData.password) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    const emailExists = await checkExistence("email", signupData.email)
    if (emailExists) {
      return {
        success: false,
        error: "Email address is already registered",
      }
    }

    if (signupData.role === "student" && signupData.registrationNumber) {
      const regExists = await checkExistence("registrationNumber", signupData.registrationNumber)
      if (regExists) {
        return {
          success: false,
          error: "Registration number is already registered",
        }
      }
    }

    if (signupData.role === "admin" && signupData.adminId) {
      const adminExists = await checkExistence("adminId", signupData.adminId)
      if (adminExists) {
        return {
          success: false,
          error: "Admin ID is already taken",
        }
      }
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      fullName: signupData.fullName,
      email: signupData.email,
      role: signupData.role,
      registrationNumber: signupData.registrationNumber,
      department: signupData.department,
      yearOfStudy: signupData.yearOfStudy,
      interests: signupData.interests || [],
      passwordHash: signupData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      user: newUser,
      token: `mock-token-${newUser.id}`,
    }
  } catch (error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}