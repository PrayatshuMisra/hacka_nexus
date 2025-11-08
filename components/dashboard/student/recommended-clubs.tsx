"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Calendar, Loader2 } from "lucide-react"
import { clubsAPI } from "@/lib/api"
import { clubMembershipsAPI } from "@/lib/club-api"
import type { Club } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function RecommendedClubs() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const [openModal, setOpenModal] = useState<{ club: Club | null; type: 'join' | 'apply' | null }>({ club: null, type: null })
  const [appForm, setAppForm] = useState({ name: '', why: '' })
  const [showAll, setShowAll] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data')
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          setUserId(parsed.id)
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadRecommendedClubs()
    }
  }, [userId])

  const loadRecommendedClubs = async () => {
    try {
      setLoading(true)
      const data = await clubsAPI.getRecommended(1) // Mock user ID
      setClubs(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recommended clubs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (clubId: number) => {
    try {
      const club = clubs.find((c) => c.id === clubId)
      if (!club) return

      if (club.isFollowing) {
        await clubsAPI.unfollow(clubId, 1)
      } else {
        await clubsAPI.follow(clubId, 1)
      }

      setClubs((prev) => prev.map((c) => (c.id === clubId ? { ...c, isFollowing: !c.isFollowing } : c)))

      toast({
        title: club.isFollowing ? "Unfollowed" : "Following",
        description: `You ${club.isFollowing ? "unfollowed" : "are now following"} ${club.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading recommendations...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl mb-1 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-extrabold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" /> Recommended for You
        </CardTitle>
        <CardDescription className="mb-2 text-base text-gray-500 dark:text-gray-300">Based on your interests and department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {(showAll ? clubs : clubs.slice(0, 4)).map((club) => {
     
            let _club_tags: string[] = []
            if (Array.isArray(club.tags)) {
              _club_tags = club.tags
            } else if (typeof club.tags === 'string') {
              try {
         
                const parsed = JSON.parse(club.tags as string)
                if (Array.isArray(parsed)) {
                  _club_tags = parsed
                } else {
      
                  _club_tags = (club.tags as string).split(',').map((t: string) => t.trim())
                }
              } catch {
      
                _club_tags = (club.tags as string).split(',').map((t: string) => t.trim())
              }
            }
            const isTech = _club_tags.some(tag => ["tech", "ieee", "gdsc"].includes(tag.toLowerCase()))
            const actionType = isTech ? 'apply' : 'join'
            return (
              <Card
                key={club.id}
                className="border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-[1.025] rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-0"
                style={{ boxShadow: '0 4px 24px 0 rgba(52,211,153,0.07)' }}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex flex-wrap items-start gap-4 min-w-0">
                    <Avatar className="w-14 h-14 ring-2 ring-emerald-100 dark:ring-emerald-900 flex-shrink-0">
                      <AvatarImage src={club.logoUrl || "/placeholder.svg?height=48&width=48"} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                        {club.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg truncate mb-1">{club.name}</h4>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Users className="w-3 h-3 mr-1" />
                        {club.memberCount} members
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {_club_tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 w-full">
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span>{club.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{club.totalEvents} events</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={`text-xs bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-4 py-1 rounded-lg shadow font-semibold max-w-full whitespace-nowrap`}
                          style={{ minWidth: 90 }}
                          onClick={() => setOpenModal({ club, type: actionType })}
                        >
                          {actionType === 'apply' ? 'Apply' : 'Join'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {clubs.length > 4 && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowAll(v => !v)}>
                {showAll ? 'Show Less' : 'View All'}
              </Button>
            </div>
          )}
        </div>
        <Dialog open={!!openModal.club} onOpenChange={v => !v && setOpenModal({ club: null, type: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {openModal.type === 'apply' ? `Apply to ${openModal.club?.name}` : `Join ${openModal.club?.name}`}
              </DialogTitle>
              <DialogDescription>
                {openModal.type === 'apply'
                  ? 'Fill out the application form to apply.'
                  : 'Are you sure you want to join this club?'}
              </DialogDescription>
            </DialogHeader>
            {openModal.type === 'apply' ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!userId || !openModal.club) return;
                  setSubmitting(true);
                  try {
                    await clubMembershipsAPI.applyToClub(openModal.club.id, userId, appForm);
                    toast({ 
                      title: 'Application submitted!', 
                      description: `You have applied to ${openModal.club?.name}.`
                    });
                    setAppForm({ name: '', why: '' });
                  } catch (error: any) {
                    toast({ 
                      title: 'Failed to submit application', 
                      description: error.message || 'Please try again later.', 
                      variant: 'destructive' 
                    });
                  } finally {
                    setSubmitting(false);
                    setOpenModal({ club: null, type: null });
                  }
                }}
                className="space-y-4"
              >
                <Input
                  placeholder="Your Name"
                  value={appForm.name}
                  onChange={e => setAppForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <Input
                  placeholder="Why do you want to join?"
                  value={appForm.why}
                  onChange={e => setAppForm(f => ({ ...f, why: e.target.value }))}
                  required
                />
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <DialogFooter>
                <Button
                  disabled={submitting}
                  onClick={async () => {
                    if (!userId || !openModal.club) return;
                    setSubmitting(true);
                    try {
                      await clubMembershipsAPI.joinClub(openModal.club.id, userId);
                      toast({ 
                        title: 'Success!', 
                        description: `You have joined ${openModal.club.name}.`
                      });
                      loadRecommendedClubs(); // Refresh the clubs list
                    } catch (error: any) {
                      toast({ 
                        title: 'Failed to join club', 
                        description: error.message || 'Please try again later.', 
                        variant: 'destructive' 
                      });
                    } finally {
                      setSubmitting(false);
                      setOpenModal({ club: null, type: null });
                    }
                  }}
                >
                  {submitting ? 'Joining...' : 'Confirm Join'}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
