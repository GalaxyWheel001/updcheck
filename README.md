# TurboPlay - Wheel of Fortune Game

A modern, responsive wheel of fortune game built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎡 Interactive wheel of fortune with smooth animations
- 🌍 Multi-language support (30+ languages)
- 🎨 Beautiful aviation-themed background with animated airplanes
- 📱 Fully responsive design
- 🎵 Sound effects and animations
- 🎯 Real-time currency conversion
- 🛡️ Bot protection and security features

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Audio**: Howler.js
- **Deployment**: Netlify

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment on Netlify

This project is configured for automatic deployment on Netlify:

1. **Connect your repository** to Netlify
2. **Build settings** are pre-configured in `netlify.toml`
3. **Environment variables** (if needed):
   - `NEXT_PUBLIC_SITE_URL`: Your production URL
   - `NEXT_PUBLIC_APP_NAME`: Your app name

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── wheel/            # Wheel game components
├── hooks/                # Custom React hooks
├── locales/              # Translation files
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

## Key Components

- **AviaMastersGame**: Main background with animated airplanes
- **WheelOfFortune**: Interactive wheel component
- **SpinResult**: Result display with animations
- **SupportChat**: Customer support integration

## Configuration Files

- `netlify.toml`: Netlify deployment configuration
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

## Features Removed

- ❌ Meta Pixel tracking
- ❌ Telegram notifications
- ❌ Development dependencies
- ❌ Build artifacts

## Production Ready

This project is optimized for production deployment with:
- ✅ Clean codebase (no unused files)
- ✅ Optimized bundle size
- ✅ Security headers
- ✅ Bot protection
- ✅ Edge functions
- ✅ Caching strategies

## License

Private project - All rights reserved.
