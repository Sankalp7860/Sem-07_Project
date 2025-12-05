# TrustLens Backend

Node.js Express backend that connects the React Native mobile app with the ML service for fraud detection.

## Architecture

```
Mobile App (React Native)
        ↓
Backend Server (Node.js/Express) ← You are here
        ↓
ML Service (Python/Flask)
        ↓
ML Models (Deepfake & Job Fraud Detection)
```

## Features

- **API Gateway**: Routes requests from mobile app to ML service
- **File Upload Handling**: Processes media files for deepfake detection
- **Data Forwarding**: Sends job posting data to ML service for analysis
- **Error Handling**: Manages errors and provides meaningful responses
- **CORS Support**: Enables cross-origin requests from mobile app

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
PORT=3000
ML_SERVICE_URL=http://localhost:5000
```

### 3. Run the Server

**Option 1: Using ML Service (Recommended)**
```bash
node server-ml.js
```

**Option 2: Using Reality Defender (Original)**
```bash
node server.js
```

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "mlService": {
    "status": "healthy",
    "service": "TrustLens ML Service"
  }
}
```

### Deepfake Detection
```
POST /api/detect-deepfake
Content-Type: multipart/form-data

file: <image or video file>
```

### Job Fraud Analysis
```
POST /api/analyze-job
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "company": "string",
  "requirements": "string",
  "salary": "string",
  "location": "string"
}
```

### Model Information
```
GET /api/models/info
```

## File Structure

```
backend/
├── server.js           # Original Reality Defender implementation
├── server-ml.js        # ML Service integration (use this)
├── package.json        # Dependencies
├── .env               # Environment variables
├── uploads/           # Temporary file storage
└── README.md          # This file
```

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **axios**: HTTP client for ML service communication
- **form-data**: Multipart form data
- **dotenv**: Environment variable management

## Integration Flow

### Deepfake Detection Flow:
1. Mobile app uploads file to backend (`/api/detect-deepfake`)
2. Backend saves file temporarily
3. Backend forwards file to ML service
4. ML service analyzes with pretrained models
5. ML service returns results
6. Backend forwards results to mobile app
7. Backend cleans up temporary file

### Job Fraud Analysis Flow:
1. Mobile app sends job data to backend (`/api/analyze-job`)
2. Backend forwards data to ML service
3. ML service analyzes with fraud detection model
4. ML service returns risk assessment
5. Backend forwards results to mobile app

## Error Handling

The backend handles various error scenarios:
- File upload errors
- ML service unavailability
- Invalid requests
- Processing failures
- Network timeouts

## Development Notes

- Files are automatically cleaned up after processing
- Maximum file size: 50MB
- Supports images (PNG, JPG, JPEG) and videos (MP4, AVI, MOV)
- ML service must be running on port 5000 for backend to work
- All routes are CORS-enabled for mobile app access

## Production Deployment

For production:
1. Set proper `ML_SERVICE_URL` in environment
2. Configure file size limits based on requirements
3. Implement request rate limiting
4. Add authentication middleware
5. Set up proper logging
6. Configure HTTPS
7. Use cloud storage for file uploads (S3, etc.)
