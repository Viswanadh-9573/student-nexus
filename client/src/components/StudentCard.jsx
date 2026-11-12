import React, { useState } from 'react';
import {
  ThumbsUp,
  MapPin,
  GraduationCap,
  MessageSquare,
  UserPlus,
  Check,
  Clock,
  CheckCircle2,
  Sparkles,
  Trophy,
  Award,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BRANCH_COLORS = {
  CSE: 'bg-purple-50 text-purple-700 border-purple-200',
  ECE: 'bg-blue-50 text-blue-700 border-blue-200',
  MECH: 'bg-amber-50 text-amber-800 border-amber-200',
  EEE: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  CIVIL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const StudentCard = ({
  student,
  currentUser,
  onToggleLike,
  onSelectSkill,
  onSelectBranch,
  onOpenChat,
  onSendConnectionRequest,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const currentEmail = currentUser?.email || '';
  const isMe = currentEmail && student.email?.toLowerCase() === currentEmail.toLowerCase();

  const isLikedByMe =
    student.likedBy && currentEmail ? student.likedBy.includes(currentEmail) : false;

  // Connection status checks
  const isConnected =
    (student.connections && student.connections.includes(currentEmail)) ||
    (currentUser?.connections && currentUser.connections.includes(student.email));

  const isRequestPending =
    (student.pendingRequests && student.pendingRequests.includes(currentEmail)) ||
    (currentUser?.sentRequests && currentUser.sentRequests.includes(student.email));

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (!isLikedByMe) {
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

  const handleConnectClick = async () => {
    if (connecting || isConnected || isRequestPending || isMe) return;
    setConnecting(true);
    try {
      await onSendConnectionRequest(student._id);
    } finally {
      setConnecting(false);
    }
  };

  const branchBadgeClass =
    BRANCH_COLORS[student.branch?.toUpperCase()] ||
    'bg-gray-100 text-gray-700 border-gray-200';

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

                {/* Branch Badge (CSE, ECE, MECH, EEE, CIVIL) */}
                {student.branch && (
                  <button
                    type="button"
                    onClick={() => onSelectBranch && onSelectBranch(student.branch)}
                    className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-sm border cursor-pointer hover:opacity-80 transition-opacity ${branchBadgeClass}`}
                    title={`Filter by ${student.branch}`}
                  >
                    {student.branch}
                  </button>
                )}

                <span className="inline-flex items-center text-[10px] bg-green-50 text-green-700 px-1.5 py-0.2 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3 mr-0.5" />
                  Verified
                </span>
              </div>

              <p className="text-xs text-gray-700 font-normal mt-0.5 line-clamp-2">
                {student.headline || `${student.branch || 'Student'} at ${student.college}`}
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

          {/* Connect & Chat Action Buttons */}
          {!isMe && (
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {/* Connect Request Button */}
              <button
                onClick={handleConnectClick}
                disabled={connecting || isConnected || isRequestPending}
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : isRequestPending
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-default'
                    : 'text-[#0a66c2] hover:bg-blue-50 border border-[#0a66c2]'
                }`}
              >
                {isConnected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : isRequestPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </>
                )}
              </button>

              {/* Chat Direct Message Button */}
              <button
                onClick={() => onOpenChat(student)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-[#0a66c2] hover:bg-[#004182] text-white px-3.5 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
                title={`Chat with ${student.name}`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          )}
        </div>

        {/* Bio / Description */}
        {student.bio && (
          <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed bg-[#f9fafb] p-3 rounded-lg border border-gray-100">
            "{student.bio}"
          </p>
        )}

        {/* Real Skills Section */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Real Skills (Frontend, Backend, ML, etc.):
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {student.skills && student.skills.length > 0 ? (
              student.skills.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSkill && onSelectSkill(skill)}
                  className="inline-flex items-center text-xs bg-blue-50/70 hover:bg-[#0a66c2] text-gray-800 hover:text-white font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer border border-blue-200/60"
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

        {/* Achievements Section */}
        {student.achievements && student.achievements.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Achievements:
              </span>
            </div>
            <div className="space-y-1.5">
              {student.achievements.slice(0, 3).map((ach) => (
                <div key={ach.id} className="flex items-start gap-2 p-2 bg-amber-50/70 border border-amber-100 rounded-lg">
                  <span className="text-base shrink-0">{ach.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{ach.title}</p>
                    {ach.description && (
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{ach.description}</p>
                    )}
                    {ach.date && <p className="text-[10px] text-gray-400">{ach.date}</p>}
                  </div>
                </div>
              ))}
              {student.achievements.length > 3 && (
                <p className="text-[11px] text-gray-400 pl-1">+{student.achievements.length - 3} more achievements</p>
              )}
            </div>
          </div>
        )}

        {/* Certificates Section */}
        {student.certificates && student.certificates.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Certificates ({student.certificates.length}):
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {student.certificates.slice(0, 3).map((cert) => (
                <div key={cert.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
                  {cert.fileType === 'image' ? (
                    <img
                      src={cert.fileData}
                      alt={cert.title}
                      className="w-full h-14 object-cover"
                    />
                  ) : (
                    <div className="w-full h-14 bg-red-50 flex flex-col items-center justify-center gap-0.5">
                      <FileText className="w-5 h-5 text-red-400" />
                      <span className="text-[9px] text-red-400 font-medium">PDF</span>
                    </div>
                  )}
                  <div className="p-1.5">
                    <p className="text-[10px] font-semibold text-gray-800 line-clamp-1">{cert.title}</p>
                    {cert.issuer && <p className="text-[9px] text-gray-500 line-clamp-1">{cert.issuer}</p>}
                  </div>
                </div>
              ))}
            </div>
            {student.certificates.length > 3 && (
              <p className="text-[11px] text-gray-400 mt-1 pl-1">+{student.certificates.length - 3} more certificates</p>
            )}
          </div>
        )}
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
          {/* Mobile Connect & Chat buttons */}
          {!isMe && (
            <div className="sm:hidden flex items-center gap-1">
              <button
                onClick={handleConnectClick}
                disabled={isConnected || isRequestPending}
                className="text-xs font-medium text-gray-600 hover:text-[#0a66c2] px-2 py-1 rounded-md"
              >
                {isConnected ? 'Connected' : isRequestPending ? 'Pending' : '+ Connect'}
              </button>

              <button
                onClick={() => onOpenChat(student)}
                className="flex items-center gap-1 text-xs font-semibold text-[#0a66c2] bg-blue-50 px-2.5 py-1 rounded-full"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </button>
            </div>
          )}

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
