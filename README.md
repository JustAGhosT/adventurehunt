# Adventure Hunt 🎯

A comprehensive scavenger hunt application designed specifically for children aged 6-12, featuring AI-powered hunt generation, real-time collaboration, and child-friendly safety features.

## ✨ Features

### 🤖 Multi-AI Collaboration Framework
- **Story Creator AI**: Generates engaging narrative themes
- **Geographic Expert AI**: Ensures location accuracy and cultural relevance  
- **Visual Generator AI**: Creates illustrations and visual clues
- **Safety Validator AI**: Reviews content for child safety
- **Creative Booster AI**: Adds interactive elements and animations

### 🎮 Core Functionality
- **Hunt Creation Wizard**: Multi-step hunt setup with themes, difficulty, and location types
- **Live Hunt Interface**: Real-time hunt participation with progress tracking
- **Interactive Elements**: Photo capture, audio clues, and micro-interactions
- **Achievement System**: Badges, certificates, and progress rewards
- **Safety Features**: Parental controls and emergency options

### 🎨 Design & Accessibility
- **Child-Friendly UI**: Rounded fonts, vibrant colors, and playful animations
- **WCAG 2.1 AA Compliant**: Screen reader support and high contrast mode
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Multi-Language Support**: Ready for internationalization

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Socket.IO** for real-time updates

### Backend
- **Node.js** with Express
- **PostgreSQL** with Prisma ORM
- **Socket.IO** for WebSocket communication
- **JWT** for authentication
- **Zod** for validation

### AI Integration
- Placeholder architecture for multiple AI services
- Conflict resolution and consensus building
- Async processing with status polling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/adventure-hunt.git
cd adventure-hunt
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. **Set up environment variables**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database and API keys
```

4. **Set up database**
```bash
# In the server directory
npm run prisma:migrate
npm run prisma:generate
```

5. **Start development servers**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗂️ Project Structure

```
adventure-hunt/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth, Audio)
│   ├── services/          # API and WebSocket services
│   └── styles/            # Global styles and animations
├── server/                # Backend API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic and AI orchestration
│   │   ├── middleware/    # Express middleware
│   │   └── index.ts       # Server entry point
│   └── prisma/           # Database schema and migrations
├── prisma/               # Database configuration
└── docs/                 # Documentation
```

## 🎯 Core Concepts

### Hunt Creation Process
1. **User Input**: Theme, difficulty, location type, duration
2. **AI Pipeline**: 5-step AI collaboration process
3. **Real-time Updates**: WebSocket progress notifications
4. **Safety Validation**: Automated content review
5. **Interactive Enhancement**: Audio, visual, and gamification elements

### Safety Features
- **Content Filtering**: Age-appropriate language and themes
- **Location Safety**: Avoid dangerous or inappropriate locations
- **Privacy Protection**: No personal information collection
- **Parental Controls**: Optional supervision mode
- **Emergency Features**: Quick exit and help buttons

### Multi-AI Architecture
```typescript
// AI Pipeline Flow
Story Creator → Geographic Expert → Visual Generator → 
Safety Validator → Creative Booster → Final Hunt
```

Each AI generates 2-3 variants, with conflict resolution prioritizing:
1. Safety
2. Geographic Accuracy  
3. Engagement
4. Creativity

## 🔧 Development

### Available Scripts
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint

# Backend
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run prisma:studio # Open Prisma Studio
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/adventure_hunt

# Authentication
JWT_SECRET=your-secret-key

# AI Services (TODO: Add actual keys)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-key

# External Services
MAPS_API_KEY=your-maps-key
AUDIO_SERVICE_URL=your-audio-service
```

## 🎨 Design System

### Color Palette
- **Primary**: Adventure Blue (#2563EB)
- **Secondary**: Nature Green (#059669)
- **Accent**: Sunshine Yellow (#EAB308)
- **Success**: Forest Green (#166534)
- **Warning**: Warm Orange (#EA580C)
- **Background**: Soft Cloud White (#F8FAFC)

### Typography
- **Font Family**: Nunito (rounded, child-friendly)
- **Weights**: 300, 400, 600, 700, 800, 900
- **Line Height**: 150% for body, 120% for headings

### Spacing System
- **Base Unit**: 8px
- **Scale**: 8px, 16px, 24px, 32px, 48px, 64px, 96px

## 🧪 Testing

### Test Categories
- **Unit Tests**: Components, utilities, business logic
- **Integration Tests**: API routes, database operations
- **End-to-End Tests**: Complete user journeys
- **Accessibility Tests**: WCAG compliance
- **Child User Testing**: Age-appropriate usability

### Running Tests
```bash
# Frontend tests
npm run test

# Backend tests
cd server
npm run test

# E2E tests
npm run test:e2e
```

## 📱 PWA Features

The application includes Progressive Web App capabilities:
- **Offline Support**: Cached content for offline play
- **Install Prompts**: Add to home screen functionality
- **Push Notifications**: Hunt completion and reminders
- **Background Sync**: Sync data when connection resumes

## 🔒 Security Features

### Data Protection
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Prevent abuse and spam
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers
- **JWT Authentication**: Secure token-based auth

### Child Safety
- **Content Moderation**: Automated inappropriate content detection
- **Location Filtering**: Avoid unsafe or inappropriate locations
- **No Personal Data**: Minimal data collection
- **Emergency Exits**: Quick escape routes in app

## 🌐 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CDN configured for static assets
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or AWS CloudFront
- **Backend**: Railway, Heroku, or AWS ECS
- **Database**: PlanetScale, Supabase, or AWS RDS
- **File Storage**: AWS S3 or Cloudinary

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code of conduct
- Development workflow
- Pull request process
- Issue reporting

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Design Inspiration**: Apple's Human Interface Guidelines
- **Accessibility**: WCAG 2.1 AA compliance standards
- **Child Safety**: COPPA and GDPR compliance guidelines
- **AI Ethics**: Responsible AI development practices

## 📞 Support

For questions, issues, or contributions:
- **Email**: support@adventurehunt.com
- **GitHub Issues**: [Create an issue](https://github.com/your-username/adventure-hunt/issues)
- **Discord**: [Join our community](https://discord.gg/adventurehunt)

---

Made with ❤️ for young adventurers and their families!