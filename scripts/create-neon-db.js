#!/usr/bin/env node

console.log(`
🚀 Quick Neon Database Setup

1. Go to https://neon.tech
2. Sign up/login (it's free!)
3. Click "Create Project"
4. Choose a name like "ecommerce-app"
5. Select a region close to you
6. Click "Create Project"
7. Copy the connection string (it looks like: postgres://username:password@hostname/database?sslmode=require)

Then run these commands:

# Create .env.local with your connection string
echo 'DATABASE_URL="your-connection-string-here"' > .env.local
echo 'AUTH_SECRET="your-secret-key-here"' >> .env.local
echo 'AUTH_URL="http://localhost:3000"' >> .env.local

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Restart dev server
npm run dev

🎉 Your Adidas products will appear at http://localhost:3000!
`);
