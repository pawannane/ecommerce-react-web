import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBPhAZ6HpGTGlUhbpApOVk6-PtRzk9CGIo",
    authDomain: "ecommerce-react-app-57a5f.firebaseapp.com",
    projectId: "ecommerce-react-app-57a5f",
    storageBucket: "ecommerce-react-app-57a5f.appspot.com",
    messagingSenderId: "605271421915",
    appId: "1:605271421915:web:de2e88bc0dc72bb198edfe",
    measurementId: "G-Y1G2LB3Z58"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth, fs, storage}
