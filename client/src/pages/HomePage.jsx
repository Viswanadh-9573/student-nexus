import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Award,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  HelpCircle,
  Flame,
  Code,
  Layers,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { StudentCard } from '../components/StudentCard';
import { HackathonSection } from '../components/HackathonSection';
import { HackathonModal } from '../components/HackathonModal';
import { ChatModal } from '../components/ChatModal';
import { AchievementsModal } from '../components/AchievementsModal';

export const HomePage = ({ onEditProfile, initialSearch = '' }) => {
  const { user, updateUserProfile } = useAuth();
  const [students, setStudents] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState('all');

  // Modals state
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [selectedStudentForChat, setSelectedStudentForChat] = useState(null);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch students & hackathons
  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, hackathonsRes] = await Promise.all([
        api.getStudents({
          q: searchQuery,
          skill: selectedSkill,
          college: selectedCollege,
          branch: selectedBranch,
        }),
        api.getHackathons(),
      ]);
      setStudents(studentsRes.students || []);
      setHackathons(hackathonsRes.hackathons || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedSkill, selectedBranch, selectedCollege]);

  // Handle Like / Unlike toggle
  const handleToggleLike = async (studentId) => {
    if (!user) return;
    try {
      // Optimistic update
      setStudents((prev) =>
        prev.map((s) => {
          if (s._id === studentId) {
            const hasLiked = s.likedBy?.includes(user.email);
            const newLikedBy = hasLiked
              ? s.likedBy.filter((e) => e !== user.email)
              : [...(s.likedBy || []), user.email];
            return {
              ...s,
              likedBy: newLikedBy,
              likesCount: hasLiked
                ? Math.max(0, (s.likesCount || 1) - 1)
                : (s.likesCount || 0) + 1,
            };
          }
          return s;
        })
      );

      const res = await api.toggleLike(studentId, user.email);
      if (res && res.student) {
        setStudents((prev) =>
          prev.map((s) => (s._id === studentId ? { ...s, ...res.student } : s))
        );
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
      fetchData();
    }
  };

  // Handle Send Connection Request
  const handleSendConnectionRequest = async (studentId) => {
    if (!user) return;
    try {
      const res = await api.sendConnectionRequest(user.email, studentId);
      if (res.success) {
        showToast(`🎉 Connection request sent to ${res.receiver?.name || 'peer'}!`);
        if (res.sender) {
          updateUserProfile(res.sender);
        }
        setStudents((prev) =>
          prev.map((s) => (s._id === studentId ? { ...s, ...res.receiver } : s))
        );
      }
    } catch (err) {
      showToast('❌ ' + (err.message || 'Failed to send connection request'));
    }
  };

  // Handle Hackathon Registration
  const handleRegisterHackathon = async (hackathonId) => {
    if (!user) return;
    try {
      const res = await api.registerHackathon(hackathonId, user.email);
      if (res.hackathon) {
        setHackathons((prev) =>
          prev.map((h) => (h._id === hackathonId ? res.hackathon : h))
        );
        if (selectedHackathon && selectedHackathon._id === hackathonId) {
          setSelectedHackathon(res.hackathon);
        }
        showToast('🎉 Successfully registered for hackathon session!');
      }
    } catch (err) {
      showToast('❌ Registration failed. Try again.');
    }
  };

  const branches = ['All', 'CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];

  const realSkillsList = [
    'All',
    'Frontend',
    'Backend',
    'Full-Stack',
    'Machine Learning (ML)',
    'Artificial Intelligence (AI)',
    'Data Science',
    'DevOps & Cloud',
    'Cybersecurity',
    'UI/UX Design',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 3-Column LinkedIn Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <aside className="lg:col-span-3 space-y-4">
          <ProfileSidebar onEditProfile={onEditProfile} onAddAchievement={() => setShowAchievementsModal(true)} />

          {/* Filter by Engineering Branch (CSE, ECE, MECH, EEE, CIVIL) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0a66c2]" />
                Filter by Branch
              </span>
              {selectedBranch !== 'all' && (
                <button
                  onClick={() => setSelectedBranch('all')}
                  className="text-[10px] text-[#0a66c2] hover:underline normal-case cursor-pointer font-semibold"
                >
                  Reset
                </button>
              )}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {branches.map((b) => {
                const isActive =
                  selectedBranch.toUpperCase() === b.toUpperCase();
                return (
                  <button
                    key={b}
                    onClick={() =>
                      setSelectedBranch(b === 'All' ? 'all' : b)
                    }
                    className={`text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                      isActive
                        ? 'bg-[#0a66c2] text-white shadow-2xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter by Real Skills (Frontend, Backend, ML, etc.) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-purple-600" />
                Filter Real Skills
              </span>
              {selectedSkill !== 'all' && (
                <button
                  onClick={() => setSelectedSkill('all')}
                  className="text-[10px] text-[#0a66c2] hover:underline normal-case cursor-pointer font-semibold"
                >
                  Reset
                </button>
              )}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {realSkillsList.map((skill) => {
                const isActive =
                  selectedSkill.toLowerCase() === skill.toLowerCase();
                return (
                  <button
                    key={skill}
                    onClick={() =>
                      setSelectedSkill(skill === 'All' ? 'all' : skill)
                    }
                    className={`text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HackMate Community Highlights Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-xs text-gray-600">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              HackMate Network Highlights
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              Match by branches (CSE, ECE, MECH, EEE, CIVIL), filter real skills (Frontend, Backend, ML), and chat directly to build winning teams.
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Active Hackers:</span>
                <span className="font-semibold text-gray-800">{students.length}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Open Hackathons:</span>
                <span className="font-semibold text-gray-800">{hackathons.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= CENTER COLUMN (Feed of Students with Skills) ================= */}
        <main className="lg:col-span-6 space-y-4">
          {/* Top "Showcase Skills" Share Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    user?.name || 'User'
                  )}`
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
              />
              <button
                onClick={onEditProfile}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs sm:text-sm font-medium rounded-full text-left transition-colors cursor-pointer border border-gray-200"
              >
                Upload your real skills or update your branch & profile...
              </button>
            </div>

            <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <button
                onClick={onEditProfile}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer font-medium text-gray-700"
              >
                <Code className="w-4 h-4 text-[#0a66c2]" />
                <span>Add Real Skills</span>
              </button>

              <button
                onClick={onEditProfile}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer font-medium text-gray-700"
              >
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Select Branch</span>
              </button>

              <button
                onClick={() => setShowAchievementsModal(true)}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer font-medium text-gray-700"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Add Achievement</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSkill('all');
                  setSelectedBranch('all');
                  setSearchQuery('');
                  fetchData();
                }}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer font-medium text-gray-700"
              >
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                <span>Refresh Feed</span>
              </button>
            </div>
          </div>

          {/* Active Filter Bar & Counter */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">
                Peer Directory Feed
              </h2>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                {students.length} peers
              </span>
            </div>

            {(selectedSkill !== 'all' || selectedBranch !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSkill('all');
                  setSelectedBranch('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#0a66c2] hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-xs">
              <RefreshCw className="w-6 h-6 text-[#0a66c2] animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">
                Fetching HackMate profiles and skills...
              </p>
            </div>
          ) : students.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0a66c2] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No students found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No students match your selected filters. Try switching the branch or clearing the skill filter!
              </p>
              <button
                onClick={() => {
                  setSelectedSkill('all');
                  setSelectedBranch('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#0a66c2] text-white rounded-full text-xs font-semibold hover:bg-[#004182] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Student Cards Stream */
            students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                currentUser={user}
                onToggleLike={handleToggleLike}
                onSelectSkill={(skill) => setSelectedSkill(skill)}
                onSelectBranch={(branch) => setSelectedBranch(branch)}
                onOpenChat={(st) => setSelectedStudentForChat(st)}
                onSendConnectionRequest={handleSendConnectionRequest}
              />
            ))
          )}
        </main>

        {/* ================= RIGHT COLUMN (Hackathon Radar) ================= */}
        <aside className="lg:col-span-3 space-y-4">
          <HackathonSection
            hackathons={hackathons}
            onSelectHackathon={(hack) => setSelectedHackathon(hack)}
            onRegister={handleRegisterHackathon}
            currentEmail={user?.email}
          />
        </aside>
      </div>

      {/* Hackathon Details Modal */}
      {selectedHackathon && (
        <HackathonModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
          onRegister={handleRegisterHackathon}
          currentEmail={user?.email}
        />
      )}

      {/* Direct Chatbox Modal (Replaces phone number view!) */}
      {selectedStudentForChat && (
        <ChatModal
          recipient={selectedStudentForChat}
          currentUser={user}
          onClose={() => setSelectedStudentForChat(null)}
        />
      )}

      {/* Achievements & Certificates Modal */}
      {showAchievementsModal && (
        <AchievementsModal
          onClose={() => setShowAchievementsModal(false)}
          onUpdate={(updatedUser) => {
            setStudents(prev => prev.map(s => s.email === updatedUser.email ? { ...s, ...updatedUser } : s));
          }}
        />
      )}
    </div>
  );
};
