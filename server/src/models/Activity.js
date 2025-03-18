
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    default: 'manual',
  },
  date: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  avgPace: {
    type: String,
    required: true
  },
  notes: String,
  calories: String,
  avgHR: String,
  maxHR: String,
  avgCadence: String,
  maxCadence: String,
  totalAscent: String,
  totalDescent: String,
  avgStrideLength: String,
  avgVerticalRatio: String,
  avgVerticalOscillation: String,
  avgGCT: String,
  avgGCTBalance: String,
  trainingStressScore: String,
  steps: String,
  decompression: String,
  minElevation: String,
  maxElevation: String,
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create index for email
ActivitySchema.index({ type: 1, date: 1, distance: 1, duration: 1 });

export default mongoose.model('Activity', ActivitySchema);