# PDF Editor & AI Enhancer - MicroSaaS

A comprehensive PDF editing and AI enhancement platform with both web and mobile applications.

## 🚀 Features

### Web Application (Next.js)
- **PDF Upload & Viewing**: Upload and view PDF documents with zoom, navigation controls
- **PDF Editing**: Basic PDF manipulation (merge, split, watermark, text extraction)
- **AI Resume Enhancer**: AI-powered resume improvement with multiple enhancement types
- **Photo to PDF Converter**: Convert images to structured PDF documents using OCR and AI
- **PDF Summarization**: AI-powered PDF content summarization
- **Authentication**: User authentication with Supabase
- **Subscription Management**: Stripe-powered subscription tiers

### Mobile Application (React Native)
- **PDF Viewer**: Native PDF viewing with touch controls
- **Camera Integration**: Capture photos and convert to PDF
- **File Management**: Local file storage and management
- **Cross-platform**: iOS and Android support

### Backend Services
- **Node.js API**: PDF manipulation and file handling
- **Python AI Services**: FastAPI microservices for AI features
- **Dockerized**: Containerized services for easy deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │  Mobile App     │
│   (Next.js)     │    │ (React Native)  │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────┐
          │   Supabase       │
          │   (Auth & DB)    │
          └──────────┬───────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌──────▼──────┐    ┌───▼────┐
│Backend │    │ AI Services │    │Stripe  │
│(Node.js)│    │ (Python)   │    │Payment │
└────────┘    └────────────┘    └────────┘
```

## 🛠️ Tech Stack

### Frontend (Web)
- **Framework**: Next.js 14 with TypeScript
- **UI**: TailwindCSS + ShadCN/UI
- **PDF**: react-pdf, pdf-lib
- **Auth**: Supabase Auth
- **Payments**: Stripe

### Frontend (Mobile)
- **Framework**: React Native with Expo
- **UI**: React Native Paper
- **PDF**: react-native-pdf
- **Camera**: Expo Camera
- **Auth**: Supabase SDK

### Backend
- **API**: Node.js + Express + TypeScript
- **PDF Processing**: pdf-lib
- **File Upload**: Multer
- **Auth**: Supabase

### AI Services
- **Framework**: FastAPI (Python)
- **AI**: OpenAI GPT-4
- **OCR**: Tesseract + OpenCV
- **PDF**: PyMuPDF, ReportLab
- **Deployment**: Docker

## 📦 Project Structure

```
pdf-editor/
├── web-app/                 # Next.js web application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # Utilities and configs
│   │   └── types/         # TypeScript types
│   └── package.json
├── mobile-app/              # React Native mobile app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── components/     # React components
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API services
│   │   └── contexts/       # React contexts
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Express middleware
│   └── package.json
├── ai-services/             # Python AI microservices
│   ├── services/           # AI service implementations
│   ├── main.py            # FastAPI app
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Docker configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- Python 3.11+
- Docker (for AI services)
- Supabase account
- Stripe account
- OpenAI API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pdf-editor
```

### 2. Set Up Environment Variables

#### Web App
```bash
cd web-app
cp env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Backend
```bash
cd backend
cp env.example .env
```

