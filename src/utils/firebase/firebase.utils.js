import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, writeBatch, Timestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, OAuthProvider, onAuthStateChanged } from 'firebase/auth';

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

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

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

export const getUserMetrics = async (userId) => {
  const metricsRef = collection(db, 'users', userId, 'metrics');
  const metricsSnapshot = await getDocs(metricsRef);
  return metricsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUserMetric = async (userId, metricData) => {
  const metricsRef = collection(db, 'users', userId, 'metrics');
  return await addDoc(metricsRef, metricData);
};

export const updateUserMetric = async (userId, metricId, metricData) => {
  const metricRef = doc(db, 'users', userId, 'metrics', metricId);
  return await updateDoc(metricRef, metricData);
};

export const getUserDailyLogs = async (userId, startDate, endDate) => {
  const logsRef = collection(db, 'users', userId, 'dailyLogs');
  const q = query(logsRef, where('date', '>=', startDate), where('date', '<=', endDate));
  const logsSnapshot = await getDocs(q);
  return logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUserDailyLog = async (userId, logData) => {
  const logsRef = collection(db, 'users', userId, 'dailyLogs');
  return await addDoc(logsRef, logData);
};

export const updateUserDailyLog = async (userId, logId, logData) => {
  const logRef = doc(db, 'users', userId, 'dailyLogs', logId);
  return await updateDoc(logRef, logData);
};

export const getLifeSystemData = async (isDemo = false) => {
  const userId = isDemo ? 'demoData' : auth.currentUser?.uid;
  if (!userId) return [];

  const metricsRef = collection(db, 'users', userId, 'metrics');
  const metricsSnapshot = await getDocs(metricsRef);
  return metricsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateLifeSystemData = async (newData, isDemo = false) => {
  const userId = isDemo ? 'demoData' : auth.currentUser?.uid;
  if (!userId) return;

  const batch = writeBatch(db);
  newData.forEach(metric => {
    const metricRef = doc(db, 'users', userId, 'metrics', metric.id);
    batch.set(metricRef, metric);
  });
  await batch.commit();
};

export const getDailyLogs = async (isDemo = false) => {
  const userId = isDemo ? 'demoData' : auth.currentUser?.uid;
  if (!userId) return [];

  const logsRef = collection(db, 'users', userId, 'dailyLogs');
  const logsSnapshot = await getDocs(logsRef);
  return logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateDailyLogs = async (newLogs, isDemo = false) => {
  const userId = isDemo ? 'demoData' : auth.currentUser?.uid;
  if (!userId) return;

  const batch = writeBatch(db);
  newLogs.forEach(log => {
    const logRef = doc(db, 'users', userId, 'dailyLogs', log.id);
    batch.set(logRef, log);
  });
  await batch.commit();
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfileDocument(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    await createUserProfileDocument(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Apple", error);
    throw error;
  }
};

export const signUp = async (email, password, displayName) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfileDocument(user, { displayName });
    return user;
  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error("Error signing in", error);
    throw error;
  }
};

export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, async (userAuth) => {
    if (userAuth) {
      const userRef = await createUserProfileDocument(userAuth);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        callback({
          id: docSnap.id,
          ...docSnap.data()
        });
      }
    } else {
      callback(null);
    }
  });
};

export const signOut = async () => {
  await auth.signOut();
};

export const addMetricToDailyLog = async (userId, logId, newMetric) => {
  const logRef = doc(db, 'users', userId, 'dailyLogs', logId);
  const logSnapshot = await getDoc(logRef);
  
  if (logSnapshot.exists()) {
    const logData = logSnapshot.data();
    const updatedMetrics = [...logData.metrics, newMetric];
    await updateDoc(logRef, { metrics: updatedMetrics });
  } else {
    console.error('Daily log not found');
  }
};

export {
  // ... other exports
  collection,
  addDoc,
  // ... other exports
};