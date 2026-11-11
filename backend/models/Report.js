const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    resourceName: {
      type: String,
      default: '',
    },
    issueType: {
      type: String,
      required: [true, 'Please select an issue type'],
      enum: [
        'Incorrect Address',
        'Permanently Closed',
        'Temporarily Closed',
        'Outdated Hours',
        'Damaged / Non-Functional',
        'Restricted Access',
        'Other'
      ],
    },
    description: {
      type: String,
      required: [true, 'Please describe the issue in detail'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    reportedBy: {
      name: {
        type: String,
        default: 'Anonymous Resident',
      },
      email: {
        type: String,
        default: '',
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved', 'Dismissed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', ReportSchema);
