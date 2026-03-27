import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Profile({ onBack }: { onBack: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', username: '' });
  const [passData, setPassData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response: any = await api.get('/auth/get_user_details/');
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        username: response.data.username || '',
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      // Using PATCH for partial updates
      const response: any = await api.patch('/auth/get_user_details/', formData);
      setUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/auth/change_password/', passData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPassData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-colors duration-500">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center transition-all duration-500">
              <div className="w-24 h-24 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-xl">
                {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-medium tracking-tight transition-colors duration-500">{user?.first_name} {user?.last_name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors duration-500">{user?.email}</p>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-sm font-medium border transition-all duration-500 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-900/30' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-900/30'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Forms Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Info Form */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <User className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-medium tracking-tight transition-colors duration-500">Personal Information</h3>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">First Name</label>
                  <input 
                    type="text" 
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Username</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button 
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Password Change Form */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-medium tracking-tight transition-colors duration-500">Security & Password</h3>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Current Password</label>
                  <input 
                    type="password" 
                    value={passData.old_password}
                    onChange={(e) => setPassData({...passData, old_password: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-500">New Password</label>
                    <input 
                      type="password" 
                      value={passData.new_password}
                      onChange={(e) => setPassData({...passData, new_password: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-500">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passData.confirm_password}
                      onChange={(e) => setPassData({...passData, confirm_password: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
