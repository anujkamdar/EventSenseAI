import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getDatabase, ref, set, get, push, onValue,orderByChild,equalTo,query } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';
import {setDoc,doc,getFirestore,onSnapshot, updateDoc,getDoc} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'




const firebaseConfig = {
    apiKey: "AIzaSyCrv70WYsvccuJSUiom9SkfoIXNNqcz3rA",
    authDomain: "eventsenseai-6b6fa.firebaseapp.com",
    projectId: "eventsenseai-6b6fa",
    storageBucket: "eventsenseai-6b6fa.firebasestorage.app",
    messagingSenderId: "48984027253",
    appId: "1:48984027253:web:1b7f9ae70989299749083c"
  };
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);






export{
    app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,signOut,
    db,getDatabase,ref,set,get,push,onValue,doc,setDoc,onSnapshot,getFirestore,updateDoc,getDoc,orderByChild,equalTo,query}

