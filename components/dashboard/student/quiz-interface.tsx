"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle, XCircle, Trophy, Brain, Timer, ArrowRight, ArrowLeft, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface Quiz {
  id: number
  title: string
  clubName: string
  description: string
  duration: number // in minutes
  totalQuestions: number
  difficulty: "easy" | "medium" | "hard"
  category: string
  isActive: boolean
  attempts: number
  maxAttempts: number
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface QuizAttempt {
  quizId: number
  answers: { [questionId: number]: number }
  score: number
  totalPoints: number
  timeSpent: number
  completedAt: string
}

export function QuizInterface() {
  const [currentView, setCurrentView] = useState<"list" | "taking" | "results">("list")
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
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

    const fetchQuizzes = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("quizzes").select("*").eq("is_active", true)
      setQuizzes(data || [])
      setLoading(false)
    }
    fetchQuizzes()
  }, [])

  const startQuiz = async (quiz: any) => {
    setSelectedQuiz(quiz)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft((quiz.duration || 30) * 60)
    setQuizStarted(true)
    setQuizCompleted(false)
    setCurrentView("taking")
  
    const { data: qs } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quiz.id)
    setQuestions(qs || [])
    toast({
      title: "Quiz Started! 🚀",
      description: `You have ${quiz.duration} minutes to complete this quiz.`,
      variant: "success",
    })
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleQuizSubmit = async () => {
    if (!selectedQuiz) return
 
    let correctAnswers = 0
    let totalPoints = 0
    questions.forEach((question) => {
      totalPoints += 5 
      if (answers[question.id] === question.options.split(',').indexOf(question.correct_answer)) {
        correctAnswers++
      }
    })
    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)
    setCurrentView("results")

    if (userId && selectedQuiz) {
      await supabase.from("quiz_results").insert({
        quiz_id: selectedQuiz.id,
        user_id: userId,
        score: finalScore,
      })
    }
    toast({
      title: "Quiz Completed! 🎉",
      description: `You scored ${finalScore}% on ${selectedQuiz.title}`,
      variant: "success",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  if (currentView === "taking" && selectedQuiz) {
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <Card className="student-card-gradient mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{selectedQuiz.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400">by {selectedQuiz.clubName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                    <Timer className="w-4 h-4 text-red-600" />
                    <span className="font-mono font-bold text-red-600">{formatTime(timeLeft)}</span>
                  </div>
                  <Button variant="outline" onClick={handleQuizSubmit}>
                    <Flag className="w-4 h-4 mr-2" />
                    Submit Quiz
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="student-card-gradient mb-6">
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>
                <div className="space-y-3">
                  {(typeof currentQ.options === 'string' ? currentQ.options.split(',') : currentQ.options).map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        answers[currentQ.id] === index
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQ.id] === index
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {answers[currentQ.id] === index && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (currentQuestion === questions.length - 1) {
                      handleQuizSubmit()
                    } else {
                      setCurrentQuestion((prev) => prev + 1)
                    }
                  }}
                  className="student-button-primary"
                >
                  {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "results" && selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="student-card-gradient mb-6 text-center">
            <CardContent className="p-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedQuiz.title}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{score}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Final Score</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      Object.keys(answers).filter(
                        (qId) =>
                          answers[Number.parseInt(qId)] ===
                          questions.find((q) => q.id === Number.parseInt(qId))?.correctAnswer,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatTime(selectedQuiz.duration * 60 - timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="student-card mb-6">
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const userAnswer = answers[question.id]
                    const isCorrect = userAnswer === question.correctAnswer

                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mt-1" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Your answer: </span>
                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                  {question.options[userAnswer] || "Not answered"}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p>
                                  <span className="font-medium">Correct answer: </span>
                                  <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                                </p>
                              )}
                              <p className="text-gray-600 dark:text-gray-400 italic">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={() => setCurrentView("list")} className="student-button-primary">
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Club Quizzes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge with quizzes created by various clubs for recruitment and skill assessment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="student-card-gradient hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.clubName}</p>
                  </div>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{quiz.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-gray-500" />
                    <span>{quiz.totalQuestions} questions</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Category: {quiz.category}</span>
                  <span>
                    Attempts: {quiz.attempts}/{quiz.maxAttempts}
                  </span>
                </div>

                <Button
                  onClick={() => startQuiz(quiz)}
                  disabled={quiz.attempts >= quiz.maxAttempts || !quiz.isActive}
                  className="w-full student-button-primary"
                >
                  {quiz.attempts >= quiz.maxAttempts ? "Max Attempts Reached" : "Start Quiz"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
