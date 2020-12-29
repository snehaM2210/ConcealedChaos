import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBJvXlzhzAo5i3QWeRiWDY0Aa7H_wdhkbA",
    authDomain: "fayell.firebaseapp.com",
    projectId: "fayell",
    storageBucket: "fayell.appspot.com",
    messagingSenderId: "1053837051843",
    appId: "1:1053837051843:web:6be1d113549626d4c61f76"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };