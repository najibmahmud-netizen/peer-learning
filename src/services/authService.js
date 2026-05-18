
import { auth, db } from './firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'


const googleProvider = new GoogleAuthProvider();


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


export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (!userDoc.exists()) {
    throw new Error('User profile record not found');
  }

  return userDoc.data();
}


export const signInWithGoogle = async () => {
  
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

 
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (userDoc.exists()) {
    return userDoc.data();
  }

  
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


export const checkEmailExists = async (email) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};


export const getUserById = async (id) => {
  const userDoc = await getDoc(doc(db, 'users', id));
  return userDoc.exists() ? userDoc.data() : null;
}


export const updateUserProfile = async (id, updates) => {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, updates);
  
  const updatedDoc = await getDoc(userRef);
  return updatedDoc.data();
}