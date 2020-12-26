import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBqrTFkkKeuo3jjxjTTLaKAx4z_BWuw0v8",
  authDomain: "random-8e0b6.firebaseapp.com",
  projectId: "random-8e0b6",
  storageBucket: "random-8e0b6.appspot.com",
  messagingSenderId: "869692049146",
  appId: "1:869692049146:web:f64f0962b2011bfa8bab43"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth ,storage};
