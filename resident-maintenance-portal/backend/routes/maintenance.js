const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createMaintenanceRequest,
  getOpenMaintenanceRequests,
  closeMaintenanceRequest
} = require('../models/dataStore');

const router = express.Router();

router.post('/maintenance-requests', (req, res) => {
  try {
    const { name, email, unitNumber, serviceType, summary, details } = req.body;
    
    if (!name || !email || !unitNumber || !serviceType || !summary) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, unitNumber, serviceType, summary' 
      });
    }
    
    const newRequest = createMaintenanceRequest({
      name,
      email,
      unitNumber,
      serviceType,
      summary,
      details: details || ''
    });
    
    res.status(201).json({
      message: 'Maintenance request created successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/maintenance-requests', authMiddleware, (req, res) => {
  try {
    const openRequests = getOpenMaintenanceRequests();
    res.json({
      requests: openRequests,
      count: openRequests.length
    });
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/maintenance-requests/:id/close', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = closeMaintenanceRequest(id);
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    res.json({
      message: 'Maintenance request closed successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error closing maintenance request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
