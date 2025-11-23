# TruthGuard - Complete Setup Guide

## Project Status: ✅ READY TO USE

The entire TruthGuard fraud detection app has been built and tested. The project successfully builds and is ready for deployment.

---

## Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Environment Variables**

Create a `.env` file in the root directory with your API credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_RD_API_KEY=your_reality_defender_api_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### 3. **Start Development Server**
```bash
npm run dev
```

### 4. **Build for Production**
```bash
npm run build:web
```

---

## Getting API Keys

### Supabase Authentication
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **Project Settings → API**
4. Copy your **Project URL** and **Anon/Public Key**
5. Enable email/password auth (Settings → Authentication)

### Reality Defender API
1. Sign up at [realitydefender.com](https://realitydefender.com)
2. Create an API key from your dashboard
3. Copy the API key to `.env`

### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Click **API Keys** in the sidebar
3. Create a new API key
4. Copy it to `.env`

---

## Project Features

### 🔐 Authentication
- Email/password signup and login
- Password reset functionality
- Protected routes with auth guards
- Automatic session management

### 🎬 Deepfake Detection
- Upload images or videos
- Real-time analysis using Reality Defender API
- Visual risk scoring
- Detailed explanations

### 💼 Job Fraud Detection
- Paste job posting text
- AI-powered scam analysis using GPT-4
- Identifies specific red flags
- Provides recommendations

### 🎨 UI/UX
- Modern, clean design
- Professional styling with React Native StyleSheet
- Responsive layouts
- Color-coded results (green/orange/red)
- Intuitive navigation

---

## Project Structure

```
TruthGuard/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with AuthProvider
│   ├── index.tsx                # Initial route handler
│   ├── auth/                    # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot.tsx
│   └── (protected)/             # Protected routes (require auth)
│       ├── _layout.tsx
│       ├── home.tsx             # Dashboard
│       ├── deepfake.tsx         # Deepfake detection
│       └── jobcheck.tsx         # Job fraud detection
├── components/                   # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ResultCard.tsx
│   └── ScoreGauge.tsx
├── lib/                         # Core business logic
│   ├── supabase.ts             # Supabase client setup
│   ├── auth-context.tsx        # Authentication context
│   ├── rd.ts                   # Reality Defender integration
│   └── openai.ts               # OpenAI integration
├── types/                       # TypeScript definitions
│   └── env.d.ts
├── assets/                      # Images and icons
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── app.json                    # Expo config
└── babel.config.js             # Babel configuration
```

---

## Key Files to Know

### Authentication (`lib/auth-context.tsx`)
- Provides `useAuth()` hook for accessing user and auth methods
- Handles signup, login, logout, password reset
- Manages auth state globally

### Reality Defender Integration (`lib/rd.ts`)
- `detectDeepfake(filePath)` - Analyzes media for deepfakes
- Returns: detection result, risk score, probability, explanation

### OpenAI Integration (`lib/openai.ts`)
- `analyzeJobPosting(jobDescription)` - Analyzes job text for fraud
- Returns: verdict, scam score, red flags, recommendations

---

## Development Notes

### TypeScript Support
The project is fully typed with TypeScript. Run type checking:
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Styling
All styles use React Native's `StyleSheet.create()` for performance and type safety. No CSS frameworks needed.

### Navigation
Uses Expo Router v6 with file-based routing:
- `app/` directory = routes
- `(protected)` = route group requiring authentication
- `_layout.tsx` = layout component

---

## Common Tasks

### Add a New Screen
1. Create a file in `app/` or subdirectory
2. Export default React component
3. Styles use `StyleSheet.create()`
4. Use `useRouter()` for navigation

### Add a New Component
1. Create file in `components/`
2. Export as named export
3. Import and use in screens

### Add New API Integration
1. Create file in `lib/` (e.g., `lib/newapi.ts`)
2. Export main function
3. Import in screens where needed

---

## Deployment

### Web Deployment (Vercel)
```bash
npm run build:web
# Deploy dist/ folder to Vercel
```

### Expo Go Preview
```bash
npm run dev
# Scan QR code with Expo Go app
```

### Native Build
```bash
eas build --platform ios
eas build --platform android
```
(Requires EAS account: eas.expo.dev)

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules/.cache
npm install
npm run build:web
```

### Auth Not Working
- Verify Supabase URL and keys in `.env`
- Check Supabase project is active
- Confirm auth is enabled in Supabase settings

### API Calls Failing
- Verify API keys are valid and active
- Check API rate limits
- Review console for detailed error messages

### Styling Issues
- Use `StyleSheet.create()` for all styles
- Reference style objects: `style={styles.container}`
- Array syntax for multiple styles: `style={[styles.base, styles.active]}`

---

## Next Steps

1. Fill in `.env` with your API credentials
2. Run `npm install` and `npm run dev`
3. Test the authentication flow
4. Upload a test image for deepfake detection
5. Paste a job posting for fraud detection
6. Deploy when ready

---

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **Expo Router**: https://docs.expo.dev/routing/introduction
- **Supabase**: https://supabase.com/docs
- **Reality Defender**: https://docs.realitydefender.com
- **OpenAI**: https://platform.openai.com/docs

---

## Build Status

✅ **Successfully Builds**
✅ **All Dependencies Installed**
✅ **TypeScript Configured**
✅ **Auth Integrated**
✅ **APIs Configured**
✅ **UI Components Ready**
✅ **Production Ready**

---

Enjoy using TruthGuard! 🛡️
