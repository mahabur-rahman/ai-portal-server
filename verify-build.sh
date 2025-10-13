#!/bin/bash

# Docker Build Verification Script
# This script helps verify that your Docker build will work in CI/CD

echo "🔍 Verifying Docker build setup..."

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "❌ .env.prod file not found!"
    echo "📋 Available .env files:"
    ls -la .env* || echo "No .env files found"
    exit 1
else
    echo "✅ .env.prod file exists"
fi

# Check if Dockerfile exists
if [ ! -f Dockerfile ]; then
    echo "❌ Dockerfile not found!"
    exit 1
else
    echo "✅ Dockerfile exists"
fi

# Check if .dockerignore exists
if [ ! -f .dockerignore ]; then
    echo "❌ .dockerignore not found!"
    exit 1
else
    echo "✅ .dockerignore exists"
fi

# Check if .env.prod is excluded from .dockerignore
if grep -q "\.env\.prod" .dockerignore; then
    echo "❌ .env.prod is excluded in .dockerignore!"
    echo "   This will cause build failures."
    exit 1
else
    echo "✅ .env.prod is not excluded in .dockerignore"
fi

# Try a dry-run build (if Docker is available)
if command -v docker &> /dev/null; then
    echo "🐳 Testing Docker build (dry run)..."
    if docker build --dry-run . >/dev/null 2>&1; then
        echo "✅ Docker build syntax is valid"
    else
        echo "❌ Docker build syntax error!"
        exit 1
    fi
else
    echo "⚠️  Docker not available for testing"
fi

echo ""
echo "🎉 All checks passed! Your Docker build should work correctly."
echo ""
echo "📝 To run this script:"
echo "   chmod +x verify-build.sh"
echo "   ./verify-build.sh"
