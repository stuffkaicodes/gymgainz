# 🚀 Quick Start Guide - Gym Tracker

## ⚡ Fastest Way to Get Running

### Step 1: Database (2 minutes)
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE gym_app;
USE gym_app;

# Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
);

EXIT;
```

### Step 2: Backend Setup (3 minutes)
```bash
cd gym-app/backend

# Install packages
npm install

# Create .env file
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=gym_app
DB_PORT=3306

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=GENERATE_A_LONG_RANDOM_STRING_HERE

# Optional - for GIF search (get from Google Cloud Console)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CX=your_custom_search_cx_here

# Optional - for exercise data (or use local data)
GOOGLE_SHEETS_SPREADSHEET_ID=1ZdCztT7mk5h7Bx_NrYRYxmrVoXajBljpoRJlMAFugGo
GOOGLE_CREDENTIALS_PATH=./credentials.json

ALLOWED_ORIGINS=http://localhost:3000
EOF

# Edit the .env file to add your passwords
nano .env

# Start backend
npm start
```

### Step 3: Frontend Setup (2 minutes)
```bash
# In a NEW terminal
cd gym-app/frontend

# Install packages
npm install

# Create .env file (optional - defaults work)
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:3001/api
EOF

# Start frontend
npm start
```

Your app should open at http://localhost:3000! 🎉

## 🔑 Generate JWT Secret

Run this command and paste the output into your backend .env file:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎯 First Time Usage

1. **Register** a new account at http://localhost:3000
2. **Login** with your credentials
3. **Choose a routine** (Push/Pull/Legs)
4. **Start tracking** your workouts!

## ⚠️ Troubleshooting

### "Cannot connect to database"
- Check MySQL is running: `sudo systemctl status mysql`
- Verify password in backend/.env
- Ensure gym_app database exists

### "JWT_SECRET not configured"
- Generate a secret with the command above
- Add it to backend/.env

### "GIFs not loading"
- GIFs are optional! The app works without them
- To enable: Get Google API credentials
- Add to backend/.env

## 📱 What You Get

✅ Secure authentication (bcrypt + JWT)
✅ Push/Pull/Legs workout routines
✅ Exercise GIFs for proper form
✅ Previous workout tracking
✅ Workout history
✅ Progress statistics
✅ Mobile-responsive design

## 🎓 Key Improvements Over Old Code

| Old Code | New Code |
|----------|----------|
| Plain text passwords | Bcrypt hashing |
| Random JWT secrets | Consistent secure tokens |
| SQL injection risks | Parameterized queries |
| Everything in one file | Clean architecture |
| No error handling | Comprehensive error handling |
| No caching | Smart caching (5 min) |
| Broken GIF loading | ✅ Working GIF display |

## 📚 Learn More

- Full README: `/gym-app/README.md`
- API Documentation: Check backend/src/routes/*.js
- Architecture: See folder structure in README

Happy lifting! 💪
