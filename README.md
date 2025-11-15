# Task Management System

A complete full-stack Task Management System built with Node.js, TypeScript, Prisma, and Next.js.

## Features

### Backend API
- ✅ User authentication (Register, Login, Logout)
- ✅ JWT-based security with Access and Refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Complete CRUD operations for tasks
- ✅ Pagination, filtering, and searching
- ✅ TypeScript throughout
- ✅ Prisma ORM with PostgreSQL
- ✅ Proper validation and error handling

### Frontend
- ✅ Responsive web application with Next.js (App Router)
- ✅ Login and Registration pages
- ✅ Task Dashboard with filtering and searching
- ✅ Full CRUD functionality for tasks
- ✅ Toast notifications for user feedback
- ✅ Modern, responsive UI with Tailwind CSS

## Project Structure

```
TaskManagerAssignment/
├── backend/          # Node.js + TypeScript + Prisma API
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Auth middleware
│   │   └── utils/    # Utilities
│   └── prisma/       # Prisma schema
└── frontend/         # Next.js + TypeScript frontend
    ├── app/          # Next.js App Router pages
    ├── components/   # React components
    └── lib/          # API client and utilities
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_ACCESS_SECRET="your-access-token-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-token-secret-key-change-this"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be running on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Tasks
- `GET /tasks` - Get all tasks (with pagination, filtering, searching)
  - Query params: `page`, `limit`, `status`, `search`
- `GET /tasks/:id` - Get a single task
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/:id/toggle` - Toggle task status

## Usage

1. Start the backend server first
2. Start the frontend server
3. Open `http://localhost:3000` in your browser
4. Register a new account or login
5. Start managing your tasks!

## Technologies Used

### Backend
- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- express-validator

### Frontend
- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- Axios
- react-hot-toast
