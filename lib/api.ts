import type { User, Club, Event, Post, Application, Notification } from "@/types"
import { supabase } from "./supabase"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUsers: User[] = [
  {
    id: 1,
    registrationNumber: "220701001",
    email: "john.doe@learner.manipal.edu",
    fullName: "John Doe",
    role: "student",
    department: "Computer Science Engineering",
    yearOfStudy: 3,
    interests: ["Programming", "AI/ML", "Web Development"],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const mockClubs: Club[] = [
  {
    id: 1,
    name: "Google Developer Student Clubs",
    slug: "gdsc",
    description: "Building the next generation of developers through hands-on workshops, hackathons, and tech talks.",
    category: "Technical",
    email: "gdsc@manipal.edu",
    facultyAdvisor: "Dr. Rajesh Kumar",
    isActive: true,
    memberCount: 450,
    rating: 4.8,
    totalEvents: 12,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    tags: ["Tech", "AI/ML", "Web Dev"],
    logoUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Music Club MIT Manipal",
    slug: "music-club",
    description: "Harmony in diversity, melody in unity. We bring together musicians from all genres.",
    category: "Cultural",
    email: "music@manipal.edu",
    facultyAdvisor: "Prof. Sunita Rao",
    isActive: true,
    memberCount: 320,
    rating: 4.9,
    totalEvents: 8,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    tags: ["Music", "Performance", "Cultural"],
    logoUrl: "/placeholder.svg?height=100&width=100",
  },
]

const mockEvents: Event[] = [
  {
    id: 1,
    clubId: 1,
    title: "TechTatva 2024",
    description:
      "Annual technical festival featuring hackathons, coding competitions, tech talks, and innovation showcases.",
    eventType: "technical",
    venue: "Innovation Centre Auditorium",
    startDate: "2024-10-15T09:00:00Z",
    endDate: "2024-10-17T18:00:00Z",
    registrationDeadline: "2024-10-10T23:59:59Z",
    maxParticipants: 500,
    currentParticipants: 234,
    status: "approved",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-01T00:00:00Z",
    registrationStatus: "registered",
  },
]

const mockPosts: Post[] = [
  {
    id: 1,
    clubId: 1,
    authorId: 1,
    content:
      "🚀 Just wrapped up our AI/ML workshop! Amazing turnout with 200+ students learning about neural networks.",
    imageUrls: ["/placeholder.svg?height=300&width=500"],
    postType: "event",
    likesCount: 156,
    commentsCount: 23,
    sharesCount: 12,
    isPinned: false,
    createdAt: "2024-10-08T15:30:00Z",
    updatedAt: "2024-10-08T15:30:00Z",
    isLiked: false,
    isBookmarked: false,
  },
]

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

const mockComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    userName: "Jane Smith",
    content: "Awesome event! Learned a lot.",
    createdAt: "2024-10-08T16:00:00Z",
    likes: 2,
    isLiked: false,
  },
  {
    id: 2,
    postId: 1,
    userId: 1,
    userName: "John Doe",
    content: "Thanks for joining everyone! 🚀",
    createdAt: "2024-10-08T16:10:00Z",
    likes: 1,
    isLiked: true,
  },
];

export const authAPI = {
  login: async (credentials: { email: string; password?: string; registrationNumber?: string; role: string }) => {
    await delay(1000)

    const user = mockUsers.find((u) => u.email === credentials.email)
    if (user) {
      return { success: true, user, token: "mock-jwt-token" }
    }
    return { success: false, error: "Invalid credentials" }
  },

  register: async (userData: Partial<User>) => {
    await delay(1000)
    const newUser: User = {
      id: mockUsers.length + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User
    mockUsers.push(newUser)
    return { success: true, user: newUser }
  },
}

export const clubsAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from("clubs").select("*")
    if (error) throw error

    return data
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from("clubs").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },
  getRecommended: async (userId: number) => {

    const { data, error } = await supabase.from("clubs").select("*")
    if (error) throw error
    return data
  },
  follow: async (clubId: number, userId: number) => {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .insert([
          { 
            user_id: userId, 
            club_id: clubId,
            joined_at: new Date().toISOString(),
            role_in_club: 'member'
          }
        ]);
      
      if (error) throw error;
      
      // Update member count
      await supabase.rpc('increment_member_count', { club_id: clubId });
      
      return true;
    } catch (error) {
      console.error('Error following club:', error);
      throw error;
    }
  },

  unfollow: async (clubId: number, userId: number) => {
    try {
      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('user_id', userId)
        .eq('club_id', clubId);
      
      if (error) throw error;
      
      // Update member count
      await supabase.rpc('decrement_member_count', { club_id: clubId });
      
      return true;
    } catch (error) {
      console.error('Error unfollowing club:', error);
      throw error;
    }
  }
};

