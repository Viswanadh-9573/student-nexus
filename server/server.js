import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Hackathon } from './models/Hackathon.js';
import { fallbackStore } from './data/fallbackStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
let isMongoConnected = false;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Try MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_nexus';

async function initDatabase() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}`);
    
    // Seed initial data if database is empty
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding MongoDB with initial student and hackathon profiles...');
      for (const student of fallbackStore.data.students) {
        const { _id, ...studentData } = student;
        await User.create(studentData);
      }
      for (const hack of fallbackStore.data.hackathons) {
        const { _id, ...hackData } = hack;
        await Hackathon.create(hackData);
      }
      console.log('✅ Seeding completed.');
    }
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ MongoDB not found locally or connection timed out.');
    console.log('⚡ Active mode: High-performance JSON/In-Memory fallback store enabled (All features working!).');
  }
}

initDatabase();

// ======================== API ROUTES ======================== //

// 1. Auth & Onboarding Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.json({ isNewUser: true, email: cleanEmail });
      }
      return res.json({ isNewUser: false, user });
    } else {
      const user = fallbackStore.getStudentByEmail(cleanEmail);
      if (!user) {
        return res.json({ isNewUser: true, email: cleanEmail });
      }
      return res.json({ isNewUser: false, user });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/onboarding', async (req, res) => {
  try {
    const { email, name, phone, address, college, skills, avatar, headline, bio } = req.body;

    if (!email || !name || !college) {
      return res.status(400).json({ error: 'Name, email, and college are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const skillsList = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const profileData = {
      email: cleanEmail,
      name: name.trim(),
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      college: college.trim(),
      skills: skillsList,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      headline: headline || `Student @ ${college.trim()} | Exploring Opportunities`,
      bio: bio || '',
    };

    if (isMongoConnected) {
      let user = await User.findOne({ email: cleanEmail });
      if (user) {
        Object.assign(user, profileData);
        await user.save();
      } else {
        user = await User.create({ ...profileData, likesCount: 0, likedBy: [] });
      }
      return res.status(201).json({ success: true, user });
    } else {
      const savedUser = fallbackStore.saveStudent(profileData);
      return res.status(201).json({ success: true, user: savedUser });
    }
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete profile onboarding' });
  }
});

// 2. Student Profiles Feed
app.get('/api/students', async (req, res) => {
  try {
    const { q, skill, college } = req.query;

    if (isMongoConnected) {
      const filter = {};
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { college: { $regex: q, $options: 'i' } },
          { headline: { $regex: q, $options: 'i' } },
          { skills: { $regex: q, $options: 'i' } },
        ];
      }
      if (skill && skill !== 'all') {
        filter.skills = { $regex: new RegExp(`^${skill}$`, 'i') };
      }
      if (college && college !== 'all') {
        filter.college = { $regex: college, $options: 'i' };
      }

      const students = await User.find(filter).sort({ createdAt: -1 });
      return res.json({ students });
    } else {
      const students = fallbackStore.getStudents(q, skill, college);
      return res.json({ students });
    }
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to fetch students feed' });
  }
});

// 3. Like / Unlike a Student Profile
app.post('/api/students/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'userEmail is required to like a profile' });
    }

    if (isMongoConnected) {
      const student = await User.findById(id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const index = student.likedBy.indexOf(userEmail);
      let isLiked = false;

      if (index >= 0) {
        student.likedBy.splice(index, 1);
        student.likesCount = Math.max(0, student.likesCount - 1);
        isLiked = false;
      } else {
        student.likedBy.push(userEmail);
        student.likesCount = (student.likesCount || 0) + 1;
        isLiked = true;
      }

      await student.save();
      return res.json({ success: true, student, isLiked });
    } else {
      const result = fallbackStore.toggleLike(id, userEmail);
      if (!result) {
        return res.status(404).json({ error: 'Student not found' });
      }
      return res.json({ success: true, student: result.student, isLiked: result.isLiked });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// 4. Hackathons Route
app.get('/api/hackathons', async (req, res) => {
  try {
    const { filter } = req.query;

    if (isMongoConnected) {
      const query = {};
      if (filter === 'nearby') query.isNearby = true;
      if (filter === 'virtual') query.mode = 'Virtual';

      const hackathons = await Hackathon.find(query).sort({ createdAt: -1 });
      return res.json({ hackathons });
    } else {
      const hackathons = fallbackStore.getHackathons(filter);
      return res.json({ hackathons });
    }
  } catch (error) {
    console.error('Hackathons error:', error);
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
});

app.post('/api/hackathons/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    if (isMongoConnected) {
      const hackathon = await Hackathon.findById(id);
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      if (!hackathon.registeredStudents.includes(studentEmail)) {
        hackathon.registeredStudents.push(studentEmail);
        await hackathon.save();
      }
      return res.json({ success: true, hackathon });
    } else {
      const hackathon = fallbackStore.registerForHackathon(id, studentEmail);
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      return res.json({ success: true, hackathon });
    }
  } catch (error) {
    console.error('Hackathon registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'StudentNexus MERN',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in production
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  // If requesting api and not matched, return 404
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('StudentNexus API Server is running. Frontend build not found yet.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StudentNexus Server running at http://localhost:${PORT}`);
});
