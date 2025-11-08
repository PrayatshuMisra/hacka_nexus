export interface PasswordStrength {
  score: number 
  feedback: string[]
  isStrong: boolean
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push("Password should be at least 8 characters long")
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one uppercase letter")
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one lowercase letter")
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one number")
  }

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one special character (!@#$%^&*)")
  }

  if (password.length >= 12) {
    score += 1
  }

  const isStrong = score >= 4

  return {
    score,
    feedback,
    isStrong,
  }
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return "Very Weak"
    case 2:
      return "Weak"
    case 3:
      return "Fair"
    case 4:
      return "Good"
    case 5:
    case 6:
      return "Strong"
    default:
      return "Unknown"
  }
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return "strength-weak"
    case 2:
      return "strength-weak"
    case 3:
      return "strength-fair"
    case 4:
      return "strength-good"
    case 5:
    case 6:
      return "strength-strong"
    default:
      return "strength-weak"
  }
}