const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer to preserve file extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Keep original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check ML service health
    const mlHealth = await axios.get(`${ML_SERVICE_URL}/health`);
    res.json({ 
      status: 'ok', 
      message: 'Backend server is running',
      mlService: mlHealth.data
    });
  } catch (error) {
    res.json({ 
      status: 'ok', 
      message: 'Backend server is running',
      mlService: 'unavailable'
    });
  }
});

// Deepfake detection endpoint
app.post('/api/detect-deepfake', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path;
    console.log('File received:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: filePath
    });

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('File was not saved properly');
    }

    // Forward to ML service
    console.log('Forwarding to ML service...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const mlResponse = await axios.post(
      `${ML_SERVICE_URL}/api/detect-deepfake`,
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('ML Service response:', mlResponse.data);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Return ML service result
    res.json(mlResponse.data);

  } catch (error) {
    console.error('Detection error:', error.message);
    
    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }

    // Handle ML service errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error || 'ML service error'
      });
    }

    res.status(500).json({
      error: 'Failed to analyze media. Please try again.'
    });
  }
});

// Job fraud analysis endpoint
app.post('/api/analyze-job', async (req, res) => {
  try {
    console.log('Analyzing job posting...');
    
    const jobData = req.body;
    
    if (!jobData || Object.keys(jobData).length === 0) {
      return res.status(400).json({ error: 'No job data provided' });
    }

    // Forward to ML service
    const mlResponse = await axios.post(
      `${ML_SERVICE_URL}/api/analyze-job`,
      jobData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('ML Service response:', mlResponse.data);

    // Return ML service result
    res.json(mlResponse.data);

  } catch (error) {
    console.error('Job analysis error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error || 'ML service error'
      });
    }

    res.status(500).json({
      error: 'Failed to analyze job posting. Please try again.'
    });
  }
});

// Get ML models information
app.get('/api/models/info', async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/api/models/info`);
    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve model information'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`TrustLens Backend Server`);
  console.log('='.repeat(60));
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`ML Service URL: ${ML_SERVICE_URL}`);
  console.log('='.repeat(60));
  console.log('Endpoints:');
  console.log(`  POST /api/detect-deepfake - Deepfake detection`);
  console.log(`  POST /api/analyze-job - Job fraud analysis`);
  console.log(`  GET  /health - Health check`);
  console.log('='.repeat(60));
});
