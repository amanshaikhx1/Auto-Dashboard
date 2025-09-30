# Business Analytics Platform

## Overview

This is a full-stack business analytics platform built with React, Express, and TypeScript. The application allows users to upload business data files (CSV, Excel, JSON), intelligently map columns to 183+ predefined business fields, and visualize comprehensive analytics across multiple domains including financial, customer, product, operational, and marketing metrics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management
- Zustand for client-side state management
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**State Management:**
- **Global State (Zustand)**: Manages the analytics workflow state including current section, processed data, metrics, and error handling through `analytics-store.ts`
- **Server State (TanStack Query)**: Configured for API data fetching with custom query client that handles authentication and error states
- **Component State**: Local React state for UI interactions and temporary form data

**Component Architecture:**
- Page components (`dashboard.tsx`, `not-found.tsx`) handle routing and layout
- Dashboard components organized by domain: `summary-metrics`, `trends-analysis`, `product-analysis`, `customer-analysis`, `financial-analysis`, `operational-analysis`, `marketing-analysis`
- Shared UI components from shadcn/ui for consistent design
- Custom components for specialized features like `file-upload` and `column-mapping`

**Data Processing:**
- Client-side data processing using `data-processor.ts` handles CSV (PapaParse), Excel (xlsx), and JSON parsing
- Column mapping engine (`column-mapper.ts`) with 183 predefined business fields across 11 categories
- Intelligent field detection using pattern matching, keyword analysis, and data type inference

### Backend Architecture

**Technology Stack:**
- Express.js for REST API server
- TypeScript for type safety
- Drizzle ORM for database operations
- Neon serverless PostgreSQL for data persistence
- Session management with connect-pg-simple

**Server Structure:**
- `server/index.ts`: Main entry point with middleware setup, request logging, and error handling
- `server/routes.ts`: API route registration (currently minimal, designed for extension)
- `server/storage.ts`: Storage abstraction layer with interface-based design
  - `IStorage` interface defines CRUD operations
  - `MemStorage` provides in-memory implementation
  - Designed to be swapped for database-backed storage

**Middleware Stack:**
- JSON body parsing with raw body preservation for webhook verification
- URL-encoded form data support
- Request/response logging with timing metrics
- Error handling and response capture

### Database Architecture

**Schema Design (Drizzle ORM):**
- PostgreSQL dialect with Neon serverless connector
- Current schema (`shared/schema.ts`) includes:
  - `users` table with UUID primary keys, username, and password fields
  - Schema validation using Drizzle-Zod integration

**Migration Strategy:**
- Migrations stored in `./migrations` directory
- Schema changes managed through Drizzle Kit
- Push-based deployment with `db:push` script

**Storage Interface Pattern:**
- Abstraction layer allows switching between in-memory and database storage
- Interface-driven design (`IStorage`) enables easy testing and implementation swapping
- Current implementation uses `MemStorage` for development
- Production should implement database-backed storage using Drizzle ORM

### Build and Deployment

**Development Mode:**
- Vite dev server with HMR for frontend
- tsx for running TypeScript server directly
- Separate client and server processes

**Production Build:**
- Frontend: Vite bundles React app to `dist/public`
- Backend: esbuild bundles server to `dist/index.js` with ESM format
- Static file serving in production mode

**Replit Integration:**
- Custom Vite plugins for Replit-specific features (error overlay, cartographer, dev banner)
- Environment detection via `REPL_ID`

### External Dependencies

**Data Processing:**
- PapaParse: CSV parsing and generation
- xlsx: Excel file reading and writing
- File size limit: 10MB enforced client-side

**UI Component Library:**
- shadcn/ui (New York style variant) with Radix UI primitives for 30+ components
- Tailwind CSS with custom color scheme and design tokens
- Recharts for data visualization (charts, graphs)

**Database:**
- Neon serverless PostgreSQL as the primary database
- Connection via `@neondatabase/serverless` package
- Drizzle ORM for type-safe database queries

**Authentication/Sessions:**
- Session storage using connect-pg-simple (PostgreSQL-backed sessions)
- Currently minimal auth implementation, designed for expansion

**Development Tools:**
- Replit-specific plugins for enhanced DX
- Runtime error modal overlay
- Development banner

### Key Architectural Decisions

**Single-Page Application:**
- **Rationale**: Better user experience for data analysis workflows, no page reloads during navigation
- **Trade-offs**: Initial load time vs. subsequent navigation speed, SEO considerations minimal for analytics tool

**Client-Side Data Processing:**
- **Rationale**: Reduces server load, enables immediate feedback, works with large files
- **Pros**: Better performance, offline capability, reduced backend complexity
- **Cons**: Browser memory limits, security considerations for sensitive data

**In-Memory Storage Default:**
- **Rationale**: Simplifies initial development and testing
- **Migration Path**: Interface-based design allows seamless transition to database storage
- **Considerations**: Data persistence requires implementation of database-backed storage class

**Intelligent Column Mapping:**
- **Rationale**: Reduces manual configuration, improves user onboarding
- **Approach**: 183 predefined business fields with fuzzy matching and confidence scoring
- **Extensibility**: Field definitions in `BUSINESS_FIELDS` array can be easily extended

**Monorepo Structure:**
- **Rationale**: Shared types between client and server, simplified deployment
- **Organization**: `/client`, `/server`, `/shared` directories with path aliases
- **Benefits**: Type safety across full stack, reduced duplication