# 🎵 Interactive Portfolio

A modern, interactive portfolio website built with Next.js 14+, TypeScript, and Tailwind CSS. Features a Windows 98-inspired desktop interface with a functional media player, dynamic themes, and smooth animations.

## ✨ Features

- **🎨 Interactive Desktop Interface** - Windows 98-inspired UI with draggable windows
- **🎵 Functional Media Player** - Play music with visualizer and mixer controls
- **🌙 Dynamic Themes** - Multiple color schemes with smooth transitions
- **📱 Responsive Design** - Works perfectly on all devices
- **⚡ Performance Optimized** - Server-side rendering, code splitting, and asset optimization
- **🔒 Security Hardened** - Security headers, environment variable protection
- **📊 Monitoring Ready** - Error tracking and performance monitoring

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Audio**: Web Audio API
- **Deployment**: Vercel/Netlify ready

## 🎯 Performance Features

- ✅ **Strategic Rendering**: SSG for static content, dynamic imports for heavy components
- ✅ **Asset Optimization**: Next.js Image optimization, font optimization
- ✅ **Code Splitting**: Dynamic imports for media player and visualizer
- ✅ **Bundle Optimization**: Webpack optimizations, CSS purging
- ✅ **Security Headers**: XSS protection, content type options, frame options

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── desktop/           # Desktop interface
│   └── pages/             # Page components
├── components/            # React components
│   ├── window-content/    # Window content components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
├── styles/               # Global styles
└── types/                # TypeScript types
```

## 🎵 Media Player Features

- **Audio Playback**: Support for multiple audio formats
- **Visualizer**: Real-time audio visualization
- **Mixer Controls**: Volume, equalizer, effects
- **Playlist Management**: Organize and play music collections
- **Background Music**: Ambient audio for the desktop experience

## 🎨 Theme System

- **Solar**: Cyberpunk neon theme
- **Abyss**: Tropical sunset theme
- **Default**: Clean, modern theme
- **Custom**: Extensible theme system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file:
```bash
# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Optional: Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_DSN=your_sentry_dsn
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Quality Assurance
npm run quality-check   # Run all quality checks
npm run lint:check      # Check linting
npm run type-check      # Check TypeScript
npm run format:check    # Check formatting

# Security & Performance
npm run security-audit  # Security audit
npm run audit          # Performance audit
npm run monitoring:test # Test monitoring system

# Build Analysis
npm run analyze         # Analyze bundle size
npm run lighthouse     # Run Lighthouse audit
```

## 🔧 Build Process

The project includes a comprehensive build process with:

- **TypeScript**: Strict type checking
- **ESLint**: Code quality and security rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit and pre-push hooks
- **Security Audits**: Automated security checks
- **Performance Monitoring**: Core Web Vitals tracking

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Configure build workflow

## 📊 Monitoring & Analytics

The project includes built-in monitoring for:

- **Performance**: Core Web Vitals tracking
- **Errors**: Client and server-side error logging
- **Analytics**: Google Analytics and Vercel Analytics
- **Alerts**: Configurable alerting system

## 🔒 Security Features

- **Environment Variables**: Secure management of secrets
- **Security Headers**: XSS protection, content type options
- **Input Validation**: Type-safe data handling
- **Error Boundaries**: Graceful error handling
- **Audit Scripts**: Automated security checks

## 🎯 Performance Optimizations

- **Server-Side Rendering**: Static generation for content
- **Dynamic Imports**: Code splitting for heavy components
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **CSS Purging**: Tailwind CSS optimization

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks: `npm run quality-check`
5. Submit a pull request

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
