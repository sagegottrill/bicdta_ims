import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjifMJnPUKqsXKsABD6ZSiUdojv9aHLiA",
  authDomain: "bictdamis.firebaseapp.com",
  projectId: "bictdamis",
  storageBucket: "bictdamis.firebasestorage.app",
  messagingSenderId: "111309186205",
  appId: "1:111309186205:web:e2a9145e1db48b6de56074",
  measurementId: "G-HB9P8NKD12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Authentication functions
export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
      role: userData.role || 'instructor'
    });
    
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserData = async (uid: string, data: any) => {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addInstructorToFirestore = async (instructorData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'instructors'), {
      ...instructorData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default app;