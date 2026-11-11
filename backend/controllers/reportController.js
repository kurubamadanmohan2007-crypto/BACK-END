const Report = require('../models/Report');
const Resource = require('../models/Resource');

// @desc    Submit a new issue report for a resource
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { resourceId, issueType, description, reportedByName, reportedByEmail } = req.body;

    if (!resourceId || !issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resourceId, issueType, and a description of the issue',
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'The resource being reported does not exist',
      });
    }

    const newReport = await Report.create({
      resource: resourceId,
      resourceName: resource.name,
      issueType,
      description,
      reportedBy: {
        name: reportedByName || 'Anonymous Resident',
        email: reportedByEmail || '',
      },
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Issue report submitted successfully. Community moderators will review it shortly.',
      data: newReport,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error.message,
    });
  }
};

// @desc    Get all reports (optionally by status or resource)
// @route   GET /api/reports
exports.getReports = async (req, res) => {
  try {
    const { status, resourceId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (resourceId) filter.resource = resourceId;

    const reports = await Report.find(filter)
      .populate('resource', 'name category address city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message,
    });
  }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Reviewed', 'Resolved', 'Dismissed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Report marked as ${status}`,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update report status',
      error: error.message,
    });
  }
};
