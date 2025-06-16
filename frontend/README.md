# LabTrack Frontend - Vue.js Laboratory Management System

A modern Vue.js web application for laboratory inventory and compound management, built with Vue 3, Vue Router, and comprehensive internationalization support.

## 🚀 Features

### **Current Release (v0.2.0)**
- **Vue 3 SPA Architecture**: Complete single-page application with Vue Router 4
- **Internationalization (i18n)**: Support for English, Spanish, and Portuguese with persistent language preferences
- **Authentication System**: Two-role system (Admin/Visitor) with JWT-ready token management
- **Dashboard**: Real-time statistics and navigation with responsive design
- **Compounds Management**: Browse, filter, and search chemical compounds with detailed views
- **Inventory System**: Count sessions and inventory management workflows
- **Modern UI**: Tailwind CSS with responsive design and dark/light theme support
- **User Preferences**: Comprehensive settings for theme, language, notifications, and display options

## 🛠 Technology Stack

- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vue Router 4**: Client-side routing with navigation guards
- **Vue I18n 9**: Internationalization with reactive language switching
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API integration
- **JSON Server**: Mock backend for development

## 📁 Project Structure

```
src/
├── components/         # Reusable Vue components
│   ├── auth/          # Authentication components
│   ├── compounds/     # Compound management
│   ├── dashboard/     # Dashboard widgets
│   ├── inventory/     # Inventory management
│   ├── layout/        # Layout components
│   └── ui/            # Base UI components
├── composables/       # Vue composition functions
├── locales/           # Internationalization files
├── router/            # Vue Router configuration
├── services/          # API and service layer
├── views/             # Route component views
└── data/              # Mock data and types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Development Status

**Current Phase**: TRL3 (Experimental Proof of Concept)
**Target**: 3-user system with core laboratory management features

### ✅ Completed
- Vue 3 SPA with router-based navigation
- Complete internationalization system
- Authentication and authorization framework
- Dashboard with real-time statistics
- Compound browsing and filtering
- Inventory count session management
- Responsive UI with theme system
- Development tooling and build pipeline

### 🎯 Next Phase (TRL3 Core Features)
- Real backend API integration
- Advanced compound management (CRUD operations)
- Enhanced inventory tracking
- Data import/export capabilities
- User management system
- Enhanced reporting and analytics

## 📚 Documentation

- [Internationalization Guide](./INTERNATIONALIZATION.md) - Complete i18n implementation details
- [Migration Guide](./MIGRATION.md) - Backend integration roadmap
- [TODO](./TODO.md) - Development roadmap and feature tracking

## 🏗 Architecture

### Component Architecture
- **Composition API**: All components use `<script setup>` syntax
- **Service Layer**: Dedicated services for API communication
- **Composables**: Reactive state management with Vue composables
- **Modular Design**: Feature-based component organization

### State Management
- **Authentication**: Persistent login with localStorage
- **User Preferences**: Language, theme, and app settings
- **Reactive Data**: Vue's reactive system for real-time updates
- **API Integration**: Axios-based service layer with error handling

### Routing & Navigation
- **Protected Routes**: Authentication guards for secure areas
- **Role-Based Access**: Admin/Visitor permission system
- **Lazy Loading**: Route-level code splitting for performance
- **Navigation Guards**: Automatic redirects and access control

## 🌐 Internationalization

Supports three languages with complete UI translation:
- **English** (en) - Default
- **Spanish** (es) - Complete translation
- **Portuguese** (pt) - Brazilian Portuguese

Language preference is automatically saved and restored across sessions.

## 🔧 Development

### Code Style
- Vue 3 Composition API with `<script setup>`
- Tailwind CSS for styling (no custom CSS)
- ES6+ JavaScript features
- Component-first architecture
- Responsive design principles

### Build System
- **Vite**: Fast development and optimized production builds
- **PostCSS**: Tailwind processing
- **Code Splitting**: Automatic route-based chunks
- **Asset Optimization**: Automatic asset bundling and optimization

## 📝 License

This project is part of the LabTrack laboratory management system.

---

**Version**: v0.2.0  
**Framework**: Vue 3 + Vite  
**Last Updated**: June 2025
