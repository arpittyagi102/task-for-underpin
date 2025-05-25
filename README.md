# Next.js + Express.js Full Stack Starter Template

A modern full-stack starter template featuring Next.js for the frontend and Express.js for the backend, with built-in authentication using JWT, TypeScript, TailwindCSS, and Redux Toolkit.

## 🚀 Features

### Frontend (Next.js)

- ⚡️ Next.js 15 with App Router
- 🔥 TypeScript for type safety
- 🎨 TailwindCSS for styling
- 📦 Redux Toolkit for state management
- 🔐 JWT Authentication
- 🎯 ESLint for code quality

### Backend (Express.js)

- ⚡️ Express.js 5
- 🔥 TypeScript for type safety
- 🔐 JWT Authentication with bcrypt
- 🗄️ MongoDB with Mongoose
- 🔒 CORS enabled

## 📦 Project Structure

```
│────frontend/                       # Next.js frontend application
│    ├── src/                        # Source files
│    │   ├── app/                    # App Router (pages & layouts)
│    │   │   ├── page.tsx            # Root page
│    │   │   ├── layout.tsx          # Root layout
│    │   │   └── auth/               # Auth routes (login, register, etc.)
│    │   │       ├── login/          # /auth/login route
│    │   │       └── signup/         # /auth/sign route
│    │   │   
│    │   ├── components/             # Reusable React components
│    │   ├── hooks/                  # Custom React hooks
│    │   ├── store/                  # Redux Toolkit store
│    │   ├── styles/                 # Tailwind/global styles
│    │   └── utils/                  # Utility functions
│    ├── public/                     # Static files (images, favicon, etc.)
│    └── package.json                # Frontend dependencies
│
├── backend/                         # Express.js backend application
│   ├── src/                         # Source files
│   │   ├── controllers/             # Route controllers
│   │   ├── middleware/              # Express middleware (auth, error, etc.)
│   │   ├── models/                  # Mongoose models
│   │   ├── routes/                  # Express routes
│   │   │   ├── auth.routes.ts       # Auth routes (login, register)
│   │   │   └── user.routes.ts       # User routes (profile, etc.)
│   │   ├── utils/                   # Utility functions
│   │   └── index.ts                 # Entry point
│   └── package.json                 # Backend dependencies
│ 
└── package.json                     # Root package.json for workspace


## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or Atlas)

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/arpittyagi102/nextjs-express-starter
   cd nextjs-express-starter
   ```

2. Install dependencies for all packages:

   ```bash
   npm run install-all
   ```

3. Set up environment variables:

   - Create `.env.local` file in the backend directory
   - Add the following variables:
     ```
     PORT=3001
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers:

   In separate terminals:

   ```bash
   # Start backend server
   npm run server

   # Start frontend server
   npm run client
   ```

   The frontend will be available at `http://localhost:3000`
   The backend will be available at `http://localhost:3001`

## 📚 Available Scripts

### Root Directory

- `npm run install-all` - Install dependencies for all packages
- `npm run client` - Start frontend development server
- `npm run server` - Start backend development server

### Frontend Directory

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the Next.js application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Backend Directory

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript files
- `npm run start` - Start production server

## 🔐 Authentication

The template includes a complete authentication system:

- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- Token refresh mechanism


## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
