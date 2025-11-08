"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Loader2 } from "lucide-react"
import { clubsAPI } from "@/lib/api"
import type { Club } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface ClubLeaderboardProps {
  topN?: number
}

export function ClubLeaderboard({ topN = 3 }: ClubLeaderboardProps) {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadTopClubs()
  }, [])

  const loadTopClubs = async () => {
    try {
      setLoading(true)
      const data = await clubsAPI.getAll()
  
      const sortedClubs = data.sort((a, b) => b.totalEvents * b.rating - a.totalEvents * a.rating).slice(0, topN)
      setClubs(sortedClubs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load club leaderboard. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />
      case 2:
        return <Award className="w-4 h-4 text-orange-500" />
      default:
        return (
          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
        )
    }
  }

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading leaderboard...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl overflow-hidden relative">
      {/* 3D Trophy and Sparkles */}
      <div className="flex flex-col items-center pt-6 pb-2 relative">
        {/* 3D Trophy SVG */}
        <div className="relative">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="drop-shadow-2xl animate-trophy-bounce">
            <defs>
              <radialGradient id="trophyGold" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fffbe6" />
                <stop offset="60%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </radialGradient>
              <radialGradient id="trophyBase" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#a3a3a3" />
              </radialGradient>
            </defs>
            <ellipse cx="32" cy="60" rx="18" ry="4" fill="#eab308" opacity="0.18" />
            <rect x="22" y="48" width="20" height="8" rx="3" fill="url(#trophyBase)" />
            <rect x="26" y="44" width="12" height="8" rx="2" fill="#eab308" />
            <ellipse cx="32" cy="44" rx="12" ry="6" fill="#fde68a" />
            <path d="M16 16 Q8 32 32 44 Q56 32 48 16" fill="url(#trophyGold)" stroke="#eab308" strokeWidth="2" />
            <ellipse cx="32" cy="20" rx="16" ry="12" fill="url(#trophyGold)" stroke="#eab308" strokeWidth="2" />
            <ellipse cx="32" cy="20" rx="10" ry="7" fill="#fffde4" opacity="0.7" />
            <ellipse cx="32" cy="16" rx="4" ry="2" fill="#fff" opacity="0.7" />
          </svg>
          {/* Animated Sparkles */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="block w-2 h-2 bg-yellow-300 rounded-full animate-sparkle1 opacity-80"></span>
            <span className="block w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle2 opacity-70 absolute left-6 top-2"></span>
            <span className="block w-1.5 h-1.5 bg-white rounded-full animate-sparkle3 opacity-60 absolute -left-6 top-3"></span>
          </div>
        </div>
        <CardTitle className="text-xl flex items-center gap-2 mt-2 font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Top Clubs
        </CardTitle>
      </div>
      <CardContent className="space-y-3 pb-4">
        {clubs.map((club, index) => (
          <div
            key={club.id}
            className={`flex flex-col md:flex-row items-center md:items-stretch space-y-2 md:space-y-0 md:space-x-3 p-3 rounded-2xl transition-all duration-300 ${
              index === 0
                ? 'bg-gradient-to-r from-yellow-100/80 to-yellow-200/60 dark:from-yellow-900/30 dark:to-yellow-800/20 shadow-2xl scale-105 border-2 border-yellow-300/60'
                : index === 1
                ? 'bg-gradient-to-r from-gray-100/80 to-gray-200/60 dark:from-gray-900/30 dark:to-gray-800/20 shadow-xl scale-100 border border-gray-300/40'
                : index === 2
                ? 'bg-gradient-to-r from-orange-100/80 to-orange-200/60 dark:from-orange-900/30 dark:to-orange-800/20 shadow-lg scale-100 border border-orange-300/40'
                : 'bg-white/70 dark:bg-gray-900/60 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 border border-gray-100/40 dark:border-gray-800/40'
            }`}
            style={{ boxShadow: index < 3 ? '0 8px 32px 0 rgba(250,204,21,0.18)' : undefined }}
          >
            <div className="flex flex-col items-center justify-center min-w-[80px]">
              <div
                className={`flex items-center justify-center font-bold mb-1 ${
                  index === 0
                    ? 'w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 ring-4 ring-yellow-200 shadow-2xl'
                    : index === 1
                    ? 'w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 ring-2 ring-gray-200 shadow-xl'
                    : index === 2
                    ? 'w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 ring-2 ring-orange-200 shadow-lg'
                    : 'w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {index === 0 ? (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <ellipse cx="16" cy="28" rx="10" ry="2" fill="#eab308" opacity="0.18" />
                    <ellipse cx="16" cy="12" rx="12" ry="10" fill="url(#trophyGold)" />
                    <ellipse cx="16" cy="12" rx="7" ry="5" fill="#fffde4" opacity="0.7" />
                    <ellipse cx="16" cy="9" rx="2" ry="1" fill="#fff" opacity="0.7" />
                  </svg>
                ) : index === 1 ? (
                  <Medal className="w-8 h-8 text-gray-400" />
                ) : index === 2 ? (
                  <Award className="w-8 h-8 text-orange-500" />
                ) : (
                  <span className="text-lg">{index + 1}</span>
                )}
              </div>
              <Avatar className={`mt-1 ${index < 3 ? 'w-12 h-12 ring-2 ring-yellow-200/80 dark:ring-yellow-700/60 shadow-lg' : 'w-10 h-10 ring-2 ring-gray-100 dark:ring-gray-700'}`}>
                <AvatarImage src={club.logoUrl || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                  {club.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start justify-center min-w-0 px-2">
              <p className={`${index < 3 ? 'text-lg font-bold' : 'text-base font-semibold'} text-center md:text-left break-words whitespace-normal leading-snug ${index < 3 ? 'text-yellow-700 dark:text-yellow-200' : 'text-gray-800 dark:text-gray-200'}`}>{club.name}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-gray-500 mt-1">
                <span>{club.totalEvents} events</span>
                <span>•</span>
                <span>⭐ {club.rating}</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end justify-center min-w-[40px]">
              <div className={`text-xs font-bold ${index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-500' : index === 2 ? 'text-orange-500' : 'text-emerald-600'}`}>#{index + 1}</div>
            </div>
          </div>
        ))}
      </CardContent>
      {/* Sparkle Animations */}
      <style jsx>{`
        @keyframes trophy-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-trophy-bounce { animation: trophy-bounce 2.2s infinite cubic-bezier(.4,2,.6,1); }
        @keyframes sparkle1 { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.4); } }
        .animate-sparkle1 { animation: sparkle1 1.6s infinite; }
        @keyframes sparkle2 { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 0.1; transform: scale(1.3); } }
        .animate-sparkle2 { animation: sparkle2 2.1s infinite; }
        @keyframes sparkle3 { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.2); } }
        .animate-sparkle3 { animation: sparkle3 1.8s infinite; }
      `}</style>
    </Card>
  )
}
