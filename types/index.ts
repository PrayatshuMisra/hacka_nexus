export interface User {
  id: number
  registrationNumber?: string
  email: string
  fullName: string
  role: "student" | "club_member" | "admin"
  department?: string
  yearOfStudy?: number
  phone?: string
  profileImageUrl?: string
  interests?: string[]
  passwordHash?: string
  createdAt: string
  updatedAt: string
}

export interface Club {
  id: number
  name: string
  slug: string
  description: string
  category: string
  logoUrl?: string
  bannerUrl?: string
  email: string
  foundedDate?: string
  facultyAdvisor?: string
  isActive: boolean
  memberCount: number
  rating: number
  totalEvents: number
  createdAt: string
  updatedAt: string
  isFollowing?: boolean
  tags?: string[]
}

export interface Event {
  id: number
  clubId: number
  title: string
  description: string
  eventType: string
  venue: string
  startDate: string
  endDate?: string
  registrationDeadline?: string
  maxParticipants?: number
  currentParticipants: number
  posterUrl?: string
  budgetRequested?: number
  budgetApproved?: number
  status: "draft" | "pending_approval" | "approved" | "rejected" | "completed" | "cancelled"
  approvalNotes?: string
  createdAt: string
  updatedAt: string
  club?: Club
  registrationStatus?: "registered" | "interested" | "not_registered"
}

export interface Post {
  id: number
  clubId: number
  authorId: number
  content: string
  imageUrls?: string[]
  videoUrl?: string
  postType: "general" | "event" | "achievement" | "recruitment"
  likesCount: number
  commentsCount: number
  sharesCount: number
  isPinned: boolean
  createdAt: string
  updatedAt: string
  club?: Club
  author?: User
  isLiked?: boolean
  isBookmarked?: boolean
}

export interface Application {
  id: number
  clubId: number
  userId: number
  position: string
  applicationText?: string
  resumeUrl?: string
  portfolioUrl?: string
  status: "pending" | "shortlisted" | "accepted" | "rejected"
  appliedDate: string
  reviewedDate?: string
  reviewerNotes?: string
  club?: Club
}

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: "event" | "application" | "club" | "system"
  relatedId?: number
  isRead: boolean
  createdAt: string
}

export interface Venue {
  id: number
  name: string
  location: string
  capacity?: number
  facilities?: string[]
  bookingContact?: string
  isAvailable: boolean
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}
