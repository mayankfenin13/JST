# Environment Variables Setup

## Backend Environment Variables (Render)

Create these environment variables in your Render dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-collection

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (important for CORS and OAuth redirects)
CLIENT_URL=https://your-frontend-app.vercel.app

# Server Configuration
PORT=5001
NODE_ENV=production
```

## Frontend Environment Variables (Vercel)

Create these environment variables in your Vercel dashboard:

```bash
# Backend API URL
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

## Local Development

For local development, create these files:

### server/.env
```bash
MONGODB_URI=mongodb://localhost:27017/movie-collection
JWT_SECRET=local-dev-jwt-secret
SESSION_SECRET=local-dev-session-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:3000
PORT=5001
NODE_ENV=development
```

### client/.env
```bash
REACT_APP_API_URL=http://localhost:5001
```

## Security Notes

- Generate strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Never commit .env files to version control
- Use different secrets for development and production
- Regularly rotate OAuth credentials
