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
    name: 'Alex Rivera',
    phone: '+1 (555) 234-5678',
    address: 'Greenwich Village, New York, NY',
    college: 'New York University (NYU)',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: 'Computer Science Senior @ NYU | Full-Stack MERN Developer & Open Source Contributor',
    bio: 'Passionate about building scalable distributed web apps and interactive developer tools. Currently looking for summer 2026 software engineering internships!',
    likesCount: 24,
    likedBy: ['priya.sharma@columbia.edu'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'student-2',
    email: 'priya.sharma@columbia.edu',
    name: 'Priya Sharma',
    phone: '+1 (555) 876-5432',
    address: 'Morningside Heights, New York, NY',
    college: 'Columbia University',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'FastAPI', 'Data Science', 'Docker'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    headline: 'AI & Data Science Fellow @ Columbia | NLP & Generative Vision Researcher',
    bio: 'Researches multimodal LLM alignment and agentic workflows. Built and deployed multiple predictive ML pipelines in production.',
    likesCount: 38,
    likedBy: ['alex.rivera@nyu.edu'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'student-3',
    email: 'marcus.chen@cornell.edu',
    name: 'Marcus Chen',
    phone: '+1 (555) 432-1098',
    address: 'Roosevelt Island, New York, NY',
    college: 'Cornell Tech',
    skills: ['UI/UX Design', 'Figma', 'React', 'Next.js', 'Design Systems', 'Framer Motion'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    headline: 'Product Designer & Frontend Engineer @ Cornell Tech | Building delightful human-centered web experiences',
    bio: 'Bridging the gap between sleek Figma prototypes and pixel-perfect production code. Hackathon winner x3.',
    likesCount: 19,
    likedBy: [],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    _id: 'student-4',
    email: 'sophia.rodriguez@stevens.edu',
    name: 'Sophia Rodriguez',
    phone: '+1 (555) 789-0123',
    address: 'Hoboken, NJ',
    college: 'Stevens Institute of Technology',
    skills: ['DevOps', 'Kubernetes', 'Docker', 'AWS', 'Go', 'CI/CD Pipelines'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    headline: 'Cloud Infrastructure & DevOps Enthusiast @ Stevens | AWS Certified Solutions Architect',
    bio: 'Optimizing container orchestration and infrastructure as code. Passionate about high-availability microservices.',
    likesCount: 15,
    likedBy: [],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    _id: 'student-5',
    email: 'david.kim@rutgers.edu',
    name: 'David Kim',
    phone: '+1 (555) 345-6789',
    address: 'New Brunswick, NJ',
    college: 'Rutgers University',
    skills: ['Cybersecurity', 'Rust', 'Linux Kernel', 'Penetration Testing', 'C++', 'Cryptography'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    headline: 'Cybersecurity Analyst & Systems Programmer @ Rutgers | CTF Captain',
    bio: 'Focusing on zero-trust architectures and memory-safe systems programming in Rust. Regular bug bounty contributor.',
    likesCount: 22,
    likedBy: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
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

class FallbackStore {
  constructor() {
    this.data = {
      students: initialStudents,
      hackathons: initialHackathons,
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
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

  getStudents(query = '', skill = '', college = '') {
    return this.data.students.filter((student) => {
      let matchesQuery = true;
      let matchesSkill = true;
      let matchesCollege = true;

      if (query) {
        const q = query.toLowerCase();
        matchesQuery =
          student.name.toLowerCase().includes(q) ||
          student.college.toLowerCase().includes(q) ||
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

      return matchesQuery && matchesSkill && matchesCollege;
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
}

export const fallbackStore = new FallbackStore();
