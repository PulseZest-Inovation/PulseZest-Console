import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaBrxT4HXxYv03gli19ByspDXDkaNFGho",
    authDomain: "pulsezest-ffe99.firebaseapp.com",
    projectId: "pulsezest-ffe99",
    storageBucket: "pulsezest-ffe99.appspot.com",
    messagingSenderId: "434270739454",
    appId: "1:434270739454:web:f011c842e80cc51f1d7eaf",
    measurementId: "G-Z65N3GBVT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);
const storage = getStorage(app);
// Optional: Set up a message handler for incoming messages
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Customize how to handle the message
});

export { auth, db, messaging , storage };
