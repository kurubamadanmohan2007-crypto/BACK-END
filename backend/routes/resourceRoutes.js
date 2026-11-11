const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  verifyResource,
  upvoteResource,
  getStats,
} = require('../controllers/resourceController');

router.get('/meta/stats', getStats);
router.route('/').get(getResources).post(createResource);
router.route('/:id').get(getResourceById).put(updateResource).delete(deleteResource);
router.post('/:id/verify', verifyResource);
router.post('/:id/upvote', upvoteResource);

module.exports = router;
