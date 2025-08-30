# 🎬 Movie Collection App

A full-stack web application for managing your personal movie collection with Google OAuth authentication, built using the MERN stack.

## ✨ Features

- **Google OAuth Authentication** - Secure login using Google accounts
- **CRUD Operations** - Add, read, update, and delete movies from your collection
- **Search & Filter** - Search movies by title or director
- **Pagination** - Browse large collections efficiently
- **Responsive Design** - Beautiful UI that works on all devices
- **Input Validation** - Server-side validation and sanitization
- **Comprehensive Testing** - Unit, integration, and component tests

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API calls
- **React Toastify** - User notifications
- **React Testing Library** - Component testing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for auth
- **Express Validator** - Input validation
- **Jest & Supertest** - Testing framework

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Cloud Console** account for OAuth setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-collection-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Update the `.env` file with your values:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/movie-collection
   
   # Google OAuth (Get from Google Cloud Console)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   
   # JWT & Session Secrets
   JWT_SECRET=your_very_secure_jwt_secret_here
   SESSION_SECRET=your_very_secure_session_secret_here
   
   # URLs
   CLIENT_URL=http://localhost:3000
   PORT=5001
   
   # Environment
   NODE_ENV=development
   ```

4. **Set up Google OAuth**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5001/api/auth/google/callback`
   - Add authorized origin: `http://localhost:3000`

5. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both the backend server (port 5001) and frontend client (port 3000).

## 📁 Project Structure

```
movie-collection-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (auth)
│   │   ├── styles/         # Styled components
│   │   └── __tests__/      # Component tests
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Passport configuration
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── tests/              # Backend tests
│   ├── utils/              # Utility functions
│   └── package.json
└── package.json           # Root package for scripts
```

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Run tests with coverage
npm run test:coverage
```

### Testing Strategy

The project follows Test-Driven Development (TDD) principles:

- **Unit Tests** - Model validation, utility functions
- **Integration Tests** - API endpoints, database operations
- **Component Tests** - React component behavior
- **End-to-End Tests** - User workflows (planned)

## 📚 API Documentation

### Authentication Endpoints

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Movie Endpoints

All movie endpoints require authentication.

- `GET /api/movies` - Get user's movies (with search & pagination)
- `GET /api/movies/:id` - Get specific movie
- `POST /api/movies` - Create new movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

### Query Parameters

**GET /api/movies**
- `search` - Search by title or director
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

## 🔒 Security Features

- **Google OAuth 2.0** - Secure authentication
- **JWT Tokens** - Stateless authentication
- **Input Validation** - Server-side validation and sanitization
- **Rate Limiting** - Prevent abuse
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing control

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface
- **Responsive Layout** - Works on mobile, tablet, and desktop
- **Loading States** - User feedback during operations
- **Error Handling** - Friendly error messages
- **Toast Notifications** - Success and error notifications

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviedb
   JWT_SECRET=production-jwt-secret
   SESSION_SECRET=production-session-secret
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy Backend**
   - Deploy to services like Heroku, Railway, or DigitalOcean
   - Set environment variables
   - Ensure MongoDB connection

4. **Deploy Frontend**
   - Deploy build folder to Netlify, Vercel, or similar
   - Set API base URL to backend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development
- `npm run server` - Start backend server
- `npm run client` - Start frontend client
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

### Backend
- `npm start` - Start server in production
- `npm run dev` - Start server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check connection string in `.env`
   - For MongoDB Atlas, ensure IP whitelist is configured

2. **Google OAuth Not Working**
   - Verify Google Client ID and Secret
   - Check redirect URIs in Google Console
   - Ensure correct domains are authorized

3. **CORS Errors**
   - Check if CLIENT_URL matches frontend URL
   - Verify CORS configuration in server

4. **Tests Failing**
   - Ensure test database is clean
   - Check if all dependencies are installed
   - Clear Jest cache: `npm test -- --clearCache`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

---

## 🙋‍♂️ Support

If you have any questions or need help with setup, please open an issue in the repository.
