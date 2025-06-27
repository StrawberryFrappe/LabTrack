# LabTrack - Laboratory Management System

A comprehensive Vue.js application for laboratory inventory and compound management, featuring advanced inventory tracking, multi-language support, and modern web technologies.

## 🎯 Project Overview

LabTrack is designed for laboratory professionals to efficiently manage chemical compounds, track inventory levels, and maintain detailed records of all laboratory assets. The system provides intuitive interfaces for compound registration, inventory counting sessions, and transaction history.

## 🏗 Repository Structure

```
LabTrack/
├── .github/                  # GitHub workflows and configurations
├── frontend/                 # Vue.js application
│   ├── src/                 # Application source code
│   ├── public/              # Static assets
│   ├── db.json              # Development database
│   └── package.json         # Frontend dependencies
├── sampleData/              # Excel sample data files
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd LabTrack

# Navigate to frontend and install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server with API
npm run client   # Start only frontend (Vite)
npm run server   # Start only API server (json-server)
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌟 Key Features

### 🧪 Compound Management
- **CRUD Operations**: Create, read, update, delete compounds
- **Detail Views**: Comprehensive compound information modals
- **Instance Management**: Track individual compound instances
- **Advanced Search**: Multi-criteria search with saved queries
- **Batch Operations**: Import/export via Excel/CSV

### 📦 Inventory Management
- **Stock Tracking**: Real-time inventory levels
- **Transaction History**: Complete audit trail
- **Counting Sessions**: Systematic inventory verification
- **Quick Transactions**: Fast inventory adjustments
- **Stock Alerts**: Low stock notifications

### 🌍 Internationalization
- **Multi-language**: English, Spanish, Portuguese
- **Feature-based Structure**: Modular translation system
- **Real-time Switching**: Dynamic language changes
- **Complete Coverage**: All UI elements internationalized

### 🔐 Authentication & Security
- **Role-based Access**: Admin/Visitor permissions
- **Session Management**: Secure token handling
- **Protected Routes**: Authentication guards
- **User Preferences**: Personalized settings

## 🛠 Technology Stack

### Frontend
- **Vue 3**: Composition API with `<script setup>`
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first styling
- **Vue Router 4**: Client-side routing
- **Vue I18n 9**: Internationalization
- **Axios**: HTTP client for API communication

### Development Tools
- **JSON Server**: Development API server
- **ExcelJS & PapaParse**: Data import/export
- **Concurrently**: Run multiple processes
- **ESLint & Prettier**: Code quality (future)

## 📊 Sample Data

The `sampleData/` directory contains Excel files with real laboratory data:
- Laboratory inventory lists
- Reagent numbering systems
- Supply requests
- Equipment catalogs

## 🏃‍♂️ Development Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Development integration branch

### Code Standards
- Vue 3 Composition API with `<script setup>`
- Tailwind CSS for all styling
- Feature-based component organization
- Comprehensive internationalization
- TypeScript-ready architecture

## 🔧 Configuration

### Environment Setup
The application uses a nested structure with the Vue.js app in the `frontend/` directory. All development commands should be run from within the `frontend/` directory.

### Database
Development uses JSON Server with `db.json` for rapid prototyping. The database includes:
- User authentication
- Compound definitions
- Inventory transactions
- Session tracking

## 📈 Project Status

**Current Version**: v0.3.0-unified  
**TRL Level**: 4+ (Technology Readiness Level)  
**Status**: Feature-complete for core functionality

### Recent Achievements
- ✅ Complete inventory session management
- ✅ Instance-based compound tracking
- ✅ Advanced search and filtering
- ✅ Multi-language support (EN/ES/PT)
- ✅ Transaction history and audit trails
- ✅ Data import/export capabilities

## 🤝 Contributing

1. Ensure all user-facing text is internationalized
2. Follow Vue 3 Composition API patterns
3. Use Tailwind CSS for styling
4. Maintain responsive design principles
5. Add appropriate validation and error handling

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for laboratory professionals
