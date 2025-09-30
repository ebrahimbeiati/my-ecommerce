#!/bin/bash

echo "🚀 Setting up your ecommerce database..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database (Neon) - Replace with your actual Neon connection string
DATABASE_URL="postgres://user:password@localhost:5432/ecommerce?sslmode=require"

# Better Auth
AUTH_SECRET="your-secret-key-change-this-in-production"
AUTH_URL="http://localhost:3000"
EOF
    echo "✅ Created .env.local with placeholder values"
    echo "⚠️  Please update DATABASE_URL with your actual Neon connection string"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Get your Neon connection string from https://neon.tech"
echo "2. Update DATABASE_URL in .env.local"
echo "3. Run: npm run db:push"
echo "4. Run: npm run db:seed"
echo "5. Visit: http://localhost:3000"
echo ""
echo "🎉 Happy coding!"
