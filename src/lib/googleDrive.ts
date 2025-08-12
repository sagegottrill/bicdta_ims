// Google Drive API Integration for BICDTA IMS
// This will handle file uploads for Weekly, Monthly, and M&E Reports

interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
  mimeType: string;
  size: string;
}

interface UploadResponse {
  success: boolean;
  file?: GoogleDriveFile;
  error?: string;
}

// Google Drive API configuration
const GOOGLE_DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const GOOGLE_DRIVE_CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;
const GOOGLE_DRIVE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET;

// Folder IDs for different report types
const FOLDER_IDS = {
  WEEKLY_REPORTS: '1BICDTA_Weekly_Reports_Folder_ID',
  MONTHLY_REPORTS: '1BICDTA_Monthly_Reports_Folder_ID', 
  ME_REPORTS: '1BICDTA_ME_Reports_Folder_ID',
  TRAINEE_PHOTOS: '1BICDTA_Trainee_Photos_Folder_ID',
  TRAINING_VIDEOS: '1BICDTA_Training_Videos_Folder_ID'
};

// Initialize Google Drive API
const initializeGoogleDrive = async () => {
  try {
    // Load Google API client
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Initialize the API
    await new Promise((resolve, reject) => {
      (window as any).gapi.load('client:auth2', {
        callback: resolve,
        onerror: reject
      });
    });

    await (window as any).gapi.client.init({
      apiKey: GOOGLE_DRIVE_API_KEY,
      clientId: GOOGLE_DRIVE_CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: 'https://www.googleapis.com/auth/drive.file'
    });

    return true;
  } catch (error) {
    console.error('Failed to initialize Google Drive API:', error);
    return false;
  }
};

// Upload file to Google Drive
export const uploadToGoogleDrive = async (
  file: File, 
  folderId: string, 
  reportType: 'weekly' | 'monthly' | 'me' | 'trainee' | 'video'
): Promise<UploadResponse> => {
  try {
    const initialized = await initializeGoogleDrive();
    if (!initialized) {
      throw new Error('Failed to initialize Google Drive API');
    }

    // Check if user is authenticated
    const authInstance = (window as any).gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    // Create file metadata
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${reportType}_${timestamp}_${file.name}`;
    
    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: file.type
    };

    // Create FormData for upload
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    // Upload to Google Drive
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authInstance.currentUser.get().getAuthResponse().access_token}`
      },
      body: form
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      file: {
        id: result.id,
        name: result.name,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink,
        mimeType: result.mimeType,
        size: result.size
      }
    };

  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

// Upload weekly report files
export const uploadWeeklyReportFiles = async (files: File[], centreName: string) => {
  const uploads = files.map(async (file) => {
    const folderId = FOLDER_IDS.WEEKLY_REPORTS;
    return await uploadToGoogleDrive(file, folderId, 'weekly');
  });
  
  return Promise.all(uploads);
};

// Upload monthly report files
export const uploadMonthlyReportFiles = async (files: File[], centreName: string) => {
  const uploads = files.map(async (file) => {
    const folderId = FOLDER_IDS.MONTHLY_REPORTS;
    return await uploadToGoogleDrive(file, folderId, 'monthly');
  });
  
  return Promise.all(uploads);
};

// Upload M&E report files
export const uploadMEReportFiles = async (files: File[], centreName: string) => {
  const uploads = files.map(async (file) => {
    const folderId = FOLDER_IDS.ME_REPORTS;
    return await uploadToGoogleDrive(file, folderId, 'me');
  });
  
  return Promise.all(uploads);
};

// Upload trainee photo
export const uploadTraineePhoto = async (file: File, traineeName: string) => {
  const folderId = FOLDER_IDS.TRAINEE_PHOTOS;
  return await uploadToGoogleDrive(file, folderId, 'trainee');
};

// Upload training video
export const uploadTrainingVideo = async (file: File, centreName: string) => {
  const folderId = FOLDER_IDS.TRAINING_VIDEOS;
  return await uploadToGoogleDrive(file, folderId, 'video');
};

// Get file preview URL
export const getFilePreviewUrl = (fileId: string) => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

// Get file download URL
export const getFileDownloadUrl = (fileId: string) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// Delete file from Google Drive
export const deleteFromGoogleDrive = async (fileId: string): Promise<boolean> => {
  try {
    const initialized = await initializeGoogleDrive();
    if (!initialized) {
      throw new Error('Failed to initialize Google Drive API');
    }

    const authInstance = (window as any).gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authInstance.currentUser.get().getAuthResponse().access_token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    return false;
  }
};
