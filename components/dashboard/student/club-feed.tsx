"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Filter, Loader2 } from "lucide-react"
import { postsAPI } from "@/lib/api"
import type { Post as PostType, Comment as CommentType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FaWhatsapp, FaXTwitter, FaLinkedin, FaRegCopy } from "react-icons/fa6"

interface PostWithAnim extends PostType {
  _likeAnimating?: boolean
}

export function ClubFeed() {
  const [posts, setPosts] = useState<PostWithAnim[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const likeTimeouts = useRef<{ [key: number]: NodeJS.Timeout }>({})
  const [search, setSearch] = useState("")
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null)
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const [commentModal, setCommentModal] = useState<{ open: boolean; post: PostWithAnim | null }>({ open: false, post: null })
  const [comments, setComments] = useState<CommentType[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data')
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          setUserId(parsed.id)
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (userId) loadFeed()
  }, [userId])

  const loadFeed = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const data = await postsAPI.getFeed(userId)
      setPosts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: number) => {
    if (!userId) return
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
 
          const safeLikes = typeof post.likesCount === 'number' && !isNaN(post.likesCount) ? post.likesCount : 0;
          return {
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked ? safeLikes - 1 : safeLikes + 1,
            _likeAnimating: true,
          }
        }
        return post;
      })
    )

    clearTimeout(likeTimeouts.current[postId])
    likeTimeouts.current[postId] = setTimeout(() => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, _likeAnimating: false } : post
        )
      )
    }, 400)
    try {
      await postsAPI.like(postId, userId)

      loadFeed()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = (post: PostWithAnim) => {

    const url = typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : `/post/${post.id}`
    if (navigator.share) {
      navigator.share({
        title: post.club?.name || "Club Post",
        text: post.content,
        url,
      })
      return
    }

    toast({ title: "Share", description: "Choose a platform below." })
  }

  const shareTo = (platform: string, post: PostWithAnim) => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : `/post/${post.id}`)
    const text = encodeURIComponent(post.content)
    let shareUrl = ""
    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${text}%20${url}`
    } else if (platform === "x") {
      shareUrl = `https://x.com/intent/tweet?text=${text}&url=${url}`
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    } else if (platform === "copy") {
      navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : `/post/${post.id}`)
      toast({ title: "Link copied!", description: "Post link copied to clipboard." })
      return
    }
    if (typeof window !== 'undefined') {
      window.open(shareUrl, "_blank")
    }
  }

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Unknown time";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown time";

    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const dateIST = new Date(date.getTime() + istOffsetMs);
    const nowIST = new Date(Date.now() + istOffsetMs);
    const diffMs = nowIST.getTime() - dateIST.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffMins < 5) return "Just now";
    if (diffHours < 1) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  const handleBookmark = async (postId: number) => {
    setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post))
    try {
      await postsAPI.bookmark(postId, userId || 0)

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('saved-posts-updated'))
      }
    } catch {
      toast({ title: "Error", description: "Failed to save post.", variant: "destructive" })
    }
  }

  const extractHashtags = (content: string) => {
    return (content.match(/#\w+/g) || []).map((tag) => tag.toLowerCase())
  }
  const allHashtags = Array.from(new Set(posts.flatMap((p) => extractHashtags(p.content))))
  const allClubs = Array.from(new Set(posts.map((p) => p.club?.name).filter(Boolean)))

  const filteredPosts = posts.filter((post) => {
    const hashtags = extractHashtags(post.content)
    const matchesHashtag = !selectedHashtag || hashtags.includes(selectedHashtag)
    const matchesClub = !selectedClub || post.club?.name === selectedClub
    const matchesSearch =
      !search ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      (post.club?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      hashtags.some((tag) => tag.includes(search.toLowerCase()))
    return matchesHashtag && matchesClub && matchesSearch
  })

  const openComments = async (post: PostWithAnim) => {
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
    if (!newComment.trim() || !commentModal.post || !userId) return
    setCommentLoading(true)
    try {
      const comment = await postsAPI.addComment(commentModal.post.id, userId, newComment)
      setComments((prev) => [...prev, comment])
      setNewComment("")
 
      loadFeed()
    } finally {
      setCommentLoading(false)
    }
  }
  const handleLikeComment = async (commentId: number) => {
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c))
    await postsAPI.likeComment(commentId, userId || 0)
  }
  const handleDeleteComment = async (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    await postsAPI.deleteComment(commentId, userId || 0)
 
    loadFeed()
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading your feed...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-900/90 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-bold">Club Feed</CardTitle>
        <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 pb-0">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge
              key="all"
              variant={!selectedHashtag ? "default" : "secondary"}
              className={`cursor-pointer px-3 py-1 text-sm rounded-full ${!selectedHashtag ? 'ring-2 ring-emerald-500 bg-emerald-500 text-white' : ''}`}
              onClick={() => setSelectedHashtag(null)}
            >
              All Hashtags
            </Badge>
            {allHashtags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedHashtag === tag ? "default" : "secondary"}
                className={`cursor-pointer px-3 py-1 text-sm rounded-full ${selectedHashtag === tag ? 'ring-2 ring-emerald-500 bg-emerald-500 text-white' : ''}`}
                onClick={() => setSelectedHashtag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge
              key="allclubs"
              variant={!selectedClub ? "default" : "secondary"}
              className={`cursor-pointer px-3 py-1 text-sm rounded-full ${!selectedClub ? 'ring-2 ring-blue-500 bg-blue-500 text-white' : ''}`}
              onClick={() => setSelectedClub(null)}
            >
              All Clubs
            </Badge>
            {allClubs.map((club) => (
              <Badge
                key={club}
                variant={selectedClub === club ? "default" : "secondary"}
                className={`cursor-pointer px-3 py-1 text-sm rounded-full ${selectedClub === club ? 'ring-2 ring-blue-500 bg-blue-500 text-white' : ''}`}
                onClick={() => setSelectedClub(club || null)}
              >
                {club}
              </Badge>
            ))}
          </div>
          <div className="w-full md:w-64">
            <Input
              placeholder="Search posts, hashtags, clubs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm"
            />
          </div>
        </div>
        <ScrollArea className="h-[32rem]">
          <div className="space-y-8 p-6">
            {filteredPosts.map((post) => {
              const hashtags = extractHashtags(post.content)
              return (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3 mb-3 px-4 pt-4">
                    <Avatar className="ring-2 ring-emerald-100 dark:ring-emerald-900">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                        {post.club?.name?.slice(0, 2) || "CL"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{post.club?.name || "Club Name"}</h4>
                      <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed px-4">
                    {post.content}
                  </p>
                  {/* Hashtags as chips - moved outside <p> to avoid invalid nesting */}
                  <div className="flex flex-wrap gap-1 px-4 mb-2">
                    {hashtags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="ml-1 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                        onClick={() => setSelectedHashtag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="rounded-xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800 cursor-pointer group">
                      <img
                        src={post.imageUrls[0] || "/placeholder.svg?height=300&width=500"}
                        alt="Post content"
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between px-4 pb-4">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`relative hover:bg-red-50 dark:hover:bg-red-900/20 ${post.isLiked ? "text-red-500" : ""}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <span
                          className={`inline-block transition-transform duration-200 ${post._likeAnimating ? "scale-125" : ""}`}
                        >
                          <Heart className={`w-5 h-5 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                        </span>
                        <span className="font-semibold text-base">{typeof post.likesCount === 'number' && !isNaN(post.likesCount) ? post.likesCount : 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => openComments(post)}
                      >
                        <MessageCircle className="w-5 h-5 mr-1" />
                        Replies and Comments
                        <span className="ml-1 text-xs text-gray-400">({post.commentsCount})</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Share2 className="w-5 h-5 mr-1" />
                            Share
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="student-dropdown-bg min-w-[12rem]">
                          <DropdownMenuItem onClick={() => shareTo("whatsapp", post)}>
                            <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareTo("x", post)}>
                            <FaXTwitter className="mr-2 text-black dark:text-white" /> X (Twitter)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareTo("linkedin", post)}>
                            <FaLinkedin className="mr-2 text-blue-600" /> LinkedIn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareTo("copy", post)}>
                            <FaRegCopy className="mr-2" /> Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${post.isBookmarked ? 'text-emerald-500' : ''}`}
                      onClick={() => handleBookmark(post.id)}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        {/* Comments Modal */}
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
                        <AvatarFallback>{comment.userName ? comment.userName.slice(0, 2) : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{comment.userName || 'Unknown'}</span>
                          <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
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
      </CardContent>
    </Card>
  )
}
