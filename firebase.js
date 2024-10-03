
// export { auth };
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB4nmjfywBq2dH-ZKHgnr-neFRfQYFELDU",
      authDomain: "sarayaplus.firebaseapp.com",
      projectId: "sarayaplus",
      storageBucket: "sarayaplus.appspot.com",
      messagingSenderId: "826300876657",
      appId: "1:826300876657:web:71ab5a74ad2d99f05918d0",
      measurementId: "G-F5QW64J6KR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
