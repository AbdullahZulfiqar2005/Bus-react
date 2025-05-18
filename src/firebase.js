 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 import { getDatabase, ref, onValue, set } from "firebase/database";
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyAeb51GfQ_pP5Zpw_r5cfMHwMew8PXqATQ",
    authDomain: "bus-tracking-46939.firebaseapp.com",
    databaseURL: "https://bus-tracking-46939-default-rtdb.firebaseio.com",
    projectId: "bus-tracking-46939",
    storageBucket: "bus-tracking-46939.firebasestorage.app",
    messagingSenderId: "538107836971",
    appId: "1:538107836971:android:d599e96b16d37d6066c86e"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);
 
 // Export database functions
 export { db, ref, onValue, set };