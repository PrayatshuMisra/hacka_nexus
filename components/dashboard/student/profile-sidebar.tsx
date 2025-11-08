"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Trophy, Bell, Settings, Brain, Navigation, Heart, ExternalLink, Trash2 } from "lucide-react"
import { postsAPI, usersAPI, clubsAPI, eventsAPI } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Post, Comment } from "@/types"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ProfileSidebarProps {
  onNavigate?: (view: string) => void
  infiniteSavedPosts?: boolean
}

export function ProfileSidebar({ onNavigate, infiniteSavedPosts }: ProfileSidebarProps) {
  const [user, setUser] = useState<any>(null)
  const [clubsJoined, setClubsJoined] = useState<number>(0)
  const [eventsAttended, setEventsAttended] = useState<number>(0)
  const [achievementPoints, setAchievementPoints] = useState<number>(0)
  const [profileCompletion, setProfileCompletion] = useState<number>(0)
  const userId = 1
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [savedPostsLoading, setSavedPostsLoading] = useState(false)
  const [savedPostsHasMore, setSavedPostsHasMore] = useState(true)
  const savedPostsLimit = 10
  const savedPostsOffset = savedPosts.length
  const [commentModal, setCommentModal] = useState<{ open: boolean; post: Post | null }>({ open: false, post: null })
  const [comments, setComments] = useState<Comment[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [editPicOpen, setEditPicOpen] = useState(false)
  const [newPicFile, setNewPicFile] = useState<File | null>(null)
  const [newPicUrl, setNewPicUrl] = useState<string | null>(null)
  const [savingPic, setSavingPic] = useState(false)
  const { toast } = useToast()

  useEffect(() => {

    const fetchProfile = async () => {
      let userId = null
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user-data')
        if (userData) {
          try {
            const parsed = JSON.parse(userData)
            userId = parsed.id
          } catch {}
        }
      }
      if (!userId) return

      const profile = await usersAPI.getProfile(userId)
      setUser(profile)
  
      const { data: clubMembers } = await supabase
        .from("club_members")
        .select("id")
        .eq("user_id", userId)
      setClubsJoined(clubMembers?.length || 0)

      const { data: registrations } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", userId)
      setEventsAttended(registrations?.length || 0)
 
      const { data: achievements } = await supabase
        .from("achievements")
        .select("points")
        .eq("user_id", userId)
      setAchievementPoints((achievements || []).reduce((sum, a) => sum + (a.points || 0), 0))

      setTimeout(() => {
        const fields = [
          !!profile.full_name,
          !!profile.registration_number,
          !!profile.email,
          !!profile.department,
          !!profile.year_of_study,
          !!profile.profile_image_url,
          !!profile.interests,
          (clubMembers?.length || 0) > 0,
          (registrations?.length || 0) > 0,
          ((achievements || []).reduce((sum, a) => sum + (a.points || 0), 0)) > 0,
        ]
        setProfileCompletion(Math.round((fields.filter(Boolean).length / fields.length) * 100))
      }, 0)
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (!user) return
    const fields = [
      !!user.full_name,
      !!user.registration_number,
      !!user.email,
      !!user.department,
      !!user.year_of_study,
      !!user.profile_image_url,
      !!user.interests,
      clubsJoined > 0,
      eventsAttended > 0,
      achievementPoints > 0,
    ]
    setProfileCompletion(Math.round((fields.filter(Boolean).length / fields.length) * 100))
  }, [user, clubsJoined, eventsAttended, achievementPoints])

  useEffect(() => {
    if (!infiniteSavedPosts) {
      postsAPI.getBookmarked(userId).then(setSavedPosts)
    } else {
 
      loadMoreSavedPosts()
    }
  
  }, [infiniteSavedPosts])


  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel('saved-posts-listen')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'saved_posts', filter: `user_id=eq.${userId}` },
        () => {
   
          postsAPI.getBookmarked(userId).then(setSavedPosts)
        }
      )
      .subscribe()
    return () => { channel.unsubscribe() }
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const handler = () => {
      postsAPI.getBookmarked(userId).then(setSavedPosts)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('saved-posts-updated', handler)
      return () => window.removeEventListener('saved-posts-updated', handler)
    }
  }, [userId])

  const loadMoreSavedPosts = async () => {
    if (savedPostsLoading || !savedPostsHasMore) return
    setSavedPostsLoading(true)
    const data = await postsAPI.getBookmarked(userId, savedPosts.length, savedPostsLimit)
    setSavedPosts((prev) => [...prev, ...data])
    setSavedPostsLoading(false)
    if (!data || data.length < savedPostsLimit) setSavedPostsHasMore(false)
  }

  const savedPostsContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!infiniteSavedPosts) return
    const handleScroll = () => {
      const el = savedPostsContainerRef.current
      if (!el) return
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
        loadMoreSavedPosts()
      }
    }
    const el = savedPostsContainerRef.current
    if (el) el.addEventListener('scroll', handleScroll)
    return () => { if (el) el.removeEventListener('scroll', handleScroll) }

  }, [infiniteSavedPosts, savedPosts, savedPostsHasMore])

  const openComments = async (post: Post) => {
    setCommentModal({ open: true, post })
    setCommentLoading(true)
    try {
      const data = await postsAPI.getComments(post.id)
      setComments(data)
    } finally {
      setCommentLoading(false)
    }
  }
  const closeComments = () => {
    setCommentModal({ open: false, post: null })
    setComments([])
    setNewComment("")
  }
  const handleAddComment = async () => {
    if (!newComment.trim() || !commentModal.post) return
    setCommentLoading(true)
    try {
      const comment = await postsAPI.addComment(commentModal.post.id, userId, newComment)
      setComments((prev) => [...prev, comment])
      setNewComment("")
    } finally {
      setCommentLoading(false)
    }
  }
  const handleLikeComment = async (commentId: number) => {
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c))
    await postsAPI.likeComment(commentId, userId)
  }
  const handleDeleteComment = async (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    await postsAPI.deleteComment(commentId, userId)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "campus-navigation":
        onNavigate?.("map")
        break
      case "upcoming-events":
        onNavigate?.("events")
        break
      case "join-clubs":
        onNavigate?.("clubs")
        break
      case "quizzes":
        onNavigate?.("quizzes")
        break
      case "notifications":
        onNavigate?.("notifications")
        break
      case "settings":
        onNavigate?.("settings")
        break
      default:
        console.log(`Action: ${action}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="student-profile-card border-0 shadow-xl">
        <CardContent className="p-6 text-center">
          {/* Profile Completion Progress Ring */}
          <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="56" cy="56" r="50" fill="none"
                stroke="#34d399"
                strokeWidth="8"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * profileCompletion) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)' }}
              />
            </svg>
            <div className="relative z-10">
              <Avatar className="w-24 h-24 mx-auto ring-4 ring-white/50 shadow-lg relative z-10 cursor-pointer group" onClick={() => setEditPicOpen(true)}>
                <AvatarImage src={newPicUrl || user?.profile_image_url || "/placeholder.svg"} alt={user?.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-xl font-bold">
                  {user?.full_name?.split(" ").map((n: string, _i: number) => n[0]).join("")}
                </AvatarFallback>
                <span className="absolute bottom-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded shadow group-hover:bg-emerald-600 transition">Edit</span>
              </Avatar>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1">{user?.full_name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{user?.registration_number}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mb-4 flex items-center gap-2">
            {user?.department} • Year {user?.year_of_study}
            {/* Online badge */}
            <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full tracking-wide shadow-sm">ONLINE</span>
          </p>

          {/* Profile Completion */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Profile Completion</span>
              <span className="font-semibold">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            {/* Animated visual progress bar below */}
            <div className="w-full h-3 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          {/* Edit Profile Picture Dialog */}
          <Dialog open={editPicOpen} onOpenChange={setEditPicOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24 mx-auto ring-4 ring-emerald-200">
                  <AvatarImage src={newPicUrl || user?.profile_image_url || "/placeholder.svg"} />
                  <AvatarFallback>{user?.full_name?.split(" ").map((n: string, _i: number) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setNewPicFile(e.target.files[0])
                      setNewPicUrl(URL.createObjectURL(e.target.files[0]))
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = newPicUrl || user?.profile_image_url
                      if (url && typeof window !== 'undefined') window.open(url, '_blank')
                    }}
                    disabled={!(newPicUrl || user?.profile_image_url)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> View Photo
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (!user?.id || !user?.profile_image_url) return
                      const { error: updateError } = await supabase.from('users').update({ profile_image_url: null }).eq('id', user.id)
                      if (updateError) {
                        toast({ title: 'Error', description: updateError.message, variant: 'destructive' })
                        return
                      }
                      setUser((u: any) => ({ ...u, profile_image_url: null }))
                      setNewPicFile(null)
                      setNewPicUrl(null)
                      toast({ title: 'Profile photo removed', variant: 'success' })
                    }}
                    disabled={!user?.profile_image_url}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove Photo
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    if (!newPicFile || !user?.id) return
                    setSavingPic(true)
                
                    const fileExt = newPicFile.name.split('.').pop()
                    const filePath = `avatars/${user.id}_${Date.now()}.${fileExt}`
                    const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(filePath, newPicFile, { upsert: true })
                    if (uploadError) {
                      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' })
                      setSavingPic(false)
                      return
                    }
               
                    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
                    const publicUrl = publicUrlData?.publicUrl
                    if (!publicUrl) {
                      toast({ title: 'Error', description: 'Could not get image URL', variant: 'destructive' })
                      setSavingPic(false)
                      return
                    }
                 
                    const { error: updateError } = await supabase.from('users').update({ profile_image_url: publicUrl }).eq('id', user.id)
                    if (updateError) {
                      toast({ title: 'Error', description: updateError.message, variant: 'destructive' })
                      setSavingPic(false)
                      return
                    }
                    setUser((u: any) => ({ ...u, profile_image_url: publicUrl }))
                    setEditPicOpen(false)
                    setSavingPic(false)
                    setNewPicFile(null)
                    setNewPicUrl(null)
                    toast({ title: 'Profile picture updated!', variant: 'success' })
                  }}
                  disabled={!newPicFile || savingPic}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="student-stat-card student-stat-emerald">
              <div className="text-lg font-bold">{clubsJoined}</div>
              <div className="text-xs opacity-90">Clubs</div>
            </div>
            <div className="student-stat-card student-stat-blue">
              <div className="text-lg font-bold">{eventsAttended}</div>
              <div className="text-xs opacity-90">Events</div>
            </div>
            <div className="student-stat-card student-stat-orange">
              <div className="text-lg font-bold">{achievementPoints}</div>
              <div className="text-xs opacity-90">Points</div>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-left">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {(user?.interests ? (Array.isArray(user.interests) ? user.interests : (user.interests as string).split(',').map((i: string) => i.trim())) : []).map((interest: string, index: number) => (
                <Badge key={index} className="student-interest-badge">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Posts Section */}
      <Card className="student-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-500" />
            Saved Posts
          </CardTitle>
        </CardHeader>
        {infiniteSavedPosts ? (
          <CardContent className="space-y-3 max-h-96 overflow-y-auto" ref={savedPostsContainerRef}>
            {savedPosts.length === 0 && !savedPostsLoading ? (
              <div className="text-gray-400 text-center py-4">No saved posts yet.</div>
            ) : (
              <>
                {savedPosts.map((post, index) => (
                  <div key={`${post.id}-${index}`} className="border-b last:border-b-0 pb-3 mb-3 last:mb-0 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.club?.logoUrl || "/placeholder.svg?height=32&width=32"} />
                        <AvatarFallback>{post.club?.name?.slice(0, 2) || "CL"}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{post.club?.name || "Club"}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">{post.postType}</Badge>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm truncate">{post.content}</div>
                    <Button size="sm" variant="outline" className="mt-1 w-fit" onClick={() => openComments(post)}>
                      View / Comment
                    </Button>
                  </div>
                ))}
                {savedPostsLoading && (
                  <div className="text-center py-2 text-emerald-500">Loading more...</div>
                )}
                {!savedPostsHasMore && savedPosts.length > 0 && (
                  <div className="text-center py-2 text-gray-400 text-xs">No more saved posts.</div>
                )}
              </>
            )}
          </CardContent>
        ) : (
          <CardContent className="space-y-3">
            {savedPosts.length === 0 ? (
              <div className="text-gray-400 text-center py-4">No saved posts yet.</div>
            ) : (
              savedPosts.map((post, index) => (
                <div key={`${post.id}-${index}`} className="border-b last:border-b-0 pb-3 mb-3 last:mb-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.club?.logoUrl || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback>{post.club?.name?.slice(0, 2) || "CL"}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">{post.club?.name || "Club"}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">{post.postType}</Badge>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm truncate">{post.content}</div>
                  <Button size="sm" variant="outline" className="mt-1 w-fit" onClick={() => openComments(post)}>
                    View / Comment
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="student-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="ghost"
            className="student-action-button w-full justify-start rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => handleQuickAction("campus-navigation")}
          >
            <Navigation className="w-4 h-4 mr-3" />
            Campus Navigation
          </Button>
          <Button
            variant="ghost"
            className="student-action-button w-full justify-start rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => handleQuickAction("upcoming-events")}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Upcoming Events
          </Button>
          <Button
            variant="ghost"
            className="student-action-button w-full justify-start rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => handleQuickAction("join-clubs")}
          >
            <Users className="w-4 h-4 mr-3" />
            Join Clubs
          </Button>
          <Button
            variant="ghost"
            className="student-action-button w-full justify-start rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => handleQuickAction("quizzes")}
          >
            <Brain className="w-4 h-4 mr-3" />
            Take Quizzes
          </Button>
          <Button
            variant="ghost"
            className="student-action-button w-full justify-start rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => handleQuickAction("notifications")}
          >
            <Bell className="w-4 h-4 mr-3" />
            Notifications
          </Button>
        </CardContent>
      </Card>

      {/* Achievement Badge */}
      <Card className="student-card border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardContent className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <h4 className="font-semibold text-sm mb-1">Rising Star</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Keep participating in events to unlock more achievements!
          </p>
        </CardContent>
      </Card>

      {/* Comments Modal (reuse) */}
      <Dialog open={commentModal.open} onOpenChange={v => !v && closeComments()}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          {commentLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No comments yet.</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 border-b pb-3 last:border-b-0">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.userAvatarUrl || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback>{comment.userName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-400">{/* TODO: formatTimeAgo */}{comment.createdAt}</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm mb-1">{comment.content}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Button variant="ghost" size="sm" className={`p-1 ${comment.isLiked ? 'text-red-500' : ''}`} onClick={() => handleLikeComment(comment.id)}>
                          <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} /> {comment.likes}
                        </Button>
                        {comment.userId === userId && (
                          <Button variant="ghost" size="sm" className="p-1 text-red-500" onClick={() => handleDeleteComment(comment.id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <DialogFooter className="mt-4">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddComment() }}
                disabled={commentLoading}
              />
              <Button onClick={handleAddComment} disabled={commentLoading || !newComment.trim()}>
                Post
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
