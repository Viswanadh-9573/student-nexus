import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  ExternalLink,
  Users,
  Compass,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const HackathonSection = ({ hackathons, onSelectHackathon, onRegister, currentEmail }) => {
  const [filter, setFilter] = useState('all');

  const filtered = hackathons.filter((h) => {
    if (filter === 'nearby') return h.isNearby;
    if (filter === 'virtual') return h.mode === 'Virtual';
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              Hackathon Sessions
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#0a66c2] bg-blue-50 px-2 py-0.5 rounded-full">
            {hackathons.length} Active
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Nearby & upcoming collegiate hackathons to build with your network.
        </p>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 mt-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              filter === 'all'
                ? 'bg-[#0a66c2] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('nearby')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
              filter === 'nearby'
                ? 'bg-[#0a66c2] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            Nearby
          </button>
          <button
            onClick={() => setFilter('virtual')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              filter === 'virtual'
                ? 'bg-[#0a66c2] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Virtual
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 max-h-[580px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            No hackathons match this filter right now.
          </div>
        ) : (
          filtered.map((hack) => {
            const isRegistered =
              hack.registeredStudents && currentEmail
                ? hack.registeredStudents.includes(currentEmail)
                : false;

            return (
              <div
                key={hack._id}
                className="p-4 hover:bg-gray-50/80 transition-colors group"
              >
                {/* Mode & Nearby Badge */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-sm ${
                      hack.isNearby
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {hack.isNearby ? '📍 Nearby Event' : '🌐 Global Virtual'}
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {hack.startDate}
                  </span>
                </div>

                {/* Title */}
                <h4
                  onClick={() => onSelectHackathon(hack)}
                  className="font-bold text-gray-900 text-xs sm:text-sm hover:text-[#0a66c2] cursor-pointer transition-colors line-clamp-1"
                >
                  {hack.title}
                </h4>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  Organized by <span className="font-medium text-gray-700">{hack.organizer}</span>
                </p>

                {/* Prize and Location */}
                <div className="flex items-center justify-between text-xs mt-2.5">
                  <span className="font-bold text-emerald-600 bg-emerald-50/70 px-2 py-0.5 rounded-sm">
                    {hack.prizePool} Prizes
                  </span>
                  <span className="text-gray-500 text-[11px] flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    {hack.registeredStudents?.length || 0} registered
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onSelectHackathon(hack)}
                    className="flex-1 py-1 px-2.5 rounded-md text-xs font-semibold border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onRegister(hack._id)}
                    className={`py-1 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      isRegistered
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-[#0a66c2] hover:bg-[#004182] text-white shadow-xs'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Registered
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a
          href="#explore"
          onClick={(e) => {
            e.preventDefault();
            setFilter('all');
          }}
          className="text-xs font-semibold text-[#0a66c2] hover:underline"
        >
          View all Collegiate Hackathons →
        </a>
      </div>
    </div>
  );
};
