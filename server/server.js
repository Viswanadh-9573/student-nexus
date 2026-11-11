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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hackmate';

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
      console.log('🌱 Seeding MongoDB with initial HackMate profiles...');
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
    console.log('⚡ Active mode: High-performance JSON/In-Memory fallback store enabled for HackMate.');
  }
}

initDatabase();

// ======================== API ROUTES ======================== //

// 1. Auth & Onboarding Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.json({ isNewUser: true, email: cleanEmail, password });
      }
      if (user.password && user.password !== password) {
        return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      }
      return res.json({ isNewUser: false, user });
    } else {
      const user = fallbackStore.getStudentByEmail(cleanEmail);
      if (!user) {
        return res.json({ isNewUser: true, email: cleanEmail, password });
      }
      if (user.password && user.password !== password) {
        return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
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
    const { email, password, name, address, college, branch, skills, avatar, headline, bio } = req.body;

    if (!email || !name || !college) {
      return res.status(400).json({ error: 'Name, email, and college are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const skillsList = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const validBranches = ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];
    const chosenBranch = validBranches.includes((branch || '').toUpperCase())
      ? (branch || '').toUpperCase()
      : 'CSE';

    const profileData = {
      email: cleanEmail,
      password: password || 'password123',
      name: name.trim(),
      address: (address || '').trim(),
      college: college.trim(),
      branch: chosenBranch,
      skills: skillsList,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      headline: headline || `${chosenBranch} Student @ ${college.trim()} | Exploring Opportunities`,
      bio: bio || '',
    };

    if (isMongoConnected) {
      let user = await User.findOne({ email: cleanEmail });
      if (user) {
        Object.assign(user, profileData);
        await user.save();
      } else {
        user = await User.create({
          ...profileData,
          likesCount: 0,
          likedBy: [],
          connections: [],
          pendingRequests: [],
          sentRequests: [],
        });
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

// 2. Student Profiles Feed (supports q, skill, college, branch)
app.get('/api/students', async (req, res) => {
  try {
    const { q, skill, college, branch } = req.query;

    if (isMongoConnected) {
      const filter = {};
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { college: { $regex: q, $options: 'i' } },
          { branch: { $regex: q, $options: 'i' } },
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
      if (branch && branch !== 'all') {
        filter.branch = branch.toUpperCase();
      }

      const students = await User.find(filter).sort({ createdAt: -1 });
      return res.json({ students });
    } else {
      const students = fallbackStore.getStudents(q, skill, college, branch);
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

// 4. Connection Request Endpoints
app.post('/api/connections/request', async (req, res) => {
  try {
    const { fromEmail, targetStudentId } = req.body;
    if (!fromEmail || !targetStudentId) {
      return res.status(400).json({ error: 'fromEmail and targetStudentId are required' });
    }

    if (isMongoConnected) {
      const sender = await User.findOne({ email: fromEmail.toLowerCase() });
      const receiver = await User.findById(targetStudentId);

      if (!sender || !receiver) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!sender.sentRequests.includes(receiver.email)) {
        sender.sentRequests.push(receiver.email);
        await sender.save();
      }
      if (!receiver.pendingRequests.includes(sender.email)) {
        receiver.pendingRequests.push(sender.email);
        await receiver.save();
      }

      return res.json({ success: true, status: 'pending', sender, receiver });
    } else {
      const result = fallbackStore.sendConnectionRequest(fromEmail, targetStudentId);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      return res.json({ success: true, status: result.status, sender: result.sender, receiver: result.receiver });
    }
  } catch (error) {
    console.error('Connection request error:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
});

app.post('/api/connections/accept', async (req, res) => {
  try {
    const { userEmail, fromEmail } = req.body;
    if (!userEmail || !fromEmail) {
      return res.status(400).json({ error: 'userEmail and fromEmail are required' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: userEmail.toLowerCase() });
      const fromUser = await User.findOne({ email: fromEmail.toLowerCase() });

      if (!user || !fromUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.pendingRequests = user.pendingRequests.filter((e) => e !== fromEmail);
      fromUser.sentRequests = fromUser.sentRequests.filter((e) => e !== userEmail);

      if (!user.connections.includes(fromEmail)) user.connections.push(fromEmail);
      if (!fromUser.connections.includes(userEmail)) fromUser.connections.push(userEmail);

      await user.save();
      await fromUser.save();

      return res.json({ success: true, user, fromUser });
    } else {
      const result = fallbackStore.acceptConnectionRequest(userEmail, fromEmail);
      if (!result) return res.status(404).json({ error: 'User not found' });
      return res.json({ success: true, user: result.user, fromUser: result.fromUser });
    }
  } catch (error) {
    console.error('Connection accept error:', error);
    res.status(500).json({ error: 'Failed to accept connection request' });
  }
});

// 5. Chatbox Direct Messages Endpoints
app.get('/api/messages', async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'user1 and user2 query parameters required' });
    }

    const messages = fallbackStore.getMessages(user1, user2);
    return res.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { senderEmail, receiverEmail, text } = req.body;
    if (!senderEmail || !receiverEmail || !text) {
      return res.status(400).json({ error: 'senderEmail, receiverEmail, and text are required' });
    }

    const message = fallbackStore.sendMessage(senderEmail, receiverEmail, text);
    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 6. Hackathons Route
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
    appName: 'HackMate MERN',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in production
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('HackMate API Server is running. Frontend build not found yet.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HackMate Server running at http://localhost:${PORT}`);
});
