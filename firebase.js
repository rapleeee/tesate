import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4nmjfywBq2dH-ZKHgnr-neFRfQYFELDU",
  authDomain: "sarayaplus.firebaseapp.com",
  projectId: "sarayaplus",
  storageBucket: "sarayaplus.appspot.com",
  messagingSenderId: "826300876657",
  appId: "1:826300876657:web:71ab5a74ad2d99f05918d0",
  measurementId: "G-F5QW64J6KR",
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
