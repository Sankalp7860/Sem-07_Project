const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { RealityDefender } = require('@realitydefender/realitydefender');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Reality Defender
const realityDefender = new RealityDefender({
  apiKey: process.env.REALITY_DEFENDER_API_KEY,
});

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

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Deepfake detection endpoint
app.post('/api/detect-deepfake', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    console.log('File received and saved to:', filePath);
    console.log('File details:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      exists: fs.existsSync(filePath)
    });

    // Verify file exists before processing
    if (!fs.existsSync(filePath)) {
      throw new Error('File was not saved properly');
    }

    // Analyze with Reality Defender directly
    console.log('Analyzing with Reality Defender...');
    const result = await realityDefender.detect({
      filePath: filePath,
    });

    console.log('Detection result:', result);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Map Reality Defender response to our app's format
    const response = {
      result: mapStatusToResult(result.status),
      riskScore: Math.round((result.score || 0) * 100),
      probability: result.score || 0,
      explanation: `Analysis complete. Status: ${result.status}. Confidence score: ${((result.score || 0) * 100).toFixed(1)}%`,
      detailedModels: result.models || [],
    };

    res.json(response);
  } catch (error) {
    console.error('Detection error:', error);
    
    // Clean up local file if it still exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: error.message || 'Failed to analyze media',
    });
  }
});

// Helper function to map Reality Defender status to our app's format
function mapStatusToResult(status) {
  const statusUpper = (status || '').toUpperCase();
  
  if (statusUpper.includes('AUTHENTIC') || statusUpper.includes('REAL')) {
    return 'REAL';
  } else if (statusUpper.includes('MANIPULATED') || statusUpper.includes('FAKE')) {
    return 'FAKE';
  } else {
    return 'SUSPECT';
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Reality Defender API initialized`);
});
