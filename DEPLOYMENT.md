# Deployment Guide

This guide will help you deploy the Movie Collection app with the backend on Render and the frontend on Vercel.

## Prerequisites

1. A [Render](https://render.com) account
2. A [Vercel](https://vercel.com) account  
3. A [MongoDB Atlas](https://www.mongodb.com/atlas) database (or any MongoDB instance)
4. Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)

## Backend Deployment (Render)

### 1. Set up MongoDB Atlas

1. Create a MongoDB Atlas account and cluster
2. Create a database user and get the connection string
3. Whitelist all IP addresses (0.0.0.0/0) or configure specific IPs

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-backend-url.onrender.com/api/auth/google/callback`

### 3. Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the service:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
   - **Region**: Choose closest to your users

4. Set Environment Variables in Render:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-collection
   JWT_SECRET=your-super-secret-jwt-key-here
   SESSION_SECRET=your-super-secret-session-key-here
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLIENT_URL=https://your-frontend-app.vercel.app
   NODE_ENV=production
   ```

5. Deploy and note your backend URL

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Create a new project
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2. Set Environment Variables in Vercel

In your Vercel project dashboard, go to Settings > Environment Variables:

```
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

### 3. Update Google OAuth Redirect

1. Go back to Google Cloud Console
2. Update OAuth credentials:
   - Add authorized redirect URI: `https://your-backend-url.onrender.com/api/auth/google/callback`
   - Add authorized JavaScript origins: 
     - `https://your-frontend-app.vercel.app`
     - `https://your-backend-url.onrender.com`

### 4. Update Backend CORS Configuration

Make sure your backend's `CLIENT_URL` environment variable matches your Vercel deployment URL.

## Post-Deployment Steps

1. **Test the application**: Visit your Vercel URL and test the login flow
2. **Verify database connection**: Check Render logs to ensure MongoDB connection is successful
3. **Test API endpoints**: Visit `https://your-backend-url.onrender.com/api/health` to verify backend is running

## Environment Variables Summary

### Backend (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT token signing | `super-secret-jwt-key` |
| `SESSION_SECRET` | Secret for session management | `super-secret-session-key` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `abc123secret` |
| `CLIENT_URL` | Frontend URL for CORS/redirects | `https://your-app.vercel.app` |
| `NODE_ENV` | Node environment | `production` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure `CLIENT_URL` in backend matches your Vercel URL exactly
2. **OAuth redirect errors**: Verify Google OAuth redirect URIs are correctly configured
3. **Database connection**: Check MongoDB Atlas IP whitelist and connection string
4. **Build failures**: Ensure all dependencies are in package.json, not just package-lock.json

### Useful Commands

```bash
# Test backend health
curl https://your-backend-url.onrender.com/api/health

# Check backend logs in Render dashboard
# Check frontend build logs in Vercel dashboard
```

## Security Notes

- Never commit `.env` files to git
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Regularly rotate OAuth secrets
- Monitor application logs for suspicious activity
- Keep dependencies updated

## Performance Optimization

- Render: Consider upgrading to a paid plan for better performance
- Vercel: Automatically handles CDN and edge caching
- MongoDB Atlas: Choose a region close to your Render deployment
- Consider implementing Redis for session storage in high-traffic scenarios
