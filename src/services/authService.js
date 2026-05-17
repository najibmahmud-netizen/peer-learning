// src/services/authService.js
import { auth, db } from './firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'

// Initialize the Google Auth Provider instance
const googleProvider = new GoogleAuthProvider();

// 1. REGISTER A NEW USER WITH EMAIL & PASSWORD
export const signUpWithEmail = async ({ name, email, password }) => {
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error('Email already registered');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const newUser = {
    id: firebaseUser.uid,
    name,
    email,
    picture: null,
    authMethod: 'email',
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  return newUser;
}

// 2. SIGN IN AN EXISTING USER
export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (!userDoc.exists()) {
    throw new Error('User profile record not found');
  }

  return userDoc.data();
}

// 3. GOOGLE SIGN IN (Fixes the build crash!)
export const signInWithGoogle = async () => {
  // Opens a secure Google login popup in the browser
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  // Check if a document already exists for this Google user in Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (userDoc.exists()) {
    return userDoc.data(); // Return existing user data
  }

  // If they are logging in for the first time, create a profile record
  const newUser = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'Google User',
    email: firebaseUser.email,
    picture: firebaseUser.photoURL || null,
    authMethod: 'google',
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  return newUser;
}

// 4. UTILITY: CHECK IF EMAIL ALREADY EXISTS
export const checkEmailExists = async (email) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// 5. GET A USER PROFILE BY INDIVIDUAL ID
export const getUserById = async (id) => {
  const userDoc = await getDoc(doc(db, 'users', id));
  return userDoc.exists() ? userDoc.data() : null;
}

// 6. UPDATE USER PROFILE DETAILS IN FIRESTORE
export const updateUserProfile = async (id, updates) => {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, updates);
  
  const updatedDoc = await getDoc(userRef);
  return updatedDoc.data();
}