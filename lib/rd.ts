const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export interface DeepfakeResult {
  result: 'REAL' | 'FAKE' | 'SUSPECT';
  riskScore: number;
  probability: number;
  explanation: string;
}

export async function detectDeepfake(
  filePath: string
): Promise<DeepfakeResult> {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Extract file info from URI
    const filename = filePath.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    // Append file to FormData
    formData.append('file', {
      uri: filePath,
      type: type,
      name: filename,
    } as any);

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/detect-deepfake`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      result: data.result || 'SUSPECT',
      riskScore: data.riskScore || 0,
      probability: data.probability || 0,
      explanation: data.explanation || 'Analysis completed',
    };
  } catch (error: any) {
    console.error('Deepfake detection error:', error);
    throw new Error(error.message || 'Failed to analyze media');
  }
}
