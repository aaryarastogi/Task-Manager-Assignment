# Task Manager Backend API

Node.js + TypeScript backend API for the Task Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_ACCESS_SECRET="your-access-token-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-token-secret-key-change-this"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run migrations:
```bash
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Documentation

See the main README.md for API endpoint documentation.

