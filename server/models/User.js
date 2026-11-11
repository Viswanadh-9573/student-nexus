import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: 'password123',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      enum: ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'],
      default: 'CSE',
    },
    skills: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: 'Student & Tech Enthusiast',
    },
    bio: {
      type: String,
      default: '',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String], // Array of user emails
      default: [],
    },
    connections: {
      type: [String], // Array of connected user emails
      default: [],
    },
    pendingRequests: {
      type: [String], // Array of user emails who sent request to this user
      default: [],
    },
    sentRequests: {
      type: [String], // Array of user emails this user sent request to
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
