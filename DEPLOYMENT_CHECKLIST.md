# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Backend (Render):
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret key (generate with openssl or online tool)
- [ ] `SESSION_SECRET` - Another strong secret key 
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `CLIENT_URL` - Your Vercel frontend URL (e.g., https://your-app.vercel.app)
- [ ] `SERVER_URL` - Your Render backend URL (e.g., https://your-app.onrender.com)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (Render's default)

#### Frontend (Vercel):
- [ ] `REACT_APP_API_URL` - Your Render backend URL

### 2. Google OAuth Configuration

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Navigate to APIs & Services > Credentials
- [ ] Edit your OAuth 2.0 Client
- [ ] Update **Authorized redirect URIs**:
  - Add: `https://your-render-app.onrender.com/api/auth/google/callback`
- [ ] Update **Authorized JavaScript origins**:
  - Add: `https://your-vercel-app.vercel.app`
  - Add: `https://your-render-app.onrender.com`

### 3. MongoDB Atlas Setup

- [ ] Create MongoDB Atlas cluster
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for cloud deployment)
- [ ] Get connection string and add to `MONGODB_URI`

## 🔧 Deployment Steps

### Backend (Render):

1. **Connect Repository**
   - [ ] Connect your GitHub repo to Render
   - [ ] Create new "Web Service"

2. **Configure Service**
   - [ ] **Name**: `movie-collection-backend` (or your choice)
   - [ ] **Root Directory**: `server`
   - [ ] **Environment**: `Node`
   - [ ] **Region**: Choose closest to users
   - [ ] **Branch**: `master` or `main`

3. **Build Settings**
   - [ ] **Build Command**: `npm install`
   - [ ] **Start Command**: `node server.js`

4. **Environment Variables**
   - [ ] Add all backend environment variables listed above
   - [ ] **Important**: Set `CLIENT_URL` to your future Vercel URL

5. **Deploy**
   - [ ] Click "Create Web Service"
   - [ ] Wait for deployment to complete
   - [ ] Note your Render URL (e.g., `https://your-app.onrender.com`)

### Frontend (Vercel):

1. **Connect Repository**
   - [ ] Connect your GitHub repo to Vercel
   - [ ] Create new project

2. **Configure Project**
   - [ ] **Framework Preset**: `Create React App`
   - [ ] **Root Directory**: `client`
   - [ ] **Build Command**: `npm run build`
   - [ ] **Output Directory**: `build`

3. **Environment Variables**
   - [ ] Add `REACT_APP_API_URL` with your Render URL

4. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for deployment to complete
   - [ ] Note your Vercel URL

### Final Configuration:

1. **Update Backend Environment**
   - [ ] Go back to Render dashboard
   - [ ] Update `CLIENT_URL` with your actual Vercel URL
   - [ ] Redeploy backend

2. **Update Google OAuth**
   - [ ] Replace placeholder URLs with actual deployment URLs
   - [ ] Test OAuth flow

## 🧪 Testing

- [ ] Visit your Vercel URL
- [ ] Click "Continue with Google"
- [ ] Complete OAuth flow
- [ ] Verify you can create/view movies
- [ ] Check browser console for errors
- [ ] Test logout functionality

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check `CLIENT_URL` in Render environment variables
   - Ensure it exactly matches your Vercel URL (no trailing slash)

2. **OAuth Redirect Errors**
   - Verify Google OAuth redirect URIs are correct
   - Check `SERVER_URL` environment variable

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings

4. **Build Failures**
   - Check Render/Vercel build logs
   - Ensure all dependencies are in package.json

### Debug Commands:

```bash
# Test backend health
curl https://your-render-app.onrender.com/api/health

# Check if environment variables are set (in Render dashboard logs)
# Look for "Allowed CORS origins" log message
```

### Log Locations:
- **Render**: Dashboard > Service > Logs tab
- **Vercel**: Dashboard > Project > Functions tab > View Details

## 🔒 Security Notes

- [ ] Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- [ ] Never commit `.env` files to git
- [ ] Regularly rotate OAuth credentials
- [ ] Monitor application logs
- [ ] Keep dependencies updated

## 📝 Environment Variable Templates

### Generate Secrets:
```bash
# Generate strong secrets (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Example URLs:
- **Render Backend**: `https://movie-collection-backend-abc123.onrender.com`
- **Vercel Frontend**: `https://movie-collection-frontend-xyz789.vercel.app`

## ✅ Deployment Complete!

Once all items are checked and tested:
- [ ] Application loads correctly
- [ ] Google OAuth works
- [ ] Movies can be created/edited/deleted
- [ ] No console errors
- [ ] Both frontend and backend logs show no errors

**Your Movie Collection app is now live! 🎉**
