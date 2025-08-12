# Firebase Setup Guide for BICTDA

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `bictda-management-system`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## 4. Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</>)
4. Register app with name: `BICTDA Web App`
5. Copy the configuration object

## 5. Update Firebase Configuration

Replace the placeholder values in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 6. Install Firebase Dependencies

Run these commands in your project directory:

```bash
npm install firebase
# or
yarn add firebase
```

## 7. Set Up Firestore Security Rules

In Firebase Console > Firestore Database > Rules, add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Instructors collection - authenticated users can read, admins can write
    match /instructors/{instructorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow admin access to all collections
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 8. Admin User Setup

### Option 1: Manual Admin Creation (Recommended)

1. Create an admin user manually in Firebase Console:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter admin email and password
   - Note: Use the password `admin123` (as configured in the code)

2. Add admin data to Firestore:
   - Go to Firestore Database
   - Create a document in `users` collection
   - Document ID: Use the UID from the created user
   - Add these fields:
     ```json
     {
       "name": "Admin User",
       "email": "admin@bictda.bo.gov.ng",
       "role": "admin",
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
     ```

### Option 2: Programmatic Admin Creation

You can also create an admin user programmatically by temporarily modifying the signup process.

## 9. Testing the Setup

1. Start your development server: `npm run dev`
2. Test instructor signup:
   - Go to login page
   - Click "Create Instructor Account"
   - Fill in the form and submit
   - Check Firebase Console > Authentication to see the new user
   - Check Firestore Database > users collection for user data

3. Test instructor login:
   - Use the email and password from signup
   - Should successfully log in

4. Test admin login:
   - Use admin email and password `admin123`
   - Should successfully log in

## 10. Environment Variables (Optional)

For better security, create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 11. Production Deployment

1. Update Firestore security rules for production
2. Set up proper authentication methods
3. Configure domain restrictions
4. Set up monitoring and analytics

## Troubleshooting

- **Authentication errors**: Check if Email/Password auth is enabled
- **Firestore errors**: Check security rules and database permissions
- **Configuration errors**: Verify all Firebase config values are correct
- **CORS errors**: Add your domain to authorized domains in Firebase Console

## Security Notes

- Change the default admin password after first login
- Set up proper Firestore security rules for production
- Enable additional authentication methods as needed
- Set up proper user roles and permissions
- Monitor authentication logs for suspicious activity
