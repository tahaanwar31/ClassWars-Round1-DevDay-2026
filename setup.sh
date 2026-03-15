#!/bin/bash

echo "🚀 ClassWars Full Stack Setup"
echo "=============================="

# Check if MongoDB is running
echo ""
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   or provide MongoDB Atlas connection string in backend/.env"
fi

# Backend Setup
echo ""
echo "🔧 Setting up Backend..."
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please update MONGODB_URI in backend/.env"
fi

npm install
echo "✅ Backend dependencies installed"

# Admin Dashboard Setup
echo ""
echo "🔧 Setting up Admin Dashboard..."
cd ../admin-dashboard
npm install
echo "✅ Admin Dashboard dependencies installed"

# Frontend Setup
echo ""
echo "🔧 Setting up Frontend..."
cd ..
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update backend/.env with your MongoDB connection string"
echo "2. Build and seed the backend:"
echo "   cd backend"
echo "   npm run build"
echo "   npm run seed"
echo "3. Create admin account:"
echo "   curl -X POST http://localhost:5000/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@classwars.com\",\"password\":\"admin123\"}'"
echo ""
echo "🚀 To start all services:"
echo "   Terminal 1: cd backend && npm run start:dev"
echo "   Terminal 2: cd admin-dashboard && npm run dev"
echo "   Terminal 3: npm run dev"
echo ""
