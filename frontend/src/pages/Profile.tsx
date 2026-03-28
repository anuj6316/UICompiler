import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Mail, Phone, Shield, Bell, LogOut, Save, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export default function Profile() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isLoading, updateUser, changePassword, logout: userLogout, refreshUser } = useUser();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    notificationsEnabled: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        jobTitle: user.jobTitle,
        notificationsEnabled: user.notificationsEnabled,
      });
    }
  }, [user]);



  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setIsChangingPassword(false), 2000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-[#09090B] transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-200 animate-spin" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-200 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white/20 dark:selection:text-white transition-colors duration-500">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.05] transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.96]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-200 transition-colors duration-500 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-none flex items-center justify-center shadow-sm dark:shadow-none transition-colors duration-500">
                <BrandLogo className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">{env.appName}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.96]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header / Cover Section */}
        <div className="relative mb-12">
          {/* Cover Photo */}
          <div className="h-48 sm:h-64 w-full rounded-none bg-zinc-900 dark:bg-white/[0.04] overflow-hidden relative transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent dark:from-[#09090B]/80 dark:via-[#09090B]/20 transition-opacity duration-500" />
          </div>

          {/* Avatar & Basic Info */}
          <div className="absolute -bottom-6 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-none border-4 border-zinc-50 dark:border-[#09090B] overflow-hidden bg-zinc-900 dark:bg-white transition-colors duration-500 shadow-xl dark:shadow-none flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-white dark:text-black">{getInitials(user)}</span>
              </div>
            </div>
            <div className="pb-6 sm:pb-8 drop-shadow-md dark:drop-shadow-none">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white dark:text-zinc-200 transition-colors duration-500">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/90 dark:text-zinc-300 font-medium transition-colors duration-500">{user.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          
          {/* Left Column (Main Form) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-none p-6 sm:p-8 transition-all duration-500">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 transition-colors duration-500">Personal Information</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">Update your photo and personal details here.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Job Title</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input 
                      type="text" 
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input 
                      type="tel" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Side Cards) */}
          <div className="space-y-8">
            
            {/* Preferences Card */}
            <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-none p-6 transition-all duration-500">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 mb-4 transition-colors duration-500">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-none bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/5 transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-white/[0.02] rounded-none shadow-sm dark:shadow-none transition-colors duration-500">
                      <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors duration-500">Notifications</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-500">Email & Push</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.notificationsEnabled}
                      onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-900/20 dark:peer-focus:ring-white/20 rounded-none peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all dark:border-white/[0.12] peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100 transition-colors duration-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-none bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/5 transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-white/[0.02] rounded-none shadow-sm dark:shadow-none transition-colors duration-500">
                      <Lock className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors duration-500">Password</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-500">Last changed recently</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-300 active:scale-[0.98]"
                  >
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-none bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/5 transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-white/[0.02] rounded-none shadow-sm dark:shadow-none transition-colors duration-500">
                      <Shield className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors duration-500">2FA Security</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-500">{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-300 active:scale-[0.98]">
                    {user.twoFactorEnabled ? 'Manage' : 'Setup'}
                  </button>
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-none p-6 transition-all duration-500">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-none font-semibold border border-zinc-900 dark:border-white/[0.1] hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-white/[0.02] rounded-none p-8 shadow-2xl dark:shadow-none border border-zinc-200 dark:border-white/[0.05] animate-in zoom-in-95 duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">Change Password</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Enter your current and new password below.</p>
            </div>

            {passwordError && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-none text-rose-500 text-sm font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-none text-emerald-500 text-sm font-medium">
                Password changed successfully!
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all duration-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all duration-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all duration-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 py-3.5 bg-transparent border border-zinc-200 dark:border-white/[0.05] text-zinc-900 dark:text-zinc-200 rounded-none font-semibold hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-none font-semibold border border-zinc-900 dark:border-white/[0.1] hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
