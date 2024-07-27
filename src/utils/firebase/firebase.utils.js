import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBsbSvLdzo633b0l-kNhOBCzpXbUbfMIo4",
    authDomain: "d-and-z.firebaseapp.com",
    projectId: "d-and-z",
    storageBucket: "d-and-z.appspot.com",
    messagingSenderId: "16291820581",
    appId: "1:16291820581:web:6ca3d13d458138b18abbcc",
    measurementId: "G-YSLBWY0MJ2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// You can add more Firebase-related utility functions here
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // Reference to the user document
  const userRef = doc(db, 'users', userAuth.uid);

  // Get the document
  const snapShot = await getDoc(userRef);

  // If the document doesn't exist, create it
  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('Error creating user', error.message);
    }
  }

  return userRef;
};

// Add other Firebase-related utility functions as needed