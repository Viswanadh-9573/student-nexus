import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'store.json');

const initialStudents = [
  {
    _id: 'student-1',
    email: 'alex.rivera@nyu.edu',
    password: 'password123',
    name: 'Alex Rivera',
    address: 'Greenwich Village, New York, NY',
    college: 'New York University (NYU)',
    branch: 'CSE',
    skills: ['Frontend', 'Backend', 'Full-Stack', 'React', 'Node.js'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: 'CSE Senior @ NYU | Full-Stack MERN Developer & Hackathon Enthusiast',
    bio: 'Passionate about building scalable web apps and collaborative developer tools. Looking for teammates for HackNYC 2026!',
    likesCount: 24,
    likedBy: ['priya.sharma@columbia.edu'],
    connections: ['priya.sharma@columbia.edu'],
    pendingRequests: [],
    sentRequests: [],
    achievements: [],
    certificates: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'student-2',
    email: 'priya.sharma@columbia.edu',
    password: 'password123',
    name: 'Priya Sharma',
    address: 'Morningside Heights, New York, NY',
    college: 'Columbia University',
    branch: 'CSE',
    skills: ['Machine Learning (ML)', 'Artificial Intelligence (AI)', 'Data Science', 'Backend', 'Python'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    headline: 'CSE Fellow @ Columbia | NLP & Generative Vision Researcher',
    bio: 'Researches multimodal LLM alignment and agentic workflows. Built and deployed multiple predictive ML pipelines in production.',
    likesCount: 38,
    likedBy: ['alex.rivera@nyu.edu'],
    connections: ['alex.rivera@nyu.edu'],
    pendingRequests: [],
    sentRequests: [],
    achievements: [],
    certificates: [],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'student-3',
    email: 'marcus.chen@cornell.edu',
    password: 'password123',
    name: 'Marcus Chen',
    address: 'Roosevelt Island, New York, NY',
    college: 'Cornell Tech',
    branch: 'ECE',
    skills: ['Frontend', 'UI/UX Design', 'Full-Stack', 'IoT & Embedded Systems'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    headline: 'ECE & Product Designer @ Cornell Tech | Building human-centered hardware & web interfaces',
    bio: 'Bridging the gap between sleek Figma prototypes, embedded IoT, and pixel-perfect production code.',
    likesCount: 19,
    likedBy: [],
    connections: [],
    pendingRequests: [],
    sentRequests: [],
    achievements: [],
    certificates: [],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    _id: 'student-4',
    email: 'sophia.rodriguez@stevens.edu',
    password: 'password123',
    name: 'Sophia Rodriguez',
    address: 'Hoboken, NJ',
    college: 'Stevens Institute of Technology',
    branch: 'MECH',
    skills: ['Backend', 'DevOps & Cloud', 'IoT & Embedded Systems', 'Robotics'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    headline: 'MECH Major @ Stevens | Robotics, CAD & Cloud Infrastructure',
    bio: 'Specializing in automation, autonomous vehicle simulations, and high-availability cloud microservices.',
    likesCount: 15,
    likedBy: [],
    connections: [],
    pendingRequests: [],
    sentRequests: [],
    achievements: [],
    certificates: [],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    _id: 'student-5',
    email: 'david.kim@rutgers.edu',
    password: 'password123',
    name: 'David Kim',
    address: 'New Brunswick, NJ',
    college: 'Rutgers University',
    branch: 'EEE',
    skills: ['Cybersecurity', 'Backend', 'IoT & Embedded Systems', 'Hardware Systems'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    headline: 'EEE Major @ Rutgers | Embedded Firmware & Network Security',
    bio: 'Focusing on smart grid security, microcontroller firmware, and memory-safe systems programming.',
    likesCount: 22,
    likedBy: [],
    connections: [],
    pendingRequests: [],
    sentRequests: [],
    achievements: [],
    certificates: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    _id: 'student-6',
    email: 'emily.watson@fordham.edu',
    password: 'password123',
    name: 'Emily Watson',
    address: 'Bronx, NY',
    college: 'Fordham University',
    branch: 'CIVIL',
    skills: ['Frontend', 'Data Science', 'Machine Learning (ML)', 'Smart City Modeling'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: 'CIVIL Engineering @ Fordham | Urban Computing & Smart Infrastructure',
    bio: 'Applying computer vision and spatial ML data analysis to urban infrastructure and sustainable city projects.',
    likesCount: 17,
    likedBy: [],
    connections: [],
    pendingRequests: [],
    sentRequests: [],
    achievements: [],
    certificates: [],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

const initialHackathons = [
  {
    _id: 'hack-1',
    title: 'NYC Tech Sprint 2026',
    organizer: 'NYU Tandon & Google Cloud',
    location: 'Brooklyn, NY (In-Person)',
    isNearby: true,
    mode: 'In-Person',
    startDate: 'Nov 18, 2026',
    endDate: 'Nov 20, 2026',
    prizePool: '$25,000',
    tags: ['AI Agents', 'Full-Stack', 'Urban Tech', 'Cloud'],
    description: 'Build cutting-edge tech solutions for urban transit, sustainable energy, and collegiate collaboration. Free food, mentors, and swag provided!',
    bannerColor: 'from-blue-600 via-indigo-600 to-purple-700',
    registeredStudents: ['alex.rivera@nyu.edu', 'priya.sharma@columbia.edu'],
    registrationLink: 'https://hacknyc.dev',
  },
  {
    _id: 'hack-2',
    title: 'Empire State AI Jam',
    organizer: 'Columbia Engineering & OpenAI',
    location: 'Manhattan, NY (Hybrid)',
    isNearby: true,
    mode: 'Hybrid',
    startDate: 'Nov 27, 2026',
    endDate: 'Nov 29, 2026',
    prizePool: '$15,000',
    tags: ['Generative AI', 'Python', 'Healthcare', 'Fintech'],
    description: '36 hours of non-stop innovation building LLM-powered applications and agentic tools with industry leading mentors.',
    bannerColor: 'from-emerald-600 via-teal-600 to-cyan-700',
    registeredStudents: ['priya.sharma@columbia.edu'],
    registrationLink: 'https://empireai.dev',
  },
  {
    _id: 'hack-3',
    title: 'Global Collegiate Web3 & FinTech Hack',
    organizer: 'MIT Fintech Club & Ethereum Foundation',
    location: 'Virtual / Online',
    isNearby: false,
    mode: 'Virtual',
    startDate: 'Dec 05, 2026',
    endDate: 'Dec 07, 2026',
    prizePool: '$30,000',
    tags: ['Web3', 'Smart Contracts', 'DeFi', 'Security'],
    description: 'Join over 2,000 students worldwide to hack on next-generation decentralized finance, zero-knowledge proofs, and privacy tools.',
    bannerColor: 'from-amber-600 via-orange-600 to-red-600',
    registeredStudents: ['david.kim@rutgers.edu'],
    registrationLink: 'https://collegiateweb3.io',
  },
  {
    _id: 'hack-4',
    title: 'Tri-State HealthTech Innovators',
    organizer: 'Mount Sinai & Cornell Tech',
    location: 'Roosevelt Island, NY (In-Person)',
    isNearby: true,
    mode: 'In-Person',
    startDate: 'Dec 12, 2026',
    endDate: 'Dec 14, 2026',
    prizePool: '$10,000',
    tags: ['HealthTech', 'IoT', 'Mobile', 'Bioinformatics'],
    description: 'Create wearable sensors, remote diagnostic dashboards, and AI assistive tech for modern hospitals.',
    bannerColor: 'from-rose-600 via-pink-600 to-purple-700',
    registeredStudents: ['marcus.chen@cornell.edu'],
    registrationLink: 'https://healthtechtri.org',
  },
];

const initialMessages = [
  {
    _id: 'msg-1',
    sender: 'alex.rivera@nyu.edu',
    receiver: 'priya.sharma@columbia.edu',
    text: 'Hey Priya! Saw your profile and your ML research background. Are you participating in the upcoming NYC Tech Sprint hackathon?',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'msg-2',
    sender: 'priya.sharma@columbia.edu',
    receiver: 'alex.rivera@nyu.edu',
    text: "Hi Alex! Yes I am! I'm planning to build an AI agent for real-time document reasoning. We need a strong Full-Stack / Frontend dev for the dashboard. Would you be down to team up?",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'msg-3',
    sender: 'alex.rivera@nyu.edu',
    receiver: 'priya.sharma@columbia.edu',
    text: 'That sounds awesome! I can handle the React frontend and Node backend. Let’s connect on GitHub and brainstorm the architecture.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

class FallbackStore {
  constructor() {
    this.data = {
      students: initialStudents,
      hackathons: initialHackathons,
      messages: initialMessages,
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          students: parsed.students && parsed.students.length > 0 ? parsed.students : initialStudents,
          hackathons: parsed.hackathons && parsed.hackathons.length > 0 ? parsed.hackathons : initialHackathons,
          messages: parsed.messages || initialMessages,
        };
      } else {
        this.save();
      }
    } catch (e) {
      console.warn('Using in-memory store, file load error:', e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to write store to disk:', e.message);
    }
  }

  getStudents(query = '', skill = '', college = '', branch = '') {
    return this.data.students.filter((student) => {
      let matchesQuery = true;
      let matchesSkill = true;
      let matchesCollege = true;
      let matchesBranch = true;

      if (query) {
        const q = query.toLowerCase();
        matchesQuery =
          student.name.toLowerCase().includes(q) ||
          student.college.toLowerCase().includes(q) ||
          (student.branch && student.branch.toLowerCase().includes(q)) ||
          student.headline.toLowerCase().includes(q) ||
          student.skills.some((s) => s.toLowerCase().includes(q));
      }

      if (skill && skill !== 'all') {
        matchesSkill = student.skills.some(
          (s) => s.toLowerCase() === skill.toLowerCase()
        );
      }

      if (college && college !== 'all') {
        matchesCollege = student.college
          .toLowerCase()
          .includes(college.toLowerCase());
      }

      if (branch && branch !== 'all') {
        matchesBranch = student.branch && student.branch.toUpperCase() === branch.toUpperCase();
      }

      return matchesQuery && matchesSkill && matchesCollege && matchesBranch;
    });
  }

  getStudentById(id) {
    return this.data.students.find((s) => s._id === id || s.email === id);
  }

  getStudentByEmail(email) {
    if (!email) return null;
    return this.data.students.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  saveStudent(studentData) {
    const existingIndex = this.data.students.findIndex(
      (s) => s.email.toLowerCase() === studentData.email.toLowerCase()
    );

    if (existingIndex >= 0) {
      this.data.students[existingIndex] = {
        ...this.data.students[existingIndex],
        ...studentData,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.data.students[existingIndex];
    } else {
      const newStudent = {
        _id: 'student-' + Date.now(),
        likesCount: 0,
        likedBy: [],
        connections: [],
        pendingRequests: [],
        sentRequests: [],
        branch: studentData.branch || 'CSE',
        createdAt: new Date().toISOString(),
        ...studentData,
      };
      this.data.students.unshift(newStudent);
      this.save();
      return newStudent;
    }
  }

  toggleLike(studentId, userEmail) {
    const student = this.data.students.find((s) => s._id === studentId);
    if (!student) return null;

    if (!student.likedBy) student.likedBy = [];
    const index = student.likedBy.indexOf(userEmail);

    let isLiked = false;
    if (index >= 0) {
      student.likedBy.splice(index, 1);
      student.likesCount = Math.max(0, (student.likesCount || 1) - 1);
      isLiked = false;
    } else {
      student.likedBy.push(userEmail);
      student.likesCount = (student.likesCount || 0) + 1;
      isLiked = true;
    }

    this.save();
    return { student, isLiked };
  }

  // Connection management
  sendConnectionRequest(fromEmail, targetStudentId) {
    const sender = this.getStudentByEmail(fromEmail);
    const receiver = this.getStudentById(targetStudentId);

    if (!sender || !receiver) return { error: 'Student not found' };
    if (sender.email === receiver.email) return { error: 'Cannot connect with yourself' };

    if (!sender.sentRequests) sender.sentRequests = [];
    if (!receiver.pendingRequests) receiver.pendingRequests = [];
    if (!sender.connections) sender.connections = [];

    // Already connected
    if (sender.connections.includes(receiver.email)) {
      return { status: 'connected', sender, receiver };
    }

    // Toggle/send request
    if (!sender.sentRequests.includes(receiver.email)) {
      sender.sentRequests.push(receiver.email);
    }
    if (!receiver.pendingRequests.includes(sender.email)) {
      receiver.pendingRequests.push(sender.email);
    }

    this.save();
    return { status: 'pending', sender, receiver };
  }

  acceptConnectionRequest(userEmail, fromEmail) {
    const user = this.getStudentByEmail(userEmail);
    const fromUser = this.getStudentByEmail(fromEmail);

    if (!user || !fromUser) return null;

    user.pendingRequests = (user.pendingRequests || []).filter((e) => e !== fromEmail);
    fromUser.sentRequests = (fromUser.sentRequests || []).filter((e) => e !== userEmail);

    if (!user.connections.includes(fromEmail)) user.connections.push(fromEmail);
    if (!fromUser.connections.includes(userEmail)) fromUser.connections.push(userEmail);

    this.save();
    return { user, fromUser };
  }

  // Chatbox Messages
  getMessages(user1Email, user2Email) {
    const u1 = (user1Email || '').toLowerCase();
    const u2 = (user2Email || '').toLowerCase();

    return (this.data.messages || []).filter(
      (m) =>
        (m.sender.toLowerCase() === u1 && m.receiver.toLowerCase() === u2) ||
        (m.sender.toLowerCase() === u2 && m.receiver.toLowerCase() === u1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  sendMessage(senderEmail, receiverEmail, text) {
    if (!text || !text.trim()) return null;

    const newMsg = {
      _id: 'msg-' + Date.now(),
      sender: senderEmail.toLowerCase(),
      receiver: receiverEmail.toLowerCase(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    if (!this.data.messages) this.data.messages = [];
    this.data.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  getHackathons(filter = 'all') {
    if (filter === 'nearby') {
      return this.data.hackathons.filter((h) => h.isNearby);
    }
    if (filter === 'virtual') {
      return this.data.hackathons.filter((h) => h.mode === 'Virtual');
    }
    return this.data.hackathons;
  }

  registerForHackathon(hackathonId, studentEmail) {
    const hackathon = this.data.hackathons.find((h) => h._id === hackathonId);
    if (!hackathon) return null;

    if (!hackathon.registeredStudents) hackathon.registeredStudents = [];
    if (!hackathon.registeredStudents.includes(studentEmail)) {
      hackathon.registeredStudents.push(studentEmail);
      this.save();
    }
    return hackathon;
  }

  addAchievement(email, achievement) {
    const student = this.getStudentByEmail(email);
    if (!student) return null;
    if (!student.achievements) student.achievements = [];
    student.achievements.push(achievement);
    this.save();
    return student;
  }

  removeAchievement(email, achievementId) {
    const student = this.getStudentByEmail(email);
    if (!student) return null;
    student.achievements = (student.achievements || []).filter(a => a.id !== achievementId);
    this.save();
    return student;
  }

  addCertificate(email, certificate) {
    const student = this.getStudentByEmail(email);
    if (!student) return null;
    if (!student.certificates) student.certificates = [];
    student.certificates.push(certificate);
    this.save();
    return student;
  }

  removeCertificate(email, certId) {
    const student = this.getStudentByEmail(email);
    if (!student) return null;
    student.certificates = (student.certificates || []).filter(c => c.id !== certId);
    this.save();
    return student;
  }
}

export const fallbackStore = new FallbackStore();
