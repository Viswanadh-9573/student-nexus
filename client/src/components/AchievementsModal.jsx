import React, { useState, useRef } from 'react';
import { X, Trophy, Award, Upload, Plus, Trash2, FileImage, FileText, Calendar, Building2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ACHIEVEMENT_EMOJIS = ['🏆', '🥇', '🎖️', '🌟', '🚀', '💡', '🎯', '🏅', '🎉', '👑'];

export const AchievementsModal = ({ onClose, onUpdate }) => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('achievement'); // 'achievement' | 'certificate'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Achievement form state
  const [achTitle, setAchTitle] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achDate, setAchDate] = useState('');
  const [achEmoji, setAchEmoji] = useState('🏆');

  // Certificate form state
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certFile, setCertFile] = useState(null); // { data, type, name }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (!isImage && !isPDF) {
      setError('Only images (PNG, JPG, WEBP) or PDF files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCertFile({
        data: reader.result,
        type: isImage ? 'image' : 'pdf',
        name: file.name,
      });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handlePostAchievement = async () => {
    if (!achTitle.trim()) {
      setError('Achievement title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.addAchievement(user.email, {
        title: achTitle,
        description: achDesc,
        date: achDate,
        emoji: achEmoji,
      });
      updateUserProfile(res.user);
      if (onUpdate) onUpdate(res.user);
      setSuccess('Achievement posted successfully! 🎉');
      setAchTitle('');
      setAchDesc('');
      setAchDate('');
      setAchEmoji('🏆');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCertificate = async () => {
    if (!certTitle.trim()) {
      setError('Certificate title is required');
      return;
    }
    if (!certFile) {
      setError('Please select a certificate file (image or PDF)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.addCertificate(user.email, {
        title: certTitle,
        issuer: certIssuer,
        date: certDate,
        fileData: certFile.data,
        fileType: certFile.type,
      });
      updateUserProfile(res.user);
      if (onUpdate) onUpdate(res.user);
      setSuccess('Certificate uploaded successfully! 🎓');
      setCertTitle('');
      setCertIssuer('');
      setCertDate('');
      setCertFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    try {
      const res = await api.deleteAchievement(user.email, achievementId);
      updateUserProfile(res.user);
      if (onUpdate) onUpdate(res.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCertificate = async (certId) => {
    try {
      const res = await api.deleteCertificate(user.email, certId);
      updateUserProfile(res.user);
      if (onUpdate) onUpdate(res.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const myAchievements = user?.achievements || [];
  const myCertificates = user?.certificates || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Achievements & Certificates</h2>
              <p className="text-xs text-gray-500">Share your wins and credentials with the community</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('achievement')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'achievement'
                ? 'border-b-2 border-[#0a66c2] text-[#0a66c2]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Post Achievement
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'certificate'
                ? 'border-b-2 border-[#0a66c2] text-[#0a66c2]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Upload Certificate
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-semibold">
              {success}
            </div>
          )}

          {activeTab === 'achievement' && (
            <div className="space-y-5">
              {/* Achievement form */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0a66c2]" />
                  New Achievement
                </h3>

                {/* Emoji picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pick an Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {ACHIEVEMENT_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAchEmoji(emoji)}
                        className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          achEmoji === emoji
                            ? 'bg-[#0a66c2]/10 ring-2 ring-[#0a66c2] scale-110'
                            : 'bg-white border border-gray-200 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Achievement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={achTitle}
                    onChange={(e) => setAchTitle(e.target.value)}
                    placeholder="e.g. Won 1st Place at HackNYC 2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={achDesc}
                    onChange={(e) => setAchDesc(e.target.value)}
                    placeholder="Describe your achievement in a few words..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0a66c2] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Date
                  </label>
                  <input
                    type="text"
                    value={achDate}
                    onChange={(e) => setAchDate(e.target.value)}
                    placeholder="e.g. November 2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0a66c2]"
                  />
                </div>

                <button
                  onClick={handlePostAchievement}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  {loading ? 'Posting...' : 'Post Achievement'}
                </button>
              </div>

              {/* Existing achievements */}
              {myAchievements.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Your Achievements ({myAchievements.length})
                  </h3>
                  <div className="space-y-2">
                    {[...myAchievements].reverse().map((ach) => (
                      <div key={ach.id} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <span className="text-2xl shrink-0">{ach.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{ach.title}</p>
                          {ach.description && <p className="text-xs text-gray-600 mt-0.5">{ach.description}</p>}
                          {ach.date && <p className="text-[11px] text-gray-400 mt-1">{ach.date}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteAchievement(ach.id)}
                          className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors cursor-pointer shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="space-y-5">
              {/* Certificate form */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#0a66c2]" />
                  Upload New Certificate
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Certificate Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0a66c2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="e.g. October 2026"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#0a66c2]"
                    />
                  </div>
                </div>

                {/* File upload area */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Certificate File <span className="text-red-500">*</span>
                  </label>
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0a66c2] hover:bg-blue-50/30 transition-colors">
                    {certFile ? (
                      <div className="flex flex-col items-center gap-1">
                        {certFile.type === 'image' ? (
                          <FileImage className="w-8 h-8 text-[#0a66c2]" />
                        ) : (
                          <FileText className="w-8 h-8 text-red-500" />
                        )}
                        <p className="text-sm font-semibold text-gray-800">{certFile.name}</p>
                        <p className="text-xs text-green-600">✓ File selected</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-700">Click to upload certificate</p>
                        <p className="text-xs text-gray-400">PNG, JPG, WEBP or PDF — max 10MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {certFile?.type === 'image' && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-h-32">
                      <img src={certFile.data} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUploadCertificate}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  {loading ? 'Uploading...' : 'Upload Certificate'}
                </button>
              </div>

              {/* Existing certificates */}
              {myCertificates.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Your Certificates ({myCertificates.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...myCertificates].reverse().map((cert) => (
                      <div key={cert.id} className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs group">
                        {cert.fileType === 'image' ? (
                          <img
                            src={cert.fileData}
                            alt={cert.title}
                            className="w-full h-28 object-cover"
                          />
                        ) : (
                          <div className="w-full h-28 bg-red-50 flex flex-col items-center justify-center gap-1">
                            <FileText className="w-8 h-8 text-red-400" />
                            <span className="text-xs text-red-500 font-medium">PDF Certificate</span>
                          </div>
                        )}
                        <div className="p-2.5">
                          <p className="font-semibold text-gray-900 text-xs line-clamp-1">{cert.title}</p>
                          {cert.issuer && <p className="text-[11px] text-gray-500">{cert.issuer}</p>}
                          {cert.date && <p className="text-[10px] text-gray-400">{cert.date}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
