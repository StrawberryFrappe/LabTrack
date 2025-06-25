# LabTrack Frontend - Vue.js Laboratory Management System

A modern Vue.js web application for laboratory inventory and compound management, built with Vue 3, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server (includes API server)
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:3001

## 🏗 Technology Stack

- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vite**: Fast build tool and development server  
- **Tailwind CSS**: Utility-first CSS framework
- **Vue Router 4**: Client-side routing
- **Vue I18n**: Internationalization (EN/ES/PT)
- **JSON Server**: Development API server

## 📁 Project Structure

```
src/
├── components/         # Vue components organized by feature
│   ├── auth/          # Login and authentication
│   ├── compounds/     # Compound management (CRUD)
│   ├── dashboard/     # Dashboard widgets and stats
│   ├── inventory/     # Inventory management
│   ├── layout/        # Application layout
│   └── ui/            # Reusable UI components
├── composables/       # Vue composition functions
├── locales/           # Translation files (EN/ES/PT)
├── router/            # Vue Router configuration
├── services/          # API integration layer
├── views/             # Page-level components
└── utils/             # Utility functions
```

## 🎯 Core Features

- **Dashboard**: Overview with statistics and quick actions
- **Compounds**: Full CRUD operations with search and filtering
- **Inventory**: Count sessions and stock management
- **Authentication**: Role-based access (Admin/Visitor)
- **Internationalization**: Support for 3 languages
- **Responsive Design**: Mobile-friendly interface

## 🛠 Development Guidelines

### Code Standards
- Use Vue 3 Composition API with `<script setup>` syntax
- Apply Tailwind CSS utility classes for styling
- Follow Vue.js best practices for component structure
- Use modern ES6+ JavaScript features
- **All user-facing text must be internationalized** - never hardcode strings

### Component Architecture
- Keep components focused and reusable
- Use composables for shared logic
- Maintain responsive design with Tailwind utilities
- Follow accessibility best practices

## 📚 Documentation

For detailed project information:
- **[TODO.md](./TODO.md)** - Development roadmap and timeline
- **[STATUS.md](./STATUS.md)** - Detailed functionality status
- **[INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)** - i18n implementation guide

## 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run client     # Start only frontend (Vite)
npm run server     # Start only API server (JSON Server)
```

## 🌐 Authentication

Default development credentials:
- **Admin**: admin / admin123
- **Visitor**: visitor / visitor123

## 📝 Getting Help

1. Check the [STATUS.md](./STATUS.md) for feature implementation details
2. Review [TODO.md](./TODO.md) for known issues and roadmap
3. Examine existing components for patterns and examples
4. All components are well-documented with inline comments

---

**Framework**: Vue 3 + Vite + Tailwind CSS  
**Last Updated**: June 2025
