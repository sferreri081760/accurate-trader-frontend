# 🎯 Accurate Trader Frontend

Professional trading signals platform frontend built with Next.js and TypeScript.

## 🚀 **Live Demo**

- **Frontend**: Coming soon (Vercel deployment)
- **Backend API**: https://trading-signals-backend-q0ks.onrender.com

## 📊 **About Accurate Trader**

Accurate Trader is a professional trading signals platform that provides institutional-grade trading strategies with complete performance transparency. Our platform features:

- **5 Advanced Trading Strategies**: Candlestick, Cup with Handle + Double Bottom, Trend Following, Support-Resistance, and MidpointTwo
- **Real-Time Performance Charts**: Interactive visualizations of strategy performance
- **Complete Transparency**: Full data processing pipeline demonstration
- **Professional Risk Management**: Sophisticated exit systems and position sizing

## 🛠️ **Tech Stack**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Authentication**: JWT tokens with HTTP-only cookies
- **Deployment**: Vercel
- **API**: REST API connection to Flask backend

## 🏗️ **Architecture**

```
Frontend (Vercel)     →     Backend (Render)
├── Next.js App             ├── Flask API
├── React Components        ├── Performance Data
├── Strategy Pages          ├── User Authentication
├── Performance Charts      ├── File Uploads
└── YouTube Integration     └── Subscription Management
```

## 📁 **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── strategies/         # Trading strategy pages
│   ├── performance/        # Performance charts & transparency
│   ├── subscriber/         # Subscriber-only content
│   └── admin/             # Admin dashboard
├── components/            # Reusable React components
├── config/               # API configuration
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sferreri081760/accurate-trader-frontend.git
   cd accurate-trader-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 🔧 **Configuration**

### **API Connection**
The frontend connects to the backend API configured in `src/config/api.ts`:

```typescript
const API_BASE_URL = 'https://trading-signals-backend-q0ks.onrender.com';
```

### **Environment Variables**
Create `.env.local` for local development:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000  # For local backend testing
```

## 🎬 **YouTube Integration**

The transparency page features YouTube video integration. To configure:

1. **Upload your transparency video to YouTube**
2. **Update video ID in:** `src/app/performance/transparency/page.tsx`
3. **Replace:** `YOUR_VIDEO_ID_HERE` with your actual YouTube video ID

## 📈 **Features**

### **🎯 Trading Strategies**
- **Strategy Pages**: Detailed explanations and performance metrics
- **Interactive Charts**: Real-time performance visualization
- **Risk Management**: Comprehensive exit systems documentation

### **📊 Performance Transparency**
- **Complete Data Pipeline**: TradeStation → Processing → Charts
- **YouTube Integration**: Video demonstration of data flow
- **Interactive Charts**: Historical performance with dual-axis display

### **🔐 User Management**
- **Authentication**: Secure login/registration system
- **Subscriptions**: Strategy-based access control
- **Admin Dashboard**: Chart uploads and user management

### **📱 Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Professional UI**: Clean, modern interface
- **Fast Loading**: Optimized images and code splitting

## 🚀 **Deployment**

### **Vercel Deployment**

1. **Connect to Vercel:**
   - Import project from GitHub
   - Framework: Next.js
   - Root Directory: `/` (repository root)

2. **Environment Variables:**
   ```bash
   NEXT_PUBLIC_API_URL=https://trading-signals-backend-q0ks.onrender.com
   ```

3. **Deploy:**
   - Vercel automatically builds and deploys
   - Updates on every push to main branch

### **Build Commands**
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## 🔗 **API Endpoints**

The frontend connects to these backend endpoints:

- `GET /api/strategies` - Strategy information
- `GET /api/performance/data` - Performance chart data
- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `GET /api/subscription/access` - Access validation

## 🤝 **Development Workflow**

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally:**
   ```bash
   npm run dev
   ```

3. **Build and check for errors:**
   ```bash
   npm run build
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature-name
   ```

5. **Deploy:** Merging to main triggers automatic Vercel deployment

## 📚 **Documentation**

- **Strategy Details**: Available at `/strategies`
- **Performance Data**: Available at `/performance`
- **API Documentation**: Backend repository
- **Transparency Video**: Available at `/performance/transparency`

## 🎯 **Key Pages**

- `/` - Homepage with strategy overview
- `/strategies` - Complete strategy listing
- `/strategies/[name]` - Individual strategy details
- `/performance` - Performance charts dashboard
- `/performance/transparency` - Data processing transparency
- `/subscriber/charts/[strategy]` - Subscriber-only charts

## 🔧 **Technology Choices**

- **Next.js**: Server-side rendering and optimal performance
- **TypeScript**: Type safety and better development experience  
- **Tailwind CSS**: Rapid UI development and consistent styling
- **Chart.js**: Professional-grade chart visualizations
- **Vercel**: Seamless deployment and global CDN

## 📞 **Support**

For technical issues or questions about the platform:
- **Repository Issues**: GitHub issues for bugs and feature requests
- **Email**: Contact through the platform's support page

## 📄 **License**

This project is proprietary software for Accurate Trader platform.

---

**Built with ❤️ for professional traders** 