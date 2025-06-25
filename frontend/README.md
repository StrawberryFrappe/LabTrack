# LabTrack Frontend - Vue.js Laboratory Management System

A modern Vue.js web application for laboratory inventory and compound management, built with Vue 3, Vue Router, and comprehensive internationalization support.

## 🚀 Features

### **Current Release (v1.0.0 - TRL4+ Complete)**
- **Vue 3 SPA Architecture**: Complete single-page application with Vue Router 4
- **Internationalization (i18n)**: Support for English, Spanish, and Portuguese with persistent language preferences
- **Authentication System**: Two-role system (Admin/Visitor) with JWT-ready token management
- **Dashboard**: Real-time statistics and navigation with responsive design
- **Compounds Management**: Full CRUD operations with advanced search and filtering
- **Advanced Search System**: Query builder with AND/OR logic, saved searches, and 9 search operators
- **Pagination System**: Optimized performance with configurable page sizes and URL state management
- **Enhanced Validation**: Real-time validation with async uniqueness checks and cross-field validation
- **Inventory System**: Count sessions and inventory management workflows
- **Modern UI**: Tailwind CSS with responsive design and accessibility features
- **User Preferences**: Comprehensive settings for theme, language, notifications, and display options

### **🆕 Phase 2 TRL4 Enhancements**
- **Performance Optimization**: Pagination system handling large datasets efficiently
- **Enterprise Search**: Advanced query builder with complex filtering capabilities
- **Production Validation**: Comprehensive validation system with real-time feedback
- **Enhanced UX**: Visual validation indicators, loading states, and user feedback
- **Accessibility**: ARIA compliance and screen reader support throughout

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
│   ├── compounds/     # Compound management (enhanced)
│   ├── dashboard/     # Dashboard widgets
│   ├── inventory/     # Inventory management
│   ├── layout/        # Layout components
│   └── ui/            # Base UI components (enhanced)
├── composables/       # Vue composition functions
│   ├── useCompounds.js      # Enhanced compound management
│   ├── usePagination.js     # Pagination logic
│   ├── useAdvancedSearch.js # Search query builder
│   └── useValidation.js     # Validation system
├── locales/           # Internationalization files (expanded)
├── router/            # Vue Router configuration
├── services/          # API and service layer
├── views/             # Route component views
└── data/              # Mock data and types (60+ test compounds)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server (includes JSON server)
npm run dev

# Start individual components
npm run client  # Vite dev server only
npm run server  # JSON server only

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Development Status

**Current Phase**: TRL4+ (Technology Development Complete)
**Target**: Production-ready system with advanced features

### ✅ Phase 2 TRL4 Completed (Recent)
- **Pagination System**: High-performance pagination with URL state management
- **Advanced Search**: Enterprise-grade query builder with saved searches
- **Enhanced Validation**: Production-ready validation with real-time feedback
- **Performance Optimization**: Optimized for large datasets (tested with 60+ compounds)
- **Accessibility**: Full ARIA compliance and screen reader support
- **Enhanced UI/UX**: Professional-grade user interface with validation feedback

### ✅ Foundation Complete
- Vue 3 SPA with router-based navigation
- Complete internationalization system (EN/ES/PT)
- Authentication and authorization framework
- Dashboard with real-time statistics
- Enhanced compound browsing and filtering
- Inventory count session management
- Responsive UI with accessibility features
- Development tooling and build pipeline

### 🎯 Phase 3 (Current Priority)
- Complete CRUD modal integration
- Inventory system workflow completion
- Data import/export with enhanced validation
- Toast notification system
- Production backend integration

## 📚 Documentation

- [TODO Roadmap](./TODO.md) - Updated development roadmap and status
- [Phase 2 TRL4 Completion](./TASK2_ADVANCED_SEARCH_COMPLETED.md) - Advanced search implementation
- [Validation System](./TASK3_VALIDATION_COMPLETED.md) - Enhanced validation documentation
- [Internationalization Guide](./INTERNATIONALIZATION.md) - Complete i18n implementation details
- [Migration Guide](./MIGRATION.md) - Backend integration roadmap

## 🏗 Architecture

### Enhanced Component Architecture
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
