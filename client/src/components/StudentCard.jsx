import React, { useState } from 'react';
import {
  ThumbsUp,
  MapPin,
  GraduationCap,
  MessageCircle,
  Share2,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentCard = ({
  student,
  currentEmail,
  onToggleLike,
  onSelectSkill,
  onOpenConnect,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const isLikedByMe =
    student.likedBy && currentEmail ? student.likedBy.includes(currentEmail) : false;

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (!isLikedByMe) {
        // Trigger small burst of celebratory confetti
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0a66c2', '#388fe5', '#10b981', '#f59e0b'],
        });
      }
      await onToggleLike(student._id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      {/* Top Card Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <img
              src={
                student.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  student.name
                )}`
              }
              alt={student.name}
              className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs shrink-0 bg-gray-100"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-gray-900 text-base hover:text-[#0a66c2] hover:underline cursor-pointer">
                  {student.name}
                </h3>
                <span className="inline-flex items-center text-[11px] bg-green-50 text-green-700 px-1.5 py-0.2 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3 mr-0.5" />
                  Verified Student
                </span>
              </div>

              <p className="text-xs text-gray-700 font-normal mt-0.5 line-clamp-2">
                {student.headline || `Student at ${student.college}`}
              </p>

              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0a66c2]" />
                  {student.college}
                </span>

                {student.address && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {student.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Connect Button */}
          <button
            onClick={() => onOpenConnect(student)}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#0a66c2] hover:bg-blue-50 border border-[#0a66c2] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Connect
          </button>
        </div>

        {/* Bio / Description */}
        {student.bio && (
          <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed bg-[#f9fafb] p-3 rounded-lg border border-gray-100">
            "{student.bio}"
          </p>
        )}

        {/* Skills Section */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Showcased Skills:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {student.skills && student.skills.length > 0 ? (
              student.skills.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSkill && onSelectSkill(skill)}
                  className="inline-flex items-center text-xs bg-gray-100 hover:bg-[#0a66c2]/10 text-gray-800 hover:text-[#0a66c2] font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#0a66c2]/30"
                  title={`Filter by ${skill}`}
                >
                  {skill}
                </button>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Social / Interaction Bar */}
      <div className="border-t border-gray-100 px-4 py-2 bg-white flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0a66c2] text-white text-[10px]">
            👍
          </span>
          <span className="font-semibold text-gray-700 ml-1">
            {student.likesCount || 0}
          </span>
          <span className="hidden sm:inline text-gray-400">likes</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile connect button */}
          <button
            onClick={() => onOpenConnect(student)}
            className="sm:hidden flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-[#0a66c2] px-2 py-1 rounded-md"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </button>

          {/* Interactive Like Button */}
          <button
            onClick={handleLikeClick}
            disabled={isLiking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none ${
              isLikedByMe
                ? 'text-[#0a66c2] bg-blue-50/80 hover:bg-blue-100/80 animate-like-bounce'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 transition-transform ${
                isLikedByMe ? 'fill-[#0a66c2] stroke-[#0a66c2]' : ''
              }`}
            />
            <span>{isLikedByMe ? 'Liked' : 'Like'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
