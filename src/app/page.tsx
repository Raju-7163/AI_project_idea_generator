import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <header className="px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-lg">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight">Project Mentor</span>
        </div>
        <nav>
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link href="#features" className="hover:text-blue-600 transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link 
                href="/onboarding" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
          Turn your skills into the perfect <span className="text-blue-600">final-year project.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          An AI-powered platform that helps final-year students generate project ideas based on their interests, skills, and time constraints, while providing guidance on features, architecture, and development roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/onboarding" 
            className="bg-blue-600 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Find My Project Idea
          </Link>
          <Link 
            href="#how-it-works" 
            className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            How it Works
          </Link>
        </div>
      </main>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to build with confidence</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                💡
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Ideas</h3>
              <p className="text-gray-600">Get project recommendations that match your exact skill level, interests, and time availability.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm bg-gray-50">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🗺️
              </div>
              <h3 className="text-xl font-bold mb-2">Development Roadmaps</h3>
              <p className="text-gray-600">Break your project down into actionable phases, from requirements and database design to frontend polish.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm bg-gray-50">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🤖
              </div>
              <h3 className="text-xl font-bold mb-2">Contextual AI Mentor</h3>
              <p className="text-gray-600">Stuck on a bug or architectural decision? Ask your AI mentor that already understands your project context.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center">
        <p>© {new Date().getFullYear()} AI Project Mentor. Built for students.</p>
      </footer>
    </div>
  );
}
