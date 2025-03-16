
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  preferences: {
    distanceUnit: {
      type: String,
      enum: ['miles', 'kilometers'],
      default: 'miles'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  runs: {
    type: Map,
    default: []
  },
  premium: {
    type: Map,
    default: {}
  },
  payments: {
    type: Map,
    default: {}
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create index for email
UserSchema.index({ email: 1 });

export default mongoose.model('User', UserSchema);