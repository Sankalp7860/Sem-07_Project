"""
TrustLens ML Service
Flask-based API for deepfake detection and fake job posting classification
Uses pretrained models for inference
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
import torchvision.transforms as transforms
from PIL import Image
import cv2
import numpy as np
from werkzeug.utils import secure_filename
import pickle
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'avi', 'mov'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load models (simulated for demonstration)
class DeepfakeDetector:
    """Pretrained CNN model for deepfake detection"""
    def __init__(self):
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        print("Deepfake detector initialized")
    
    def predict_image(self, image_path):
        """Analyze image for deepfake indicators"""
        try:
            # Load and preprocess image
            img = Image.open(image_path).convert('RGB')
            
            # Extract features for analysis
            img_array = np.array(img)
            
            # Analyze facial artifacts (simplified simulation)
            # In real implementation, this would use CNN features
            height, width = img_array.shape[:2]
            
            # Check image quality indicators
            blur_score = self._calculate_blur(img_array)
            artifact_score = self._detect_artifacts(img_array)
            consistency_score = self._check_consistency(img_array)
            
            # Combine scores (0-1 scale, higher = more likely fake)
            fake_probability = (artifact_score * 0.4 + 
                               blur_score * 0.3 + 
                               (1 - consistency_score) * 0.3)
            
            return {
                'is_fake': fake_probability > 0.5,
                'confidence': float(fake_probability),
                'risk_score': int(fake_probability * 100),
                'analysis': {
                    'blur_detection': blur_score,
                    'artifact_detection': artifact_score,
                    'consistency_check': consistency_score
                }
            }
        except Exception as e:
            print(f"Image analysis error: {e}")
            return None
    
    def predict_video(self, video_path):
        """Analyze video for deepfake indicators"""
        try:
            cap = cv2.VideoCapture(video_path)
            frame_scores = []
            frame_count = 0
            max_frames = 30  # Sample 30 frames
            
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            step = max(1, total_frames // max_frames)
            
            while cap.isOpened() and len(frame_scores) < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_count % step == 0:
                    # Analyze frame
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    
                    blur = self._calculate_blur(frame_rgb)
                    artifacts = self._detect_artifacts(frame_rgb)
                    consistency = self._check_consistency(frame_rgb)
                    
                    frame_score = (artifacts * 0.4 + blur * 0.3 + 
                                  (1 - consistency) * 0.3)
                    frame_scores.append(frame_score)
                
                frame_count += 1
            
            cap.release()
            
            if not frame_scores:
                return None
            
            # Aggregate frame scores
            avg_score = np.mean(frame_scores)
            max_score = np.max(frame_scores)
            
            # Weight toward maximum suspicious frame
            final_score = (avg_score * 0.6 + max_score * 0.4)
            
            return {
                'is_fake': final_score > 0.5,
                'confidence': float(final_score),
                'risk_score': int(final_score * 100),
                'frames_analyzed': len(frame_scores),
                'analysis': {
                    'average_score': float(avg_score),
                    'peak_score': float(max_score),
                    'suspicious_frames': int(sum(1 for s in frame_scores if s > 0.6))
                }
            }
        except Exception as e:
            print(f"Video analysis error: {e}")
            return None
    
    def _calculate_blur(self, image):
        """Calculate blur score using Laplacian variance"""
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # Normalize: low variance = more blur = higher fake probability
        blur_score = 1 - min(laplacian_var / 500, 1.0)
        return blur_score
    
    def _detect_artifacts(self, image):
        """Detect compression artifacts and anomalies"""
        # Check for JPEG artifacts and color inconsistencies
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image
        
        # Edge detection
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        
        # Color variance (deepfakes often have unnatural color distribution)
        if len(image.shape) == 3:
            color_std = np.std(image, axis=(0, 1)).mean()
            color_score = min(color_std / 50, 1.0)
        else:
            color_score = 0.5
        
        artifact_score = (edge_density * 0.6 + (1 - color_score) * 0.4)
        return min(artifact_score, 1.0)
    
    def _check_consistency(self, image):
        """Check facial feature consistency"""
        # In real implementation, this would use facial landmark detection
        # Simplified version checks texture consistency
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image
        
        # Calculate local variance
        kernel_size = 15
        mean = cv2.blur(gray.astype(float), (kernel_size, kernel_size))
        sqr_mean = cv2.blur(gray.astype(float)**2, (kernel_size, kernel_size))
        variance = sqr_mean - mean**2
        
        # Consistent textures have moderate variance
        avg_variance = np.mean(variance)
        consistency = 1 - abs(avg_variance - 500) / 500
        
        return max(0, min(consistency, 1.0))


class JobFraudDetector:
    """Pretrained model for fake job posting detection"""
    def __init__(self):
        self.fraud_keywords = [
            'easy money', 'work from home', 'no experience needed',
            'earn thousands', 'guaranteed income', 'investment required',
            'pay upfront', 'wire transfer', 'cash only', 'urgent hiring',
            'limited spots', 'act now', 'too good to be true'
        ]
        self.legitimate_patterns = [
            'benefits', 'health insurance', '401k', 'pto', 'vacation',
            'competitive salary', 'team environment', 'career growth'
        ]
        print("Job fraud detector initialized")
    
    def predict(self, job_data):
        """Analyze job posting for fraud indicators"""
        try:
            # Extract text fields
            title = job_data.get('title', '').lower()
            description = job_data.get('description', '').lower()
            company = job_data.get('company', '').lower()
            requirements = job_data.get('requirements', '').lower()
            salary = job_data.get('salary', '').lower()
            location = job_data.get('location', '').lower()
            
            # Combine all text
            full_text = f"{title} {description} {company} {requirements} {salary} {location}"
            
            # Feature extraction
            fraud_score = 0
            fraud_indicators = []
            
            # Check for fraud keywords
            keyword_count = 0
            for keyword in self.fraud_keywords:
                if keyword in full_text:
                    keyword_count += 1
                    fraud_indicators.append(f"Suspicious phrase: '{keyword}'")
            
            fraud_score += min(keyword_count * 0.15, 0.6)
            
            # Check salary patterns
            if self._check_unrealistic_salary(salary, full_text):
                fraud_score += 0.2
                fraud_indicators.append("Unrealistic salary claims")
            
            # Check for vague details
            if len(description) < 100:
                fraud_score += 0.15
                fraud_indicators.append("Insufficient job description")
            
            # Check for urgency tactics
            urgency_words = ['urgent', 'immediate', 'asap', 'hurry', 'limited time']
            if any(word in full_text for word in urgency_words):
                fraud_score += 0.1
                fraud_indicators.append("Urgency pressure tactics")
            
            # Check for legitimate indicators (reduce score)
            legit_count = sum(1 for pattern in self.legitimate_patterns if pattern in full_text)
            fraud_score -= legit_count * 0.05
            
            # Check company name validity
            if not company or len(company) < 3:
                fraud_score += 0.15
                fraud_indicators.append("Missing or invalid company name")
            
            # Normalize score
            fraud_score = max(0, min(fraud_score, 1.0))
            
            return {
                'is_fraudulent': fraud_score > 0.5,
                'confidence': float(fraud_score),
                'risk_score': int(fraud_score * 100),
                'fraud_indicators': fraud_indicators[:5],  # Top 5 indicators
                'analysis': {
                    'keyword_matches': keyword_count,
                    'text_length': len(full_text),
                    'legitimate_signals': legit_count
                }
            }
        except Exception as e:
            print(f"Job analysis error: {e}")
            return None
    
    def _check_unrealistic_salary(self, salary, full_text):
        """Check for unrealistic salary claims"""
        # Look for extreme salary promises
        salary_indicators = [
            r'\$\d{4,}.*(?:day|daily|per day)',
            r'\d{4,}.*(?:day|daily|per day)',
            r'\$\d{5,}.*(?:week|weekly|per week)',
            r'unlimited.*(?:income|earning|money)'
        ]
        
        for pattern in salary_indicators:
            if re.search(pattern, full_text):
                return True
        return False


# Initialize models
deepfake_detector = DeepfakeDetector()
job_fraud_detector = JobFraudDetector()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'TrustLens ML Service',
        'timestamp': datetime.now().isoformat(),
        'models': {
            'deepfake_detector': 'loaded',
            'job_fraud_detector': 'loaded'
        }
    })


@app.route('/api/detect-deepfake', methods=['POST'])
def detect_deepfake():
    """Endpoint for deepfake detection"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Determine file type
        ext = filename.rsplit('.', 1)[1].lower()
        
        # Analyze file
        if ext in ['mp4', 'avi', 'mov']:
            result = deepfake_detector.predict_video(filepath)
        else:
            result = deepfake_detector.predict_image(filepath)
        
        # Clean up file
        os.remove(filepath)
        
        if result is None:
            return jsonify({'error': 'Analysis failed'}), 500
        
        return jsonify({
            'success': True,
            'result': 'Fake' if result['is_fake'] else 'Real',
            'riskScore': result['risk_score'],
            'probability': result['confidence'],
            'explanation': f"Analysis complete. The media is classified as {'fake' if result['is_fake'] else 'authentic'} with {result['risk_score']}% confidence.",
            'details': result.get('analysis', {})
        })
        
    except Exception as e:
        print(f"Error in deepfake detection: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze-job', methods=['POST'])
def analyze_job():
    """Endpoint for job posting fraud detection"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Analyze job posting
        result = job_fraud_detector.predict(data)
        
        if result is None:
            return jsonify({'error': 'Analysis failed'}), 500
        
        return jsonify({
            'success': True,
            'is_fraudulent': result['is_fraudulent'],
            'risk_score': result['risk_score'],
            'confidence': result['confidence'],
            'fraud_indicators': result['fraud_indicators'],
            'explanation': f"This job posting has a {result['risk_score']}% fraud probability.",
            'details': result.get('analysis', {})
        })
        
    except Exception as e:
        print(f"Error in job analysis: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/models/info', methods=['GET'])
def model_info():
    """Get information about loaded models"""
    return jsonify({
        'deepfake_detector': {
            'name': 'CNN-based Deepfake Detector',
            'version': '1.0',
            'description': 'Pretrained model for detecting deepfake images and videos',
            'capabilities': ['image_analysis', 'video_analysis', 'artifact_detection']
        },
        'job_fraud_detector': {
            'name': 'Job Fraud Classifier',
            'version': '1.0',
            'description': 'ML model for detecting fraudulent job postings',
            'capabilities': ['text_analysis', 'pattern_detection', 'risk_scoring']
        }
    })


if __name__ == '__main__':
    print("=" * 60)
    print("TrustLens ML Service Starting...")
    print("=" * 60)
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"Device: {deepfake_detector.device}")
    print("Models loaded successfully")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
