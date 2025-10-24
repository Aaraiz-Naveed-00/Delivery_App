import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkUDpnegqLjD0gwwxML1X5eByvqaQFLRI",
  authDomain: "deliveryapp-b8afa.firebaseapp.com",
  projectId: "deliveryapp-b8afa",
  storageBucket: "deliveryapp-b8afa.firebasestorage.app",
  messagingSenderId: "733413278573",
  appId: "1:733413278573:web:e3966e9c88566a00ab5064",
  measurementId: "G-JPVD0VSS8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export storage for uploads
export const storage = getStorage(app);
export default app;

export const auth = getAuth(app);