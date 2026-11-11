const Resource = require('../models/Resource');

// @desc    Get all resources with search, filter, and pagination
// @route   GET /api/resources
exports.getResources = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      outdated,
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Text search on name, description, address, city
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { city: searchRegex },
        { accessNotes: searchRegex },
      ];
    }

    // Outdated filter (> 30 days)
    if (outdated === 'true') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      query.lastVerifiedAt = { $lt: thirtyDaysAgo };
    } else if (outdated === 'false') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      query.lastVerifiedAt = { $gte: thirtyDaysAgo };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'verified') {
      sortOptions = { lastVerifiedAt: -1 };
    } else if (sortBy === 'name') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'popular') {
      sortOptions = { upvotes: -1, verificationCount: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [resources, totalCount] = await Promise.all([
      Resource.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Resource.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: resources.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: resources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error fetching resources',
      error: error.message,
    });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found: invalid ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new community resource
// @route   POST /api/resources
exports.createResource = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      address,
      city,
      state,
      zipCode,
      coordinates,
      openingHours,
      accessNotes,
      contactPhone,
      contactEmail,
      website,
      imageUrl,
      status,
    } = req.body;

    // Validation
    if (!name || !category || !description || !address || !openingHours) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, description, address, and openingHours',
      });
    }

    const newResource = await Resource.create({
      name,
      category,
      description,
      address,
      city: city || 'Metropolis',
      state: state || '',
      zipCode: zipCode || '',
      coordinates: coordinates || { lat: 40.7128, lng: -74.006 },
      openingHours,
      accessNotes: accessNotes || 'Publicly accessible',
      contactPhone: contactPhone || '',
      contactEmail: contactEmail || '',
      website: website || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
      status: status || 'Active',
      lastVerifiedAt: new Date(),
      verificationCount: 1,
    });

    res.status(201).json({
      success: true,
      message: 'Resource registered successfully!',
      data: newResource,
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create resource',
    });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
exports.updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update resource',
    });
  }
};

// @desc    Verify a resource (Community Verification)
// @route   POST /api/resources/:id/verify
exports.verifyResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource.lastVerifiedAt = new Date();
    resource.verificationCount = (resource.verificationCount || 0) + 1;
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource successfully verified as active and accurate!',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify resource',
      error: error.message,
    });
  }
};

// @desc    Upvote a resource
// @route   POST /api/resources/:id/upvote
exports.upvoteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource.upvotes = (resource.upvotes || 0) + 1;
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Helpful vote recorded!',
      data: { upvotes: resource.upvotes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record vote',
      error: error.message,
    });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    await resource.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics for resources
// @route   GET /api/resources/meta/stats
exports.getStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [total, outdatedCount, categoryStats] = await Promise.all([
      Resource.countDocuments(),
      Resource.countDocuments({ lastVerifiedAt: { $lt: thirtyDaysAgo } }),
      Resource.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const activeCount = await Resource.countDocuments({ status: 'Active' });

    res.status(200).json({
      success: true,
      data: {
        total,
        verifiedRecently: total - outdatedCount,
        flaggedOutdated: outdatedCount,
        activeCount,
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};
