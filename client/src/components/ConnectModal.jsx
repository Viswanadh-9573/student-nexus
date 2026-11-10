import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export const ConnectModal = ({ student, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!student) return null;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#0a66c2] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={
                student.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  student.name
                )}`
              }
              alt={student.name}
              className="w-14 h-14 rounded-full border-2 border-white object-cover bg-white"
            />
            <div>
              <h3 className="text-lg font-bold">{student.name}</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {student.college}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info Body */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-gray-500 font-medium">
            Contact information provided by {student.name} for collaboration, project teams, and hackathons:
          </p>

          <div className="space-y-2.5">
            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0a66c2] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Email Address
                  </span>
                  <span className="font-medium text-gray-800 text-xs truncate block">
                    {student.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(student.email, 'email')}
                className="p-1.5 text-gray-400 hover:text-[#0a66c2] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                title="Copy Email"
              >
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Phone Number */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Phone Number
                  </span>
                  <span className="font-medium text-gray-800 text-xs truncate block">
                    {student.phone || 'Not shared publicly'}
                  </span>
                </div>
              </div>
              {student.phone && (
                <button
                  onClick={() => handleCopy(student.phone, 'phone')}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Address */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Campus / Location
                  </span>
                  <span className="font-medium text-gray-800 text-xs truncate block">
                    {student.address || 'Location on file'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills summary */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-gray-700 block mb-1.5">
              Showcased Skills
            </span>
            <div className="flex flex-wrap gap-1">
              {student.skills?.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0a66c2] text-white rounded-lg text-xs font-semibold hover:bg-[#004182] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
