# Google Drive API Setup Guide for BICDTA IMS

## 🚀 Overview
This guide will help you set up Google Drive API for file uploads in your BICDTA Information Management System.

## 📋 Prerequisites
- Google Cloud Console account
- Google Drive account with 2TB storage (as mentioned)

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it: `BICDTA-IMS`
4. Click "Create"

### 1.2 Enable Google Drive API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### 1.3 Create Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:8083`
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:8083`
   - Your production domain
6. Click "Create"
7. **Save the Client ID and Client Secret**

### 1.4 Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. **Save the API Key**

## 📁 Step 2: Create Google Drive Folders

### 2.1 Create Main Folder Structure
Create these folders in your Google Drive:

```
📁 BICDTA IMS Reports/
├── 📁 Weekly Reports/
├── 📁 Monthly Reports/
├── 📁 M&E Reports/
├── 📁 Trainee Photos/
└── 📁 Training Videos/
```

### 2.2 Get Folder IDs
1. Open each folder in Google Drive
2. Copy the folder ID from the URL:
   - URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the `FOLDER_ID_HERE` part

## 🔑 Step 3: Environment Variables

Add these to your `.env` file:

```env
# Google Drive API Configuration
VITE_GOOGLE_DRIVE_API_KEY=your_api_key_here
VITE_GOOGLE_DRIVE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret_here

# Google Drive Folder IDs
VITE_GOOGLE_DRIVE_WEEKLY_REPORTS_FOLDER=your_weekly_reports_folder_id
VITE_GOOGLE_DRIVE_MONTHLY_REPORTS_FOLDER=your_monthly_reports_folder_id
VITE_GOOGLE_DRIVE_ME_REPORTS_FOLDER=your_me_reports_folder_id
VITE_GOOGLE_DRIVE_TRAINEE_PHOTOS_FOLDER=your_trainee_photos_folder_id
VITE_GOOGLE_DRIVE_TRAINING_VIDEOS_FOLDER=your_training_videos_folder_id
```

## 🎯 Step 4: Update Folder IDs in Code

Update the folder IDs in `src/lib/googleDrive.ts`:

```typescript
const FOLDER_IDS = {
  WEEKLY_REPORTS: 'your_weekly_reports_folder_id',
  MONTHLY_REPORTS: 'your_monthly_reports_folder_id', 
  ME_REPORTS: 'your_me_reports_folder_id',
  TRAINEE_PHOTOS: 'your_trainee_photos_folder_id',
  TRAINING_VIDEOS: 'your_training_videos_folder_id'
};
```

## ✅ Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to any report form (Weekly, Monthly, or M&E)
3. Try uploading a file
4. Check if it appears in your Google Drive folder

## 🔒 Security Notes

- **Never commit** your `.env` file to version control
- **Restrict API key** to only your domains
- **Use OAuth 2.0** for user authentication
- **Set up proper CORS** for production

## 🚨 Troubleshooting

### Common Issues:

1. **"API key not valid"**
   - Check if API key is correct
   - Ensure Google Drive API is enabled

2. **"Client ID not found"**
   - Verify OAuth 2.0 client ID
   - Check authorized origins

3. **"Folder not found"**
   - Verify folder IDs are correct
   - Ensure folders exist and are accessible

4. **"Upload failed"**
   - Check file size (max 30MB)
   - Verify internet connection
   - Check browser console for errors

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Verify all environment variables are set
3. Ensure Google Drive API is properly enabled
4. Check folder permissions in Google Drive

## 🎉 Success!

Once everything is set up, you'll have:
- ✅ **2TB free storage** for all your files
- ✅ **File uploads** in Weekly Reports
- ✅ **File uploads** in Monthly Reports  
- ✅ **File uploads** in M&E Reports
- ✅ **Trainee photo uploads**
- ✅ **Training video uploads**
- ✅ **Real-time file management**

Your BICDTA IMS now has powerful file management capabilities! 🚀
