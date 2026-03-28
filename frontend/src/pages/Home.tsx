import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  Search, 
  Bell, 
  Moon, 
  Sun,
  Plus,
  ArrowUpRight,
  Clock,
  LogOut,
  Menu,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Wand2
} from 'lucide-react';
import { env } from '../config/env';
import { useTheme } from '../contexts/ThemeContext';
import { useUser, getInitials } from '../contexts/UserContext';

const BrandLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="22" cy="22" r="8" fill="currentColor" fillOpacity="0.2" />
    <rect x="14" y="2" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="14" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="2" width="16" height="16" rx="6" fill="currentColor" />
  </svg>
);



export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true, path: '/' },
    { icon: Wand2, label: 'Sketch to UI', path: '/sketch' },
    { icon: Layers, label: 'Projects', path: '/' },
    { icon: Clock, label: 'Schedule', path: '/' },
    { icon: Settings, label: 'Settings', path: '/' },
  ];

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-500">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-white/[0.02] border-r border-zinc-200 dark:border-white/[0.05] flex flex-col z-[70] transition-all duration-500 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
        <div className={`p-6 flex items-center justify-between text-zinc-900 dark:text-zinc-200 mb-2 ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-none flex items-center justify-center shadow-lg dark:shadow-none shadow-zinc-900/20 dark:shadow-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0">
              <BrandLogo className="w-5 h-5" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold tracking-tight whitespace-nowrap transition-all duration-500 opacity-100"> {env.appName}</span>}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-none transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Collapse Toggle - Desktop Only */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-12 w-6 h-6 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-none items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-sm dark:shadow-none transition-all duration-300 z-10"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex-1 px-4 space-y-8 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
          <nav className="space-y-1.5">
            {!isCollapsed && <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-400 mb-4 opacity-60 transition-opacity duration-500">Main Menu</p>}
            {navItems.map((item, i) => (
              <button 
                key={i}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-all duration-300 group ${item.active ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border border-zinc-900 dark:border-white/[0.1] shadow-md dark:shadow-none' : 'text-zinc-500 border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98]'} ${isCollapsed ? 'justify-center lg:px-0' : ''}`}
              >
                <item.icon className={`w-5 h-5 transition-all duration-300 shrink-0 ${item.active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
                {!isCollapsed && <span className="transition-all duration-500 opacity-100 whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>

          <nav className="space-y-1.5">
            {!isCollapsed && <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-400 mb-4 opacity-60 transition-opacity duration-500">Support</p>}
            <button 
              title={isCollapsed ? 'Help Center' : ''}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium text-zinc-500 border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98] transition-all duration-300 group ${isCollapsed ? 'justify-center lg:px-0' : ''}`}
            >
              <HelpCircle className="w-5 h-5 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shrink-0" />
              {!isCollapsed && <span className="transition-all duration-500 opacity-100 whitespace-nowrap">Help Center</span>}
            </button>
            <button 
              onClick={handleLogout}
              title={isCollapsed ? 'Logout' : ''}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium text-rose-500 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 active:scale-[0.98] group ${isCollapsed ? 'justify-center lg:px-0' : ''}`}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              {!isCollapsed && <span className="transition-all duration-500 opacity-100 whitespace-nowrap">Logout</span>}
            </button>
          </nav>
        </div>

        <div className={`p-6 mt-auto border-t border-zinc-100 dark:border-white/[0.05] ${isCollapsed ? 'lg:p-4 lg:px-2' : ''}`}>
          <button 
            onClick={() => navigate('/profile')}
            title={isCollapsed ? `${user?.firstName} ${user?.lastName}` : ''}
            className={`w-full flex items-center gap-3 group p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.98] ${isCollapsed ? 'justify-center lg:p-1' : ''}`}
          >
            <div className={`rounded-none overflow-hidden border-2 border-white dark:border-[#0a0a0a] shadow-md dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shrink-0 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`}>
              {getInitials(user)}
            </div>
            {!isCollapsed && (
              <>
                <div className="text-left flex-1 min-w-0 transition-all duration-500 opacity-100">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 truncate uppercase tracking-wider">{user?.jobTitle}</p>
                </div>
                <div className="w-8 h-8 rounded-none bg-white dark:bg-white/[0.02] flex items-center justify-center shadow-sm dark:shadow-none border border-zinc-100 dark:border-white/[0.05] group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500 shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`min-h-screen flex flex-col transition-all duration-500 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-40 w-full bg-zinc-50/80 dark:bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.05] transition-colors duration-500">
          <div className="px-4 sm:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-white/[0.05] rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all duration-300 shadow-sm dark:shadow-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.96]"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.96] relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-zinc-50 dark:border-black" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-none text-sm font-semibold border border-zinc-900 dark:border-white/[0.1] hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 active:scale-[0.98]">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/sketch')}
              className="md:col-span-3 bg-zinc-900 dark:bg-white border border-zinc-900 dark:border-white/[0.1] p-8 rounded-none transition-all duration-500 hover:shadow-xl dark:shadow-none hover:shadow-zinc-900/20 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 dark:bg-black/10 rounded-none flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Wand2 className="w-6 h-6 text-white dark:text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white dark:text-black mb-2">Sketch to UI</h3>
                  <p className="text-zinc-400 dark:text-zinc-600 max-w-md">
                    Transform your hand-drawn wireframes into production-ready React code instantly using AI.
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-none border border-white/20 dark:border-black/20 text-white dark:text-black group-hover:bg-white dark:group-hover:bg-black group-hover:text-zinc-900 dark:group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
}
