# TruthGuard - AI Fraud Detection App

A production-ready React Native + Expo application for detecting deepfakes and fraudulent job postings using AI.

## Features

- **Supabase Authentication**: Email/password authentication with signup, login, and password reset
- **Deepfake Detection**: Upload images/videos and analyze them using Reality Defender API
- **Job Fraud Detection**: Analyze job postings for scam indicators using OpenAI GPT
- **Clean UI**: Modern, professional design with StyleSheet
- **Protected Routes**: Secure navigation with authentication guards

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router
- **Authentication**: Supabase
- **Styling**: React Native StyleSheet
- **APIs**:
  - Reality Defender for deepfake detection
  - OpenAI GPT-4 for job fraud analysis

## Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn
3. Expo CLI (`npm install -g expo-cli`)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_RD_API_KEY=your_reality_defender_api_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

#### Getting API Keys:

**Supabase:**
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy URL and anon/public key

**Reality Defender:**
1. Sign up at [realitydefender.com](https://realitydefender.com)
2. Get API key from dashboard

**OpenAI:**
1. Create account at [platform.openai.com](https://platform.openai.com)
2. Go to API Keys section
3. Create new API key

### 3. Run the App

```bash
# Start development server
npm run dev

# Build for web
npm run build:web
```

### 4. Access the App

- Web: Open the URL shown in terminal (usually http://localhost:8081)
- iOS: Scan QR code with Camera app
- Android: Scan QR code with Expo Go app

## Project Structure

```
├── app/
│   ├── (protected)/          # Protected routes requiring authentication
│   │   ├── _layout.tsx       # Protected routes layout with auth guard
│   │   ├── home.tsx          # Home dashboard
│   │   ├── deepfake.tsx      # Deepfake detection screen
│   │   └── jobcheck.tsx      # Job fraud detection screen
│   ├── auth/                 # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot.tsx
│   ├── index.tsx             # Initial route handler
│   └── _layout.tsx           # Root layout with AuthProvider
├── components/               # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ResultCard.tsx
│   └── ScoreGauge.tsx
├── lib/                      # Core logic and API integrations
│   ├── supabase.ts           # Supabase client setup
│   ├── auth-context.tsx      # Authentication context provider
│   ├── rd.ts                 # Reality Defender API integration
│   └── openai.ts             # OpenAI API integration
└── types/                    # TypeScript type definitions
    └── env.d.ts
```

## Usage

### Authentication

1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account
3. **Reset Password**: Request password reset link via email

### Deepfake Detection

1. Navigate to "Deepfake Detection" from home
2. Upload an image or video
3. Tap "Analyze Media"
4. View results:
   - Detection result (REAL/FAKE/SUSPECT)
   - Risk score
   - Confidence level
   - Detailed explanation

### Job Fraud Detection

1. Navigate to "Job Fraud Detection" from home
2. Paste job posting text
3. Tap "Analyze Job Posting"
4. Review analysis:
   - Safety verdict
   - Scam score (0-100)
   - Red flags identified
   - Recommendations
   - Detailed explanation

## Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear metro cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Authentication Issues

- Verify Supabase URL and keys are correct
- Check Supabase dashboard for auth settings
- Ensure email confirmation is disabled (or handle accordingly)

### API Errors

- Verify all API keys are valid and active
- Check API rate limits
- Review API documentation for any changes

## Notes

- Email confirmation is disabled by default in Supabase
- This app targets web as the primary platform
- Some native-only APIs may not work on web

## License

MIT

## Support

For issues or questions, please contact the development team or create an issue in the repository.
