import React from 'react';
import { MapPin, GraduationCap, Heart, Users, Edit3, Trophy, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BRANCH_COLORS = {
  CSE: 'bg-purple-100 text-purple-700 border-purple-200',
  ECE: 'bg-blue-100 text-blue-700 border-blue-200',
  MECH: 'bg-amber-100 text-amber-800 border-amber-200',
  EEE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CIVIL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const ProfileSidebar = ({ onEditProfile, onAddAchievement }) => {
  const { user } = useAuth();

  if (!user) return null;

  const branchBadgeClass =
    BRANCH_COLORS[user.branch?.toUpperCase()] ||
    'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      {/* LinkedIn style Banner */}
      <div className="h-16 bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#388fe5] relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
      </div>

      {/* Avatar & Basics */}
      <div className="px-4 pb-4 pt-0 text-center relative">
        <div className="-mt-10 mb-2 inline-block relative">
          <img
            src={
              user.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
            }
            alt={user.name}
            className="w-18 h-18 rounded-full border-4 border-white shadow-sm object-cover bg-white"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <h3 className="font-bold text-gray-900 text-base leading-tight hover:underline cursor-pointer">
            {user.name}
          </h3>
          {user.branch && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${branchBadgeClass}`}
            >
              {user.branch}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-600 mt-1 leading-snug line-clamp-2">
          {user.headline || `${user.branch || 'Student'} at ${user.college}`}
        </p>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <GraduationCap className="w-3.5 h-3.5 text-[#0a66c2]" />
          <span className="truncate max-w-[180px] font-medium">{user.college}</span>
        </div>

        {user.address && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-400">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="truncate max-w-[180px]">{user.address}</span>
          </div>
        )}
      </div>

      {/* Analytics stats */}
      <div className="border-t border-b border-gray-100 py-2.5 px-4 bg-gray-50/50 text-xs">
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#0a66c2]" />
            Connections
          </span>
          <span className="font-semibold text-[#0a66c2]">
            {user.connections?.length || 0}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            Likes Received
          </span>
          <span className="font-semibold text-gray-800">{user.likesCount || 0}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Achievements
          </span>
          <span className="font-semibold text-amber-600">
            {user.achievements?.length || 0}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-500" />
            Certificates
          </span>
          <span className="font-semibold text-blue-600">
            {user.certificates?.length || 0}
          </span>
        </div>
      </div>

      {/* User Skills list */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Your Real Skills
          </h4>
          <span className="text-[10px] bg-blue-50 text-[#0a66c2] px-1.5 py-0.5 rounded-full font-medium">
            {user.skills?.length || 0}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <span
                key={index}
                className="text-[11px] bg-blue-50 text-[#0a66c2] border border-blue-100 font-medium px-2 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No skills added yet</p>
          )}
        </div>

        <button
          onClick={onEditProfile}
          className="mt-4 w-full py-1.5 px-3 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-gray-500" />
          Update Branch & Skills
        </button>
        <button
          onClick={onAddAchievement}
          className="mt-2 w-full py-1.5 px-3 rounded-full border border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-xs font-semibold text-amber-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          Add Achievement / Certificate
        </button>
      </div>
    </div>
  );
};
