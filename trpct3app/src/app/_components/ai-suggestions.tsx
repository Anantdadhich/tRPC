"use client"

import { api } from "~/trpc/react" // Make sure this path is correct for your project
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { useState } from "react"
import { Alert, AlertDescription } from "./ui/alert"
import {
  AlertCircle,

  RefreshCcwIcon,
  Sparkles,
  Code,
  Clock,
  Award,
  BookOpen,
  Zap,
  ArrowRight,
  Github,
  Laptop,
  CheckCircle,
  Share2,
  Download,
  Save
} from "lucide-react"
import { Badge } from "./ui/badge"
import { motion, AnimatePresence } from "framer-motion"

// Define the expected shape of the AI suggestion data
interface AISuggestionData {
  name: string
  description: string
  technologies: string[]
  learningOutcomes: string[]
  difficulty: string
  portfolioValue: string
  estimatedTime: string
  nextSteps: string[]
  id?: string
}

export function AISuggestions() {
  const { mutate, isPending, error, data } = api.suggestion.createSuggestion.useMutation()
  const [hasTriggered, setHasTriggered] = useState(false)
  const [savedToast, setSavedToast] = useState(false)

  // Function to handle the button click
  const handleGenerateClick = () => {
    setHasTriggered(true)
    mutate()
  }

  // Show saved toast for 3 seconds
  const showSavedConfirmation = () => {
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  // --- Render Logic based on Mutation State ---

  // 1. Initial state (before the button is clicked)
  if (!hasTriggered) {
    return (
      <Card className="bg-black/60 border border-emerald-500/20 text-white overflow-hidden backdrop-blur-sm relative group transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/6 w-2 h-2 rounded-full bg-emerald-400 animate-pulse opacity-30"></div>
        <div className="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse opacity-40"></div>
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl group-hover:text-emerald-400 transition-colors">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            AI Project Suggestions
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Get personalized project suggestions based on your GitHub activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">
            Our AI will analyze your GitHub repositories, languages, and coding patterns to suggest projects that will
            help you grow as a developer and build an impressive portfolio.
          </p>
          <Button
            onClick={handleGenerateClick}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white relative overflow-hidden group hover:scale-100 transition-all duration-150 hover:cursor-pointer"
            size="lg"
          >
            <span className="relative z-10 flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Project Suggestion
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
          
          {/* Tech stack icons */}
          <div className="flex justify-center mt-8 gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Github className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Code className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Laptop className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 2. Loading state (while the mutation is running)
  if (isPending) {
    return (
      <Card className="bg-black/60 border border-emerald-500/20 text-white overflow-hidden backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/6 w-2 h-2 rounded-full bg-emerald-400 animate-pulse opacity-30"></div>
        <div className="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse opacity-40"></div>
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              AI Project Suggestions
            </CardTitle>
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
          </div>
          <CardDescription className="text-gray-300 text-base">
            Generating your personalized project suggestion... This might take a moment while fetching GitHub data and
            analyzing your tech profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-black/30 p-6 rounded-lg border border-white/10">
            <Skeleton className="h-8 w-2/3 bg-white/10" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-5 w-full bg-white/10" />
              <Skeleton className="h-5 w-[90%] bg-white/10" />
              <Skeleton className="h-5 w-[85%] bg-white/10" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-32 bg-white/10" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-full bg-white/10" />
              <Skeleton className="h-8 w-24 rounded-full bg-white/10" />
              <Skeleton className="h-8 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-8 w-28 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-36 bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
                <Skeleton className="h-5 w-[80%] bg-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
                <Skeleton className="h-5 w-[70%] bg-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
                <Skeleton className="h-5 w-[75%] bg-white/10" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-24 bg-white/10 rounded-lg" />
            <Skeleton className="h-24 bg-white/10 rounded-lg" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-32 bg-white/10" />
            </div>
            <Skeleton className="h-12 w-full bg-white/10 rounded-lg" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-40 bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Skeleton className="h-5 w-5 mt-1 bg-white/10" />
                <Skeleton className="h-5 w-[90%] bg-white/10" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-5 w-5 mt-1 bg-white/10" />
                <Skeleton className="h-5 w-[85%] bg-white/10" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-5 w-5 mt-1 bg-white/10" />
                <Skeleton className="h-5 w-[80%] bg-white/10" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 flex-1 bg-white/10 rounded-lg" />
            <Skeleton className="h-12 flex-1 bg-white/10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 3. Error state (if the mutation failed)
  if (error) {
    return (
      <Card className="bg-black/60 border border-red-500/20 text-white overflow-hidden backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertCircle className="h-6 w-6 text-red-400" />
            AI Project Suggestions
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            There was an issue generating your suggestion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-950/50 border-red-500/30 text-white mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message || "An unknown error occurred. Please try again."}</AlertDescription>
          </Alert>
          
          <p className="text-gray-300 mb-6">
            This could be due to GitHub API limitations, connectivity issues, or our AI service being temporarily unavailable.
            Please try again in a moment.
          </p>
          
          <Button
            onClick={handleGenerateClick}
            className="w-full bg-red-500 hover:bg-red-600 text-white relative overflow-hidden group"
            size="lg"
            disabled={isPending}
          >
            <span className="relative z-10 flex items-center">
              <RefreshCcwIcon className="mr-2 h-5 w-5" /> Try Again
            </span>
            <span className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 4. Success state (if the mutation succeeded)
  const suggestion = data?.suggestion as AISuggestionData | undefined

  // Fallback if data somehow null/undefined after success
  if (!suggestion) {
    return (
      <Card className="bg-black/60 border border-red-500/20 text-white overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertCircle className="h-6 w-6 text-red-400" />
            AI Project Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-950/50 border-red-500/30 text-white mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              An unexpected error occurred after generation. No suggestion data available.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleGenerateClick} 
            className="w-full bg-red-500 hover:bg-red-600 text-white relative overflow-hidden group"
            size="lg"
          >
            <span className="relative z-10 flex items-center">
              <RefreshCcwIcon className="mr-2 h-5 w-5" /> Try Again
            </span>
            <span className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase()
    if (lowerDifficulty.includes("beginner")) return "text-green-400"
    if (lowerDifficulty.includes("intermediate")) return "text-yellow-400"
    if (lowerDifficulty.includes("advanced")) return "text-red-400"
    return "text-blue-400"
  }

  // Get portfolio value color
  const getPortfolioValueColor = (value: string) => {
    const lowerValue = value.toLowerCase()
    if (lowerValue.includes("high")) return "text-emerald-400"
    if (lowerValue.includes("medium")) return "text-yellow-400"
    if (lowerValue.includes("low")) return "text-gray-400"
    return "text-blue-400"
  }

  // Get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase()
    if (lowerDifficulty.includes("beginner")) return <Zap className="h-5 w-5 text-green-400" />
    if (lowerDifficulty.includes("intermediate")) return <Zap className="h-5 w-5 text-yellow-400" />
    if (lowerDifficulty.includes("advanced")) return <Zap className="h-5 w-5 text-red-400" />
    return <Zap className="h-5 w-5 text-blue-400" />
  }

  // Get portfolio value icon
  const getPortfolioValueIcon = (value: string) => {
    const lowerValue = value.toLowerCase()
    if (lowerValue.includes("high")) return <Award className="h-5 w-5 text-emerald-400" />
    if (lowerValue.includes("medium")) return <Award className="h-5 w-5 text-yellow-400" />
    if (lowerValue.includes("low")) return <Award className="h-5 w-5 text-gray-400" />
    return <Award className="h-5 w-5 text-blue-400" />
  }

  return (
    <Card className="bg-black/60 border border-emerald-500/20 text-white overflow-hidden backdrop-blur-sm relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
      
      {/* Animated particles */}
      <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse opacity-50"></div>
      <div className="absolute bottom-1/3 right-1/6 w-2 h-2 rounded-full bg-emerald-400 animate-pulse opacity-30"></div>
      <div className="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse opacity-40"></div>
      
      {/* Saved notification toast */}
      <AnimatePresence>
        {savedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-50 bg-emerald-900/80 border border-emerald-500/30 text-white px-4 py-2 rounded-md shadow-lg backdrop-blur-sm flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-sm">Project saved!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              AI Project Suggestion
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Personalized project suggestion based on your GitHub activity
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            onClick={showSavedConfirmation}
          >
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Project Name and Description */}
        <div className="bg-black/30 p-6 rounded-lg border border-white/10 hover:border-emerald-500/30 transition-colors duration-300 group">
          <h3 className="text-2xl font-bold text-emerald-400 mb-3 group-hover:scale-[1.02] transition-transform duration-300">
            {suggestion.name}
          </h3>
          <p className="text-gray-300 leading-relaxed">{suggestion.description}</p>
        </div>

        {/* Technologies */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium flex items-center gap-2 text-white">
            <Code className="h-5 w-5 text-emerald-400" />
            Technologies
          </h4>
          <div className="flex flex-wrap gap-3">
            {suggestion.technologies.map((tech: string, idx: number) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Badge
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-full text-sm font-medium hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105 cursor-default"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            What You'll Learn
          </h4>
          <ul className="space-y-2 text-gray-300">
            {suggestion.learningOutcomes.map((outcome: string, index: number) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-emerald-400 mt-1">•</span>
                <span>{outcome}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Difficulty & Portfolio Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-5 rounded-lg border border-white/10 hover:border-emerald-500/30 transition-colors duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group">
            <h4 className="text-lg font-medium flex items-center gap-2 text-white mb-3">
              <Zap className="h-5 w-5 text-emerald-400" />
              Difficulty
            </h4>
            <div className="flex items-center gap-2">
              {getDifficultyIcon(suggestion.difficulty)}
              <span className={`text-lg font-medium ${getDifficultyColor(suggestion.difficulty)} group-hover:scale-105 transition-transform duration-300`}>
                {suggestion.difficulty}
              </span>
            </div>
          </div>
          <div className="bg-black/30 p-5 rounded-lg border border-white/10 hover:border-emerald-500/30 transition-colors duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group">
            <h4 className="text-lg font-medium flex items-center gap-2 text-white mb-3">
              <Award className="h-5 w-5 text-emerald-400" />
              Portfolio Value
            </h4>
            <div className="flex items-center gap-2">
              {getPortfolioValueIcon(suggestion.portfolioValue)}
              <span className={`text-lg font-medium ${getPortfolioValueColor(suggestion.portfolioValue)} group-hover:scale-105 transition-transform duration-300`}>
                {suggestion.portfolioValue}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-emerald-400" />
            Estimated Time
          </h4>
          <div className="bg-black/30 p-4 rounded-lg border border-white/10 hover:border-emerald-500/30 transition-colors duration-300 group flex items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-gray-300">{suggestion.estimatedTime}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Suggested Next Steps
          </h4>
          <div className="bg-black/30 p-5 rounded-lg border border-white/10 hover:border-emerald-500/30 transition-colors duration-300">
            <ol className="space-y-3 text-gray-300">
              {suggestion.nextSteps.map((step: string, index: number) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <span className="text-sm text-emerald-400 font-medium">{index + 1}</span>
                  </div>
                  <span>{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={handleGenerateClick}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white relative overflow-hidden group"
            size="lg"
            disabled={isPending}
          >
            <span className="relative z-10 flex items-center">
              <RefreshCcwIcon className="mr-2 h-5 w-5" /> Generate Another
            </span>
            <span className="absolute inset-0 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
          
          {suggestion.name && (
            <Button
              onClick={() =>
                window.open(`https://github.com/new?template=${encodeURIComponent(suggestion.name)}`, "_blank")
              }
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white relative overflow-hidden group"
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                <Github className="mr-2 h-5 w-5" /> Create GitHub Repo
              </span>
              <span className="absolute inset-0 bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Button>
          )}
        </div>
        
        {/* Share and download buttons */}
        <div className="flex gap-3 justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: suggestion.name,
                  text: suggestion.description,
                  url: window.location.href,
                }).catch((err) => console.error('Error sharing:', err));
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => {
              const dataStr = JSON.stringify(suggestion, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href", dataUri);
              downloadAnchorNode.setAttribute("download", `${suggestion.name.replace(/\s+/g, '-').toLowerCase()}.json`);
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}