export const eventsAPI = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return []; // Return empty array instead of throwing to prevent UI crashes
    }
  },
  getUpcoming: async (userId?: number) => {
    const now = new Date().toISOString()
    const { data, error } = await supabase.from("events").select("*").gt("start_date", now)
    if (error) throw error
    return data
  },
  register: async (eventId: number, userId: number) => true,
  unregister: async (eventId: number, userId: number) => true,
}

export const postsAPI = {
  getFeed: async (userId: number, page = 1) => {

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*, club:clubs(*), author:users(*)")
      .order("created_at", { ascending: false })
      .limit(20)
    if (error) throw error

    const postIds = posts.map((p: any) => p.id)

    const { data: likesData } = await supabase
      .from("post_likes")
      .select("post_id, user_id")
      .in("post_id", postIds)

    const { data: commentsData } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds)
    return posts.map((post: any) => {
      const likes = likesData?.filter((l: any) => l.post_id === post.id) || []
      const comments = commentsData?.filter((c: any) => c.post_id === post.id) || []
      return {
        ...post,
        createdAt: post.created_at,
        likesCount: likes.length,
        commentsCount: comments.length,
        isLiked: !!likes.find((l: any) => l.user_id === userId),
      }
    })
  },
  getBookmarked: async (userId: number, offset = 0, limit?: number) => {
    let query = supabase
      .from("saved_posts")
      .select("post:posts(*, club:clubs(*), author:users(*))")
      .eq("user_id", userId)
    if (typeof limit === 'number') {
      query = query.range(offset, offset + limit - 1)
    }
    const { data, error } = await query
    if (error) throw error
    return data?.map((row: any) => row.post) || []
  },
  like: async (postId: number, userId: number): Promise<boolean> => {

    const { data: existing, error: fetchError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle()
    if (fetchError) return false
    if (existing) {
 
      const { error: delError } = await supabase
        .from("post_likes")
        .delete()
        .eq("id", existing.id)
      return !delError
    } else {
  
      const { error: insError } = await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: userId })
      return !insError
    }
  },

  share: async (postId: number, userId: number): Promise<boolean> => {
    await delay(300)
    const post = mockPosts.find((p) => p.id === postId)
    if (post) {
      post.sharesCount += 1
      return true
    }
    return false
  },

  bookmark: async (postId: number, userId: number): Promise<boolean> => {
 
    const { data: existing, error: fetchError } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle()
    if (fetchError) return false
    if (existing) {
 
      const { error: delError } = await supabase
        .from("saved_posts")
        .delete()
        .eq("id", existing.id)
      return !delError
    } else {

      const { error: insError } = await supabase
        .from("saved_posts")
        .insert({ post_id: postId, user_id: userId })
      return !insError
    }
  },

  getComments: async (postId: number): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
    if (error) throw error

    return (data || []).map((c: any) => ({
      ...c,
      userName: c.user_name,
      userAvatarUrl: c.user_avatar_url,
      createdAt: c.created_at,
    }))
  },

  addComment: async (postId: number, userId: number, content: string): Promise<Comment> => {
 
    const { data: user } = await supabase.from("users").select("full_name, profile_image_url").eq("id", userId).single()
    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        user_name: user?.full_name || "User",
        user_avatar_url: user?.profile_image_url || null,
        content,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  likeComment: async (commentId: number, userId: number): Promise<boolean> => {

    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("likes, is_liked")
      .eq("id", commentId)
      .maybeSingle()
    if (fetchError || !comment) return false
    const newLikes = comment.is_liked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1
    const { error: updateError } = await supabase
      .from("comments")
      .update({ likes: newLikes, is_liked: !comment.is_liked })
      .eq("id", commentId)
    return !updateError
  },

  deleteComment: async (commentId: number, userId: number): Promise<boolean> => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId)
    return !error
  },
}

export const applicationsAPI = {
  getByUser: async (userId: number) => {
    const { data, error } = await supabase
      .from("applications")
      .select("*, club:clubs(*)")
      .eq("user_id", userId)
      .order("applied_date", { ascending: false })
    if (error) throw error
    return data
  },
  submit: async (applicationData: Partial<Application>) => true,
}

export const notificationsAPI = {
  getByUser: async (userId: number) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data
  },
  markAsRead: async (notificationId: number) => true,
}

export const usersAPI = {
  getProfile: async (userId: number) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()
    if (error) throw error
    return data
  },
}