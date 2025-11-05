import { initializeApp, getApps, getApp } from "firebase/app";

// Web Firebase configuration used by the backend to access Realtime Database
const firebaseConfig = {
	apiKey: "AIzaSyDkUDpnegqLjD0gwwxML1X5eByvqaQFLRI",
	authDomain: "deliveryapp-b8afa.firebaseapp.com",
	databaseURL: "https://deliveryapp-b8afa-default-rtdb.firebaseio.com/",
	projectId: "deliveryapp-b8afa",
	storageBucket: "deliveryapp-b8afa.firebasestorage.app",
	messagingSenderId: "733413278573",
	appId: "1:733413278573:web:e3966e9c88566a00ab5064",
	measurementId: "G-JPVD0VSS8S",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


