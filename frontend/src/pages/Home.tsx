import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Moon, Sun, Plus, ArrowUpRight, Clock, Menu, Wand2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none -z-0 rounded-b-[100px]" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}>
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] rounded-full blur-[100px] transition-colors duration-500" />
          <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-purple-500/[0.03] dark:bg-purple-500/[0.04] rounded-full blur-[120px] transition-colors duration-500" />
          <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-blue-500/[0.02] dark:bg-blue-500/[0.03] rounded-full blur-[80px] transition-colors duration-500" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200 transition-colors duration-500">
              Hello, {user?.firstName} 👋
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 transition-colors duration-500">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <Clock className="w-4 h-4" />
            Last updated: 5 mins ago
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div 
            onClick={() => navigate('/sketch')}
            className="md:col-span-3 bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-white/[0.08] p-8 rounded-none transition-all duration-500 shadow-xl shadow-zinc-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-zinc-200 dark:hover:shadow-none hover:border-zinc-300 dark:hover:border-white/[0.15] cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg className="absolute -bottom-2 left-0 w-full h-32 text-zinc-900 dark:text-white opacity-[0.03] dark:opacity-[0.06] transition-colors duration-500" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,40L60,50C120,60,240,80,360,85C480,90,600,80,720,65C840,50,960,30,1080,25C1200,20,1320,30,1380,35L1440,40L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
              </svg>
              <svg className="absolute -bottom-2 left-0 w-full h-24 text-zinc-900 dark:text-white opacity-[0.015] dark:opacity-[0.03] transition-colors duration-500" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,80L60,75C120,70,240,60,360,55C480,50,600,50,720,60C840,70,960,90,1080,95C1200,100,1320,90,1380,85L1440,80L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-white/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-all duration-700" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/5 dark:bg-transparent rounded-full blur-3xl translate-y-1/2 transition-all duration-700" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-zinc-100 dark:bg-white/[0.06] rounded-none flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 border border-zinc-200/50 dark:border-transparent">
                  <Wand2 className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-2 transition-colors duration-500">Sketch to UI</h3>
                <p className="text-zinc-500 dark:text-zinc-500 max-w-md transition-colors duration-500">
                  Transform your hand-drawn wireframes into production-ready React code instantly using AI.
                </p>
              </div>
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-none border border-zinc-200 dark:border-white/[0.1] text-zinc-400 dark:text-zinc-300 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-200 group-hover:text-white dark:group-hover:text-zinc-900 group-hover:border-zinc-900 dark:group-hover:border-transparent transition-all duration-300">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
