const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Drinking Water',
        'Charging Point',
        'Shelter',
        'Public Toilet',
        'Hospital / Clinic',
        'Community Facility',
        'Food Bank',
        'Wi-Fi Zone'
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'Metropolis',
    },
    state: {
      type: String,
      default: '',
    },
    zipCode: {
      type: String,
      default: '',
    },
    coordinates: {
      lat: {
        type: Number,
        default: 40.7128,
      },
      lng: {
        type: Number,
        default: -74.006,
      },
    },
    openingHours: {
      type: String,
      required: [true, 'Opening hours are required'],
      default: 'Open 24/7',
    },
    accessNotes: {
      type: String,
      default: 'Publicly accessible to all residents',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Active', 'Under Maintenance', 'Temporarily Closed'],
      default: 'Active',
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    verificationCount: {
      type: Number,
      default: 1,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Check if resource is outdated (> 30 days without verification)
ResourceSchema.virtual('isOutdated').get(function () {
  if (!this.lastVerifiedAt) return true;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(this.lastVerifiedAt).getTime() > thirtyDaysMs;
});

// Virtual: Days since last verification
ResourceSchema.virtual('daysSinceVerification').get(function () {
  if (!this.lastVerifiedAt) return null;
  const diffTime = Math.abs(Date.now() - new Date(this.lastVerifiedAt).getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Resource', ResourceSchema);
