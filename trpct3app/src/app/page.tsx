import { ArrowRight, Code, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import { auth } from "~/server/auth";
import { Button } from "./_components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen">
      {/* Background image without blur */}
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
    
      <header className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold text-white">CodeMuse</span>
          </div>

        </div>
      </header>
   
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 backdrop-blur-sm">
              <span className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Developer Inspiration
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
              Code<span className="text-emerald-600 relative">
                Muse
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered code inspiration engine. Get personalized project ideas based on your GitHub activity and
              tech preferences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session && (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-emerald-700/20 hover:border-emerald-500/50 transition-all duration-300 w-full sm:w-auto group"
                  >
                    <Link href="/dashboard" className="flex items-center">
                      Try Demo
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </>
              )}

              <Button
                asChild
                size="lg"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 w-full sm:w-auto relative overflow-hidden group"
              >
                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className="flex items-center"
                >
                  <span className="relative z-10 flex items-center">
                    {session ? "Sign out" : "Sign in with GitHub"}
                    <Github className="ml-2 h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </Button>
            </div>

            {/* Stats with improved styling */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
              <div className="flex flex-col items-center group">
                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">500+</div>
                <div className="text-sm text-white/60">Project Ideas</div>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="flex flex-col items-center group">
                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">10k+</div>
                <div className="text-sm text-white/60">Developers</div>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="flex flex-col items-center group">
                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">25+</div>
                <div className="text-sm text-white/60">Tech Stacks</div>
              </div>
            </div>

            

            
          </div>
        </div>
      </section>
    </div>
  );
}