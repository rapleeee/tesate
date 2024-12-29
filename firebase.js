import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyCfBSUdNOKcyPHBGI57GyYEgjkny1YXBmc",
  authDomain: "satein-55ada.firebaseapp.com",
  projectId: "satein-55ada",
  storageBucket: "satein-55ada.firebasestorage.app",
  messagingSenderId: "455432202103",
  appId: "1:455432202103:web:7915ad7e96259eae836372",
  measurementId: "G-YB086G4LF3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);
export const storage = getStorage(app);

export { auth, db };
