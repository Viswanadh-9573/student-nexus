import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isNearby: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Hybrid'],
      default: 'Hybrid',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    prizePool: {
      type: String,
      default: '$5,000',
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    bannerColor: {
      type: String,
      default: 'from-blue-600 to-indigo-700',
    },
    registeredStudents: {
      type: [String], // Array of student emails
      default: [],
    },
    registrationLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
