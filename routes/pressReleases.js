const express = require('express');
const router = express.Router();
const PressReleaseService = require('../models/PressReleaseService');

// Get all press releases with optional filters
router.get('/', (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      category: req.query.category,
      status: req.query.status
    };
    
    const pressReleases = PressReleaseService.getAll(filters);
    res.json({ success: true, data: pressReleases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get press release by ID
router.get('/:id', (req, res) => {
  try {
    const pressRelease = PressReleaseService.getById(req.params.id);
    
    if (!pressRelease) {
      return res.status(404).json({ success: false, error: 'Press release not found' });
    }
    
    res.json({ success: true, data: pressRelease });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new press release
router.post('/', (req, res) => {
  try {
    const pressRelease = PressReleaseService.create(req.body);
    res.status(201).json({ success: true, data: pressRelease });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update press release
router.put('/:id', (req, res) => {
  try {
    const pressRelease = PressReleaseService.update(req.params.id, req.body);
    
    if (!pressRelease) {
      return res.status(404).json({ success: false, error: 'Press release not found' });
    }
    
    res.json({ success: true, data: pressRelease });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete press release
router.delete('/:id', (req, res) => {
  try {
    const deleted = PressReleaseService.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Press release not found' });
    }
    
    res.json({ success: true, message: 'Press release deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Distribute press release
router.post('/:id/distribute', (req, res) => {
  try {
    const pressRelease = PressReleaseService.distribute(req.params.id);
    
    if (!pressRelease) {
      return res.status(404).json({ success: false, error: 'Press release not found' });
    }
    
    res.json({ success: true, data: pressRelease, message: 'Press release distributed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = PressReleaseService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
