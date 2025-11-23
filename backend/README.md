# TruthGuard Backend API

Backend server with Cloudinary and Reality Defender integration.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Get your Cloudinary API secret:
   - Go to https://console.cloudinary.com/
   - Login
   - Go to Settings → Security
   - Copy your API Secret

3. Configure environment variables in `.env`:
```
PORT=3000
REALITY_DEFENDER_API_KEY=your_rd_key_here
CLOUDINARY_CLOUD_NAME=dhvo3gnuz
CLOUDINARY_API_KEY=941895863925954
CLOUDINARY_API_SECRET=your_cloudinary_secret_here
```

4. Start the server:
```bash
npm start
```

## How It Works

1. User uploads media file → Backend receives it
2. Backend uploads file to Cloudinary → Gets URL
3. Backend sends Cloudinary URL to Reality Defender API
4. Reality Defender analyzes → Returns result
5. Backend formats response → Sends to frontend app

## API Endpoints

### POST /api/detect-deepfake
Upload a media file for deepfake detection.

**Request:**
- Content-Type: multipart/form-data
- Body: file (image or video)

**Response:**
```json
{
  "result": "REAL" | "FAKE" | "SUSPECT",
  "riskScore": 0-100,
  "probability": 0-1,
  "explanation": "Analysis details",
  "cloudinaryUrl": "https://...",
  "detailedModels": [...]
}
```

### GET /health
Health check endpoint.
