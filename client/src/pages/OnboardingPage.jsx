import React, { useState } from 'react';
import {
  User,
  Lock,
  MapPin,
  GraduationCap,
  Sparkles,
  Camera,
  UploadCloud,
  X,
  CheckCircle,
  ArrowRight,
  Plus,
  BookOpen,
  Code,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REAL_SKILLS = [
  'Frontend',
  'Backend',
  'Full-Stack',
  'Machine Learning (ML)',
  'Artificial Intelligence (AI)',
  'Data Science',
  'DevOps & Cloud',
  'Cybersecurity',
  'UI/UX Design',
  'Mobile App Development',
  'IoT & Embedded Systems',
  'Blockchain / Web3',
  'React',
  'Node.js',
  'Python',
  'Docker',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
];

export const OnboardingPage = ({ onComplete }) => {
  const { pendingEmail, pendingPassword, user, completeOnboarding, loading } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || pendingEmail || '');
  const [password, setPassword] = useState(user?.password || pendingPassword || '');
  const [branch, setBranch] = useState(user?.branch || 'CSE');
  const [address, setAddress] = useState(user?.address || '');
  const [college, setCollege] = useState(user?.college || '');
  const [headline, setHeadline] = useState(
    user?.headline || `${user?.branch || 'CSE'} Student | Passionate Developer`
  );
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(
    user?.skills && user.skills.length > 0 ? user.skills : ['Frontend', 'Backend']
  );
  const [skillInput, setSkillInput] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [error, setError] = useState('');

  // Handle photo file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add skill to list
  const addSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!college.trim()) {
      setError('Please enter your college / university name.');
      return;
    }
    if (!branch) {
      setError('Please select your engineering branch.');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one real technical skill (e.g. Frontend, Backend, ML).');
      return;
    }

    try {
      const defaultAvatar =
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;

      await completeOnboarding({
        email,
        password: password || 'password123',
        name: name.trim(),
        branch,
        address: address.trim(),
        college: college.trim(),
        skills,
        avatar: defaultAvatar,
        headline: headline.trim() || `${branch} Student @ ${college.trim()} | Building Projects`,
        bio: bio.trim(),
      });

      // Route directly to main home page
      onComplete();
    } catch (err) {
      setError(err.message || 'Failed to save student profile.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Branding */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-[#0a66c2] flex items-center justify-center text-white font-bold text-base tracking-tighter shadow-xs">
            HM
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">
            Hack<span className="text-[#0a66c2]">Mate</span>
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Build Your HackMate Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select your branch (CSE, ECE, MECH, EEE, CIVIL), highlight your real technical skills (Frontend, Backend, ML), and start teaming up!
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Optional Photo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-2">
                Profile Photo <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="relative group">
                  <img
                    src={
                      avatarPreview ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        name || 'Student'
                      )}`
                    }
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm bg-white"
                  />
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar('');
                        setAvatarPreview('');
                      }}
                      className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <label className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-300 hover:border-[#0a66c2] hover:text-[#0a66c2] text-gray-700 text-xs font-semibold rounded-md shadow-2xs cursor-pointer transition-colors">
                    <UploadCloud className="w-4 h-4 text-[#0a66c2]" />
                    <span>Upload from device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    PNG, JPG, or WEBP up to 5MB. Or select a preset avatar:
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 justify-center sm:justify-start flex-wrap">
                    {PRESET_AVATARS.map((preset, index) => (
                      <img
                        key={index}
                        src={preset}
                        alt="preset"
                        onClick={() => {
                          setAvatar(preset);
                          setAvatarPreview(preset);
                        }}
                        className={`w-7 h-7 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform border ${
                          avatarPreview === preset ? 'ring-2 ring-[#0a66c2]' : 'border-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Basic Info (Name, Email, Password) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password & Branch Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Branch Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Engineering Branch <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={branch}
                    onChange={(e) => {
                      setBranch(e.target.value);
                      if (!headline || headline.includes('Student')) {
                        setHeadline(`${e.target.value} Student @ ${college || 'University'} | Passionate Developer`);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  >
                    <option value="CSE">CSE — Computer Science & Engineering</option>
                    <option value="ECE">ECE — Electronics & Communication Engineering</option>
                    <option value="MECH">MECH — Mechanical Engineering</option>
                    <option value="EEE">EEE — Electrical & Electronics Engineering</option>
                    <option value="CIVIL">CIVIL — Civil Engineering</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. College Name & Campus Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  College / University Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. New York University (NYU)"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[11px] text-gray-400">Suggestions:</span>
                  {['NYU', 'Columbia University', 'Cornell Tech', 'Stevens Tech', 'Rutgers'].map(
                    (col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setCollege(col)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm cursor-pointer"
                      >
                        {col}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Campus / City Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. New York, NY"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Professional Headline & Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Headline / Focus Area
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. CSE Sophomore @ NYU | Frontend & Machine Learning Enthusiast"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short Bio / Hackathon Goals
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell teammates what you love building or what hackathons you want to win together..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>

            {/* 5. Real Skills Place to Enter (Frontend, Backend, ML, etc.) */}
            <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100">
              <label className="block text-xs font-bold uppercase text-gray-800 tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#0a66c2]" />
                  <span>Real Technical Skills (Frontend, Backend, ML, etc.) <span className="text-red-500">*</span></span>
                </span>
                <span className="text-[11px] font-normal text-gray-500">
                  {skills.length} selected
                </span>
              </label>
              <p className="text-[11px] text-gray-500 mb-3">
                Select your core development domains so other students can discover and team up with you for hackathons.
              </p>

              {/* Tag Input for Custom Skills */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill (e.g. Frontend, Backend, ML, UI/UX) and press Enter"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:border-[#0a66c2]"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="px-3.5 py-2 bg-[#0a66c2] text-white rounded-lg text-xs font-semibold hover:bg-[#004182] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Skills Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0a66c2] text-white shadow-2xs animate-in zoom-in-95 duration-150"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-black/20 rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Core Real Skill Options to Click and Add */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Click to add Real Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {REAL_SKILLS.map((suggested) => {
                    const isAdded = skills.some(
                      (s) => s.toLowerCase() === suggested.toLowerCase()
                    );
                    return (
                      <button
                        key={suggested}
                        type="button"
                        disabled={isAdded}
                        onClick={() => addSkill(suggested)}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                          isAdded
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-300 hover:border-[#0a66c2]'
                        }`}
                      >
                        {isAdded ? '✓ ' : '+ '}
                        {suggested}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  'Saving Profile...'
                ) : (
                  <>
                    <span>Save & Enter HackMate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
