# Okkyno.com - Professional Gardening E-commerce Platform

## Overview

Okkyno.com is a comprehensive e-commerce platform specializing in gardening supplies, tools, and educational content. The application provides a modern, responsive shopping experience with features including product catalog management, user authentication, shopping cart functionality, blog system, and admin dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for global state (Auth, Cart, Search) combined with TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication (prepared for Passport.js integration)
- **API Design**: RESTful API with structured error handling and validation

### Build System
- **Bundler**: Vite for fast development and optimized production builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development**: Hot module replacement and fast refresh in development

## Key Components

### Database Schema (Drizzle ORM)
- **Users**: Authentication and profile management with role-based access
- **Categories**: Product categorization system
- **Products**: Comprehensive product catalog with pricing, inventory, and metadata
- **Blog Posts**: Content management for educational articles
- **Orders & Cart**: E-commerce transaction handling
- **Comments & Testimonials**: User-generated content systems

### Authentication System
- Session-based authentication with cookie management
- Role-based access control (customer/admin roles)
- User registration and login with form validation
- Protected routes for admin functionality

### E-commerce Features
- Product catalog with search, filtering, and categorization
- Shopping cart with session persistence
- Checkout process with form validation
- Order management system
- Inventory tracking

### Content Management
- Blog system with rich content support
- Category-based content organization
- Admin dashboard for content management
- Image handling and optimization

### Admin Dashboard
- Product management (CRUD operations)
- Order tracking and management
- Blog post creation and editing
- User management capabilities

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Layer**: Express.js routes handle requests with validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Processing**: Data is formatted and returned to client
5. **State Management**: TanStack Query caches and synchronizes server state
6. **UI Updates**: React components re-render based on state changes

### Authentication Flow
1. User submits login credentials
2. Server validates against database
3. Session cookie is set for authenticated users
4. Protected routes check authentication status
5. User context provides authentication state to components

### Shopping Cart Flow
1. Cart items are stored with session ID
2. Local storage maintains session persistence
3. Cart operations sync with backend API
4. Real-time updates across components via React Context

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- TanStack Query for server state management
- Express.js for backend API

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Development Tools
- TypeScript for type safety
- Vite for build tooling and development server
- ESBuild for production bundling

### Database and ORM
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (Neon serverless)
- Database migrations and schema management

## Deployment Strategy

### Development Environment
- Replit integration with live reloading
- Local development server on port 5000
- Environment variable management for database connections

### Production Deployment
- Netlify hosting with serverless functions
- Static site generation for optimal performance
- CDN delivery for assets and images
- Environment-specific configuration

### Database Strategy
- Development: In-memory database for rapid development
- Production: PostgreSQL with connection pooling
- Migration system for schema updates
- Backup and recovery procedures

## Changelog

```
Changelog:
- June 14, 2025. Migration completed from Replit Agent to Replit environment
  - 190 products with authentic Unsplash images across 8 categories
  - Fixed data consistency issues (no more mismatched images)
  - Admin authentication system working (admin/admin123)
  - Auto-redirect to /admin dashboard for admin users
  - Video content integrated for featured products
  - Complete e-commerce functionality operational
- June 13, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```