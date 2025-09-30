# Database Setup Guide

## 1. Create Neon Database
1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Copy the connection string (it looks like: `postgres://username:password@hostname/database?sslmode=require`)

## 2. Set Environment Variables
Create a `.env.local` file in your project root with:

```bash
DATABASE_URL="your-neon-connection-string-here"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

## 3. Push Schema and Seed Data
```bash
npm run db:push
npm run db:seed
```

## 4. Restart Dev Server
```bash
npm run dev
```

Then visit http://localhost:3000 to see your Adidas products!
