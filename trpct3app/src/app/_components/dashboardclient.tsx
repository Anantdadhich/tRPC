"use client";

import { api } from "~/trpc/react";
import { Card } from "./ui/card";
import { AISuggestions } from "./ai-suggestions";
import { Code,  Cpu,  Code2,  ChevronDown, Clock, Tag, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useRef, } from "react";

export default function DashboardClient() {
  const { data: suggestions, isLoading } = api.suggestion.getByUser.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const suggestionsRef = useRef(null);
  
  // Filter suggestions based on search term
  const filteredSuggestions = suggestions?.filter(suggestion => 
    suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToSuggestions = () => {
    if (suggestionsRef.current) {
      (suggestionsRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/github-rJ1M26aWZ1YVK7QRbm60rVYeqAruED.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
      </div>

      {/* Animated particles overlay */}
      <div className="fixed inset-0 z-1 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
        <div className="absolute top-1/6 left-2/3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <div className="absolute top-5/6 left-1/6 w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Code className="h-6 w-6 text-emerald-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <Link href="/">
              <span className="text-xl font-bold text-white">CodeMuse</span>
            </Link>
          </div>
          <Link
            href="/"
            className="flex items-center text-sm text-white/80 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero section with full height */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 backdrop-blur-sm">
              <span className="flex items-center">
                <Cpu className="h-4 w-4 mr-2" />
                Dashboard
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
              Your AI-Powered <span className="text-emerald-500">Inspiration</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Generate tailored project ideas based on your tech preferences and GitHub activity.
              Let CodeMuse spark your next coding adventure.
            </p>
            
            <div className="mb-8">
              <AISuggestions />
            </div>
            
            <div 
              onClick={scrollToSuggestions} 
              className="animate-bounce mt-12 cursor-pointer mx-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-emerald-500/20 transition-colors"
            >
              <ChevronDown className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Previous suggestions section */}
      <section ref={suggestionsRef} className="relative z-10 min-h-screen py-20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
                <span className="relative">
                  Previous Suggestions
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-full"></span>
                </span>
              </h2>
              
              
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                <p className="mt-4 text-white">Loading your suggestions...</p>
              </div>
            ) : !suggestions || suggestions.length === 0 ? (
              <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Code2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No suggestions yet</h3>
                <p className="text-white/70">Generate your first project idea using the form above.</p>
              </div>
            ) : (
              <>
                <p className="text-white/60 mb-6">
                  {filteredSuggestions?.length} {filteredSuggestions?.length === 1 ? 'suggestion' : 'suggestions'} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggestions?.map((suggestion) => (
                    <Card 
                      key={suggestion.id} 
                      className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/10 group"
                    >
                      <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{suggestion.title}</h3>
                      <p className="text-sm opacity-80 mt-2">{suggestion.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {suggestion.tags.split(",").map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-white/60 text-xs">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {suggestion.createdAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.createdAt.toLocaleTimeString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
            
          
          </div>
        </div>
      </section>

      <audio autoPlay loop hidden>
        <source src="/interstellar.mp3" type="audio/mp3"></source>
      </audio>
    </div>
  );
}