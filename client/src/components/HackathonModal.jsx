import React from 'react';
import {
  X,
  Calendar,
  MapPin,
  Trophy,
  Award,
  Users,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const HackathonModal = ({ hackathon, onClose, onRegister, currentEmail }) => {
  if (!hackathon) return null;

  const isRegistered =
    hackathon.registeredStudents && currentEmail
      ? hackathon.registeredStudents.includes(currentEmail)
      : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className={`h-28 bg-gradient-to-r ${hackathon.bannerColor || 'from-blue-600 to-indigo-700'} relative p-4 flex flex-col justify-end text-white`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-sm inline-block w-fit backdrop-blur-xs mb-1">
            {hackathon.mode} Hackathon
          </span>
          <h2 className="text-xl font-bold leading-tight">{hackathon.title}</h2>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Organized by</p>
              <p className="text-sm font-semibold text-gray-900">{hackathon.organizer}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Prizes</p>
              <p className="text-base font-bold text-emerald-600">{hackathon.prizePool}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4 py-3 px-4 bg-gray-50 rounded-xl text-xs">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#0a66c2] mt-0.5 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px]">Date Range</span>
                <span className="font-semibold text-gray-800">
                  {hackathon.startDate} - {hackathon.endDate}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px]">Location</span>
                <span className="font-semibold text-gray-800">
                  {hackathon.location}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
              About This Session
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {hackathon.description ||
                'Collaborate with fellow collegiate developers, build innovative projects, receive mentorship from industry engineers, and showcase your skills to recruiters.'}
            </p>
          </div>

          {/* Tracks / Tags */}
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2">
              Hackathon Tracks & Categories
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {hackathon.tags &&
                hackathon.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-50 text-[#0a66c2] font-semibold px-2.5 py-1 rounded-md border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>

          {/* Registered count */}
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-gray-600">
            <Users className="w-4 h-4 text-[#0a66c2]" />
            <span>
              <strong className="text-gray-900">
                {hackathon.registeredStudents?.length || 0}
              </strong>{' '}
              students have already registered for this hackathon session.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => onRegister(hackathon._id)}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isRegistered
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
            }`}
          >
            {isRegistered ? (
              <>
                <CheckCircle className="w-4 h-4" />
                You are Registered
              </>
            ) : (
              'Confirm Registration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
