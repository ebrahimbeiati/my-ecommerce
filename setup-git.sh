#!/bin/bash

echo "🚀 Setting up Git for your e-commerce project..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files (respecting .gitignore)
echo "📝 Adding files to Git..."
git add .

# Check how many files we're about to commit
file_count=$(git status --short | wc -l)
echo "📊 Found $file_count files to commit"

# Show what we're committing
echo "📋 Files to be committed:"
git status --short | head -10

if [ $file_count -gt 10 ]; then
    echo "... and $((file_count - 10)) more files"
fi

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🚀 Initial commit: Next.js e-commerce app with TypeScript, Tailwind, Drizzle ORM, Better Auth, and Zustand

Features:
- Next.js 15 with TypeScript and Tailwind CSS
- Drizzle ORM with Neon PostgreSQL
- Better Auth for authentication
- Zustand for state management
- Shopping cart functionality
- Product catalog with Adidas sample data
- Responsive design with custom icons"

echo "✅ Git setup complete!"
echo "📊 Final file count: $(git status --short | wc -l) files"
echo ""
echo "🎯 Next steps:"
echo "1. Create a GitHub repository"
echo "2. Add remote: git remote add origin <your-repo-url>"
echo "3. Push: git push -u origin main"
