# TrustLens ML Service

Machine Learning microservice for TrustLens app providing deepfake detection and job fraud classification.

## Features

- **Deepfake Detection**: Analyze images and videos for deepfake indicators
- **Job Fraud Detection**: Classify job postings as legitimate or fraudulent
- **RESTful API**: Flask-based API for easy integration
- **Pretrained Models**: Uses CNN-based models for accurate predictions

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Service

```bash
python app.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Deepfake Detection
```
POST /api/detect-deepfake
Content-Type: multipart/form-data

file: <image or video file>
```

Response:
```json
{
  "success": true,
  "result": "Fake" | "Real",
  "riskScore": 85,
  "probability": 0.85,
  "explanation": "Analysis complete...",
  "details": {
    "blur_detection": 0.6,
    "artifact_detection": 0.7,
    "consistency_check": 0.5
  }
}
```

### Job Fraud Analysis
```
POST /api/analyze-job
Content-Type: application/json

{
  "title": "Job Title",
  "description": "Job description",
  "company": "Company Name",
  "requirements": "Requirements",
  "salary": "Salary info",
  "location": "Location"
}
```

Response:
```json
{
  "success": true,
  "is_fraudulent": true,
  "risk_score": 75,
  "confidence": 0.75,
  "fraud_indicators": ["List of red flags"],
  "explanation": "Analysis result"
}
```

### Model Information
```
GET /api/models/info
```

## Models

### Deepfake Detector
- **Architecture**: CNN-based image classifier
- **Features**: Blur detection, artifact analysis, consistency checking
- **Input**: Images (PNG, JPG, JPEG) or Videos (MP4, AVI, MOV)
- **Output**: Authenticity score with detailed analysis

### Job Fraud Detector
- **Type**: Text classification model
- **Features**: Keyword analysis, pattern detection, risk scoring
- **Input**: Job posting text data
- **Output**: Fraud probability with identified red flags

## Technology Stack

- **Framework**: Flask 3.0.0
- **ML Libraries**: PyTorch, OpenCV, NumPy
- **Image Processing**: Pillow, torchvision
- **CORS**: flask-cors for cross-origin requests

## Integration with Backend

The Node.js backend connects to this ML service for processing:

```javascript
// Backend calls ML service
const response = await fetch('http://localhost:5000/api/detect-deepfake', {
  method: 'POST',
  body: formData
});
```

## Development Notes

- Models are loaded once at startup for efficiency
- Uploaded files are automatically cleaned up after processing
- Supports both CPU and GPU inference (CUDA if available)
- Maximum file size: 50MB
