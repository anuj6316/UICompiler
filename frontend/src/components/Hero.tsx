import React from 'react';
import { ArrowRight, Box, Layout, MousePointer2, Shield, Zap, Moon, Sun } from 'lucide-react';
import { env } from '../config/env';

const BrandLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="22" cy="22" r="8" fill="currentColor" fillOpacity="0.2" />
    <rect x="14" y="2" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="14" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="2" width="16" height="16" rx="6" fill="currentColor" />
  </svg>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-6 transition-colors duration-500 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-3 transition-colors duration-500">{title}</h3>
    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors duration-500">
      {description}
    </p>
  </div>
);

export default function Hero({ onLogout, onProfileOpen, isDark, toggleTheme }: { onLogout?: () => void, onProfileOpen: () => void, isDark: boolean, toggleTheme: () => void }) {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 transition-colors duration-500">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-zinc-50/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-500">
            <BrandLogo className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight">{env.appName}</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500">Features</a>
          <button 
            onClick={onProfileOpen}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500"
          >
            Profile
          </button>
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500">Documentation</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all duration-500"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={onLogout}
            className="hidden sm:block text-sm font-semibold px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 hover:shadow-lg transition-all duration-500"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-4 transition-colors duration-500">
            <span className="flex h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            V2.0 is now live
          </div>
          
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.05] max-w-4xl mx-auto transition-colors duration-500">
            Crafting interfaces <br className="hidden md:block" /> with <span className="text-zinc-400 dark:text-zinc-600">tactile precision.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed transition-colors duration-500">
            A high-fidelity design system and component library built for modern software teams who value aesthetics, speed, and standard consistency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-900 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-2">
              Explore Library
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-500">
              View Components
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Layout} 
            title="Sculpted Blocks" 
            description="Pre-built, high-fidelity UI blocks designed to be both beautiful and functionally solid." 
          />
          <FeatureCard 
            icon={Zap} 
            title="Rapid Workflow" 
            description="Accelerate your production cycle with components that snap into place perfectly every time." 
          />
          <FeatureCard 
            icon={MousePointer2} 
            title="Tactile Control" 
            description="Interactive states that feel physical and responsive, enhancing the user experience." 
          />
          <FeatureCard 
            icon={Box} 
            title="3D Primitives" 
            description="Incorporate abstract 3D elements and layouts with built-in support for high-end visuals." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Design Logic" 
            description="A cohesive set of rules that ensure every pixel of your application feels intentional." 
          />
          <div className="relative bg-zinc-900 dark:bg-zinc-50 rounded-2xl p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white dark:text-zinc-900 mb-2 transition-colors duration-500">Ready to start?</h3>
              <p className="text-zinc-400 dark:text-zinc-500 transition-colors duration-500">Join 10,000+ designers building with UICompiler.</p>
            </div>
            <button className="relative z-10 w-fit px-6 py-2.5 mt-8 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-full font-bold text-sm hover:opacity-90 transition-all duration-500">
              Get Started
            </button>
            {/* Abstract Background Element */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 dark:bg-zinc-900/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </section>

        {/* Placeholder for Main Content */}
        <section className="mt-32 border-t border-zinc-200 dark:border-zinc-800 pt-32">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 lg:p-24 text-center space-y-6 transition-all duration-500">
            <h2 className="text-3xl lg:text-5xl font-medium tracking-tight transition-colors duration-500">Focus on the big picture.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto transition-colors duration-500">
              We've handled the micro-interactions, accessibility, and theme transitions. You build the features that matter to your users.
            </p>
            <div className="pt-8">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mx-auto flex items-center justify-center transition-colors duration-500">
                <Layout className="w-10 h-10 text-zinc-300 dark:text-zinc-700 transition-colors duration-500" />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-6 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <BrandLogo className="w-6 h-6" />
            <span className="font-bold tracking-tight">{env.appName}</span>
          </div>
          <p className="text-sm text-zinc-400">© 2026 {env.appName} Design Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500">Twitter</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500">GitHub</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500">Discord</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
