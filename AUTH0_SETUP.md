# Auth0 Setup Instructions

## 1. Create Auth0 Account and Application

1. Go to [Auth0](https://auth0.com/) and create a free account
2. Create a new Single Page Application (SPA)
3. Note your **Domain** and **Client ID** from the application settings

## 2. Configure Auth0 Application Settings

In your Auth0 dashboard, go to Applications > Your App > Settings:

### Allowed Callback URLs
```
http://localhost:5174, http://localhost:3000
```

### Allowed Logout URLs
```
http://localhost:5174, http://localhost:3000
```

### Allowed Web Origins
```
http://localhost:5174, http://localhost:3000
```

## 3. Update Environment Variables

Copy `.env.local` and update with your Auth0 credentials:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

## 4. Features Included

- ✅ **Single Sign-On (SSO)** with Auth0
- ✅ **Social logins** (Google, GitHub, etc.)
- ✅ **Material-UI integration**
- ✅ **User profile display**
- ✅ **Secure logout**
- ✅ **Loading states**
- ✅ **Error handling**

## 5. Social Providers (Optional)

To enable social logins:
1. Go to Authentication > Social in Auth0 dashboard
2. Enable desired providers (Google, GitHub, Facebook, etc.)
3. Configure each provider with their respective credentials

## 6. Testing

1. Start the development server: `pnpm dev`
2. Click "Login with Auth0"
3. You'll be redirected to Auth0's Universal Login
4. After successful authentication, you'll be redirected back to your app
