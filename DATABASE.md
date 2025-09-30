# Database Setup Guide

## 📁 Database Structure

```
src/db/
├── index.ts          # Main database exports
├── client.ts         # Neon connection & Drizzle client
└── schema.ts         # Database schema definitions

scripts/
├── seed.ts           # Seed script with sample data
└── migrate.ts        # Migration helper script
```

## 🚀 Quick Start

### 1. Set up Neon Database
```bash
# Go to https://neon.tech and create a free database
# Copy your connection string
```

### 2. Configure Environment
```bash
# Create .env.local file
echo 'DATABASE_URL="your-neon-connection-string"' > .env.local
echo 'AUTH_SECRET="your-secret-key"' >> .env.local
echo 'AUTH_URL="http://localhost:3000"' >> .env.local
```

### 3. Push Schema & Seed Data
```bash
# Push schema to database
npm run db:push

# Seed with sample Adidas products
npm run db:seed

# Start development server
npm run dev
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate migration files from schema |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Insert sample data |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:migrate` | Test database connection |

## 🗃️ Database Schema

### Products Table
- `id` - Primary key (serial)
- `slug` - Unique product identifier
- `title` - Product name
- `description` - Product description
- `brand` - Brand name (e.g., "Adidas")
- `priceCents` - Price in cents (integer)
- `currency` - Currency code (default: "USD")
- `imageUrl` - Product image URL
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is set in `.env.local`
- Check that your Neon database is active
- Verify the connection string format

### Schema Issues
- Run `npm run db:generate` to create migrations
- Use `npm run db:push` to apply changes
- Check Drizzle Studio with `npm run db:studio`

## 📊 Sample Data

The seed script includes 5 Adidas products:
- Ultraboost 1.0 ($180.00)
- Stan Smith ($85.00)
- Samba ($100.00)
- Gazelle ($90.00)
- NMD R1 ($120.00)
