import React, { useState } from 'react';
import {
  Home,
  Users,
  Search,
  LogOut,
  Award,
  ChevronDown,
  UserCheck,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onSearch, searchQuery, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-md bg-[#0a66c2] flex items-center justify-center text-white font-bold text-base tracking-tighter shadow-xs group-hover:bg-[#004182] transition-colors">
                HM
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-gray-900 text-lg leading-tight tracking-tight block">
                  Hack<span className="text-[#0a66c2]">Mate</span>
                </span>
              </div>
            </div>

            {/* LinkedIn-style Search Input */}
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search skills, branches (CSE), peers..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#edf3f8] hover:bg-[#e4ebf1] focus:bg-white text-sm text-gray-800 placeholder-gray-500 rounded-md border border-transparent focus:border-[#0a66c2] focus:outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center justify-center px-3 py-1 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'border-[#0a66c2] text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Home Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('hackathons')}
              className={`flex flex-col items-center justify-center px-3 py-1 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'hackathons'
                  ? 'border-[#0a66c2] text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Award className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Hackathons</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`flex flex-col items-center justify-center px-3 py-1 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'border-[#0a66c2] text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Peers</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative pl-2 border-l border-gray-200">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex flex-col items-center justify-center text-xs font-medium text-gray-600 hover:text-gray-900 focus:outline-hidden cursor-pointer"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name || 'Avatar'}
                  className="w-6 h-6 rounded-full object-cover border border-gray-300"
                />
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-[11px] hidden sm:inline">Me</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <img
                        src={
                          user?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            user?.name || 'User'
                          )}`
                        }
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {user?.name || 'HackMate Member'}
                          </p>
                          {user?.branch && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.2 rounded-sm border border-purple-200">
                              {user.branch}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user?.college}</p>
                        <p className="text-[11px] text-[#0a66c2] truncate font-medium">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setActiveTab('onboard-edit');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-gray-500" />
                        Edit Branch & Skills
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
