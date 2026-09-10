# Store Rating App

A full-stack Store Rating Application where users can rate stores from 1 to 5.

The application supports three roles:

- System Administrator
- Normal User
- Store Owner

Each role has different permissions and dashboard functionality.

# Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL

# Go to project folder
cd store-rating-app

# Backend installation
cd backend
npm install

# Create .env file and add your database/JWT configuration
# Then start backend
npm run dev

# Open a new terminal and go to frontend
cd ../frontend

# Frontend installation
npm install

# Start frontend
npm run dev

## Tech Stack

### Frontend

- React.js
- React Router
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database

- MySQL
- mysql2

## Project Structure

store-rating-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageUsers.jsx
│   │   │   │   ├── AddUser.jsx
│   │   │   │   ├── UserDetails.jsx
│   │   │   │   ├── ManageStores.jsx
│   │   │   │   └── AddStore.jsx
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   ├── RateStore.jsx
│   │   │   │   └── ChangePassword.jsx
│   │   │   │
│   │   │   └── owner/
│   │   │       └── OwnerDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   └── package.json
│
└── backend/
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── adminController.js
    │   ├── storeController.js
    │   ├── userStoreController.js
    │   ├── ratingController.js
    │   └── ownerController.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    ├── models/
    │   ├── userModel.js
    │   ├── adminModel.js
    │   ├── storeModel.js
    │   ├── userStoreModel.js
    │   ├── ratingModel.js
    │   └── ownerModel.js
    │
    ├── routes/
    │   ├── authRoute.js
    │   ├── adminRoutes.js
    │   ├── storeRoutes.js
    │   ├── userStoreRoutes.js
    │   ├── ratingRoutes.js
    │   └── ownerRoutes.js
    │
    ├── .env
    ├── .gitignore
    ├── server.js
    └── package.json