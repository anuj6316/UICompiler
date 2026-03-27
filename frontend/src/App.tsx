import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, Moon, Sun, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { env } from './config/env';
import Hero from './components/Hero';
import Profile from './components/Profile';
import { api } from './services/api';

const BrandLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="22" cy="22" r="8" fill="currentColor" fillOpacity="0.2" />
    <rect x="14" y="2" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="14" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="2" width="16" height="16" rx="6" fill="currentColor" />
  </svg>
);

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (e) {
      console.error("Logout from server failed", e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      setIsProfileOpen(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required to send OTP");
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/send_otp/', { email });
      setIsVerifying(true);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isResetting) {
        // Handle Password Reset
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        await api.post('/auth/reset_password/', {
          email,
          otp: otp.join(''),
          new_password: password,
          confirm_password: confirmPassword
        });
        alert("Password reset successfully! Please login.");
        setIsResetting(false);
        setIsVerifying(false);
        setPassword('');
        setConfirmPassword('');
      } else if (isSignUp) {
        if (!isVerifying) {
          // Step 1: Request OTP for Signup
          await handleSendOtp();
        } else {
          // Step 2: Complete Signup with OTP
          const names = fullName.trim().split(' ');
          const first_name = names[0] || '';
          const last_name = names.slice(1).join(' ') || '';
          
          await api.post('/auth/signup/', {
            email,
            password,
            first_name,
            last_name,
            username: email, // Using email as username for consistency
            otp: otp.join('')
          });
          alert("Account created successfully! Please login.");
          setIsSignUp(false);
          setIsVerifying(false);
          setPassword('');
        }
      } else {
        // Handle Login
        const response: any = await api.post('/auth/login/', { email, password });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (isLoggedIn) {
    if (isProfileOpen) {
      return <Profile onBack={() => setIsProfileOpen(false)} />;
    }
    return (
      <Hero 
        onLogout={handleLogout} 
        onProfileOpen={() => setIsProfileOpen(true)}
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 transition-colors duration-500">
      
      {/* Left Panel */}
      <div className="hidden lg:flex relative w-1/2 bg-zinc-900 dark:bg-zinc-50 p-12 flex-col justify-between overflow-hidden transition-colors duration-500">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Abstract 3D" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-20 mix-blend-luminosity transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 dark:from-zinc-50/90 dark:via-zinc-50/20 to-transparent transition-colors duration-500" />

        <div className="relative z-10 flex items-center gap-3 text-white dark:text-zinc-900 transition-colors duration-500">
          <div className="w-10 h-10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500">
            <BrandLogo className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">{env.appName}</span>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl xl:text-5xl font-medium tracking-tight text-white dark:text-zinc-900 leading-[1.1] transition-colors duration-500">
            {isSignUp ? 'Start building your digital space.' : 'Welcome back to your workspace.'}
          </h1>
          <p className="text-zinc-400 dark:text-zinc-500 text-lg leading-relaxed transition-colors duration-500">
            Access premium tools, tactile controls, and high-fidelity design blocks to elevate your workflow.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between lg:justify-end items-center gap-6 z-10">
          <div className="flex lg:hidden items-center gap-2 text-zinc-900 dark:text-white transition-colors duration-500">
            <BrandLogo className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">{env.appName}</span>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[400px] space-y-8">
            <div className="space-y-2 text-center lg:text-left transition-colors duration-500">
              {isResetting && !isVerifying && (
                <button onClick={() => setIsResetting(false)} className="mb-4 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
              )}
              <h2 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-white transition-colors duration-500">
                {isResetting ? (isVerifying ? 'Create New Password' : 'Reset Password') 
                  : isVerifying ? 'Verify your email'
                  : isSignUp ? 'Create an account' : 'Sign in'}
              </h2>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
                {isResetting && !isVerifying ? 'Enter your email to receive a reset code.' : 
                 isVerifying ? 'Enter the 6-digit code sent to your email.' :
                 isSignUp ? 'Enter your details below to create your account' : 'Enter your email and password to access your account'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isVerifying && (
                <>
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-500 sm:text-sm" placeholder="Jane Doe" required />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-500 sm:text-sm" placeholder="name@company.com" required />
                    </div>
                  </div>

                  {!isResetting && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                        {!isSignUp && (
                          <button type="button" onClick={() => { setIsResetting(true); setError(''); }} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Forgot password?</button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-500 sm:text-sm" placeholder="••••••••" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {isVerifying && (
                <div className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input key={index} ref={(el) => (inputRefs.current[index] = el)} type="text" inputMode="numeric" pattern="\d*" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} onPaste={handleOtpPaste} className="w-12 h-14 text-center text-xl font-semibold bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-500" />
                    ))}
                  </div>
                  {isResetting && (
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-500 sm:text-sm" placeholder="••••••••" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all duration-500 sm:text-sm" placeholder="••••••••" required />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-900 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed mt-6">
                {isLoading ? 'Processing...' : (isResetting ? (isVerifying ? 'Reset Password' : 'Send Code') : (isVerifying ? 'Verify & Create' : (isSignUp ? 'Send Code' : 'Sign In')))}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              {!isVerifying && !isResetting && (
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500 pt-4">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="ml-1.5 font-medium text-zinc-900 dark:text-white hover:underline transition-all duration-500">
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              )}

              {isVerifying && (
                <p className="text-center text-sm pt-4">
                  <button type="button" onClick={() => { setIsVerifying(false); setOtp(['','','','','','']); }} className="font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Back to {isResetting ? 'email entry' : 'sign up'}
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
