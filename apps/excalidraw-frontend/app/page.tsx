import "./globals.css";
import Link from "next/link";
import { Brush, MousePointer, Users, Zap } from 'lucide-react';

// <Link href={"/signup"}>Sign in</Link>

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-indigo-900/20 rounded-full filter blur-3xl animate-pulse" 
             style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-purple-700/10 rounded-full filter blur-3xl animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      </div>
      
      {/* Header/Nav */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-purple-400">
          <Brush size={28} className="animate-pulse" />
          <span className="text-xl font-bold">DoodleSync</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <button className="px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors">
              Sign in
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition-colors">
              Sign up
            </button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-16 md:pt-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Collaborate and create <span className="text-purple-400">together</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            The easiest way to draw with your team in real-time. Perfect for brainstorming, wireframing, or just having fun.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg transition-colors text-lg shadow-lg shadow-purple-900/30 group">
                <span className="flex items-center gap-2">
                  Get started for free 
                  <Zap size={18} className="group-hover:animate-pulse" />
                </span>
              </button>
            </Link>
            <Link href="/signin">
              <button className="px-8 py-3 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-purple-400 rounded-lg transition-all text-lg backdrop-blur-sm hover:bg-purple-900/10">
                Sign in
              </button>
            </Link>
          </div>
        </div>
        
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-purple-800 transition-all group hover:bg-gray-800/50 hover:shadow-lg hover:shadow-purple-900/20">
            <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
              <MousePointer size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Intuitive Interface</h3>
            <p className="text-gray-400">Start drawing immediately with our easy-to-use tools designed for all skill levels.</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-purple-800 transition-all group hover:bg-gray-800/50 hover:shadow-lg hover:shadow-purple-900/20">
            <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
              <Users size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Collaboration</h3>
            <p className="text-gray-400">See changes instantly as your team works together on the same canvas from anywhere.</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-purple-800 transition-all group hover:bg-gray-800/50 hover:shadow-lg hover:shadow-purple-900/20">
            <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
              <Zap size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Built with performance in mind, ensuring a smooth experience on any device.</p>
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-2xl mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-80"></div>
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="relative z-10 p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to start creating together?</h2>
            <p className="text-lg text-purple-200 mb-6">Join thousands of teams already using DoodleSync to bring their ideas to life.</p>
            <Link href="/signup">
              <button className="px-8 py-3 bg-white text-purple-900 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                Start your free trial
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800 mt-20 text-center text-gray-500 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brush size={20} className="text-purple-600" />
            <span className="text-sm">DoodleSync © {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-sm hover:text-purple-400 transition-colors">Terms</a>
            <a href="#" className="text-sm hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="text-sm hover:text-purple-400 transition-colors">Help</a>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse {
          animation: pulse 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
