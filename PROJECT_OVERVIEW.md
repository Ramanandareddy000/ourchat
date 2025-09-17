# Project Overview

This repository contains a full-stack chat application with a React frontend and a NestJS backend.

## Project Structure

```
ourschat/
├── react/           # React frontend application
└── server/          # NestJS backend server
```

## React Frontend (./react)

The frontend is a React application built with TypeScript and Vite.

### Key Files and Directories

- `package.json` - Project dependencies and scripts
  - Dependencies include React, React Router, Material UI, and Axios
  - Scripts for development (`dev`), building (`build`), and preview (`preview`)

- `vite.config.ts` - Vite configuration
  - Configures development server on port 3000
  - Sets up proxy for API requests to backend (localhost:3002)

- `index.html` - Main HTML template

- `src/` - Source code directory
  - `main.tsx` - Application entry point
  - `App.tsx` - Main application component
  - `App.scss` - Global styles
  - `api/` - Axios instance with interceptors for API communication
  - `components/` - Reusable UI components
  - `config/` - Configuration files
  - `constants/` - Application constants
  - `hooks/` - Custom React hooks
  - `modules/` - Feature modules
  - `services/` - API service functions
  - `styles/` - SCSS style files
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions

- `public/` - Static assets

- `.env` - Environment variables
- `.env.example` - Example environment variables
- `.gitignore` - Files and directories to ignore in Git

### Authentication

The frontend implements token-based authentication using JWT. See `AUTHENTICATION.md` for details on:
- Authentication service methods (login, register, logout)
- Protected routes implementation
- API service creation
- Authentication hooks
- Environment variable configuration

## NestJS Backend (./server)

The backend is a NestJS application using TypeScript with PostgreSQL database via Sequelize ORM.

### Key Files and Directories

- `package.json` - Project dependencies and scripts
  - Dependencies include NestJS core modules, Sequelize for database ORM, and JWT for authentication
  - Scripts for building, starting in different modes, testing, and linting

- `src/` - Source code directory
  - `main.ts` - Application entry point
  - `app.module.ts` - Root application module
  - `app.controller.ts` - Main application controller
  - `app.service.ts` - Main application service
  - `database/` - Database configuration and connection
  - `users/` - User management module (authentication, registration)
  - `messages/` - Message handling module
  - `models/` - Database models
  - `exceptions/` - Custom exception filters
  - `seed.ts` - Database seeding script

- `test/` - Test files

- `.env` - Environment variables
- `.env.example` - Example environment variables
- `.gitignore` - Files and directories to ignore in Git

### Authentication

The backend implements JWT authentication. See `JWT_AUTHENTICATION.md` for details on:
- JwtService for token generation and verification
- AuthController for login and registration endpoints
- AuthGuard for protecting routes
- ProfileController for user profile endpoint
- Environment variable configuration

### Database

The application uses PostgreSQL with Sequelize ORM:
- Configuration in `src/database/`
- Models defined in `src/models/`
- Seeding capability with `npm run seed`

## Development Workflow

1. Start the backend server:
   ```bash
   cd server
   npm run start:dev
   ```

2. Start the frontend development server:
   ```bash
   cd react
   npm run dev
   ```

3. Access the application at http://localhost:3000

The frontend proxies API requests to the backend running on http://localhost:3002.