Edit `.env`:
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
AI_SERVICE_URL=http://localhost:8000
```

#### AI Services
```bash
cd ai-services
cp env.example .env
```

Edit `.env`:
```env
OPENAI_API_KEY=your_openai_api_key
```

### 3. Install Dependencies

#### Web App
```bash
cd web-app
npm install
```

#### Mobile App
```bash
cd mobile-app
npm install
```

#### Backend
```bash
cd backend
npm install
```

#### AI Services
```bash
cd ai-services
pip install -r requirements.txt
```

### 4. Start the Services

#### Start AI Services (Docker)
```bash
cd ai-services
docker-compose up -d
```

#### Start Backend API
```bash
cd backend
npm run dev
```

#### Start Web App
```bash
cd web-app
npm run dev
```

#### Start Mobile App
```bash
cd mobile-app
npm run start
```

## 🔧 Development

### Web App Development
- Runs on http://localhost:3000
- Hot reload enabled
- TypeScript support
- TailwindCSS for styling

### Mobile App Development
- Use Expo Go app for testing
- Run `npm run ios` or `npm run android` for device testing
- Metro bundler for hot reload

### Backend API Development
- Runs on http://localhost:3001
- TypeScript compilation
- Hot reload with nodemon
- API documentation at http://localhost:3001/health

### AI Services Development
- Runs on http://localhost:8000
- FastAPI with automatic documentation
- API docs at http://localhost:8000/docs
- Docker for consistent environment

## 📱 Mobile App Features

### Screens
- **Home**: Main dashboard with feature cards
- **Camera**: Photo capture and gallery selection
- **PDF Viewer**: Native PDF viewing with controls
- **Documents**: File management and history

### Navigation
- Bottom tab navigation
- Stack navigation for detailed views
- Deep linking support

## 🌐 Web App Features

### Pages
- **Upload**: PDF file upload with drag & drop
- **Viewer**: PDF viewing with zoom and navigation
- **AI Resume**: Resume enhancement interface
- **Photo to PDF**: Image conversion interface

### Components
- **PDFViewer**: React PDF component with controls
- **PDFUpload**: Drag & drop file upload
- **ResumeEnhancer**: AI-powered resume improvement
- **PhotoToPDFConverter**: Image to PDF conversion

## 🤖 AI Services

### Resume Enhancer
- Professional tone enhancement
- ATS optimization
- Achievement-focused restructuring
- Skills enhancement
- Quantified results addition

### Photo to PDF Converter
- OCR text extraction
- AI content structuring
- Document type recognition
- PDF generation

### PDF Summarizer
- Brief summaries
- Detailed summaries
- Bullet point extraction
- Executive summaries

## 💳 Payment Integration

### Stripe Integration
- Web: Stripe Checkout
- Mobile: Stripe React Native SDK
- Subscription management
- Webhook handling

### Subscription Tiers
- **Free**: Basic PDF viewing
- **Pro**: AI features, advanced editing
- **Enterprise**: Full feature access

## 🚀 Deployment

### Docker Deployment
```bash
# AI Services
cd ai-services
docker-compose up -d

# Backend (with PM2)
cd backend
npm run build
pm2 start dist/index.js

# Web App (Vercel/Netlify)
cd web-app
npm run build
# Deploy to Vercel or Netlify
```

### Environment Setup
1. Set up Supabase project
2. Configure Stripe account
3. Set up OpenAI API key
4. Configure environment variables
5. Deploy services

## 📊 API Endpoints

### Backend API (Port 3001)
- `POST /api/pdf/merge` - Merge PDFs
- `POST /api/pdf/split` - Split PDF
- `POST /api/pdf/watermark` - Add watermark
- `POST /api/pdf/extract-text` - Extract text
- `POST /api/pdf/info` - Get PDF info
- `POST /api/ai/enhance-resume` - Enhance resume
- `POST /api/ai/photo-to-pdf` - Convert photo to PDF
- `POST /api/ai/summarize-pdf` - Summarize PDF

### AI Services (Port 8000)
- `POST /enhance-resume` - Resume enhancement
- `POST /photo-to-pdf` - Photo to PDF conversion
- `POST /summarize-pdf` - PDF summarization
- `GET /health` - Health check

## 🔒 Security

- CORS configuration
- File upload validation
- Rate limiting
- Input sanitization
- Environment variable protection

## 📈 Monitoring

- Health check endpoints
- Error logging
- Performance monitoring
- User analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Roadmap

- [ ] Advanced PDF editing features
- [ ] Collaborative editing
- [ ] Real-time synchronization
- [ ] Advanced AI features
- [ ] Mobile app store deployment
- [ ] Enterprise features
- [ ] API rate limiting
- [ ] Advanced analytics
