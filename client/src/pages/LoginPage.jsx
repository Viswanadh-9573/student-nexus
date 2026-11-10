import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Sparkles, Users, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNeedOnboarding }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { loginWithEmail, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.trim()) {
      setError('Please enter a valid student email address.');
      return;
    }

    try {
      const result = await loginWithEmail(email.trim());
      if (result.isNewUser) {
        onNeedOnboarding();
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    try {
      const result = await loginWithEmail(demoEmail);
      if (result.isNewUser) {
        onNeedOnboarding();
      }
    } catch (err) {
      setError('Failed to login with demo account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#0a66c2] flex items-center justify-center text-white font-bold text-lg">
              in
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Student<span className="text-[#0a66c2]">Nexus</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <ShieldCheck className="w-4 h-4 text-[#0a66c2]" />
            <span>Collegiate Verified Network</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Hero / Pitch */}
        <div className="lg:w-1/2 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0a66c2] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MERN Stack Student Community</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Showcase your skills. <br />
            <span className="text-[#0a66c2]">Find hackathons.</span> <br />
            Connect with peers.
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-lg leading-relaxed">
            Welcome to StudentNexus. Create your collegiate profile, broadcast your technical skills, collaborate on upcoming hackathon sessions, and grow your university developer reputation.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0a66c2] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs">Student Feed</p>
                <p className="text-[11px] text-gray-500">Discover & like skillsets</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs">Hackathon Radar</p>
                <p className="text-[11px] text-gray-500">Nearby & virtual sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sign-in Card */}
        <div className="lg:w-5/12 w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
            <p className="text-xs text-gray-500 mb-6">
              Stay updated on your collegiate network & hackathons
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email or Student Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. you@university.edu"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  New users will automatically be prompted to build their student profile.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  'Checking...'
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Switcher */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5 text-center">
                Or explore as a sample student
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('alex.rivera@nyu.edu')}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-xs font-medium text-gray-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Alex"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Alex Rivera (NYU - MERN Stack)</span>
                  </div>
                  <span className="text-[#0a66c2] font-semibold text-[11px]">Instant Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('priya.sharma@columbia.edu')}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-xs font-medium text-gray-800 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                      alt="Priya"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Priya Sharma (Columbia - AI / ML)</span>
                  </div>
                  <span className="text-[#0a66c2] font-semibold text-[11px]">Instant Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
        <p>StudentNexus © 2026 • Full-stack MERN Network • Built for collegiate developers</p>
      </footer>
    </div>
  );
};
