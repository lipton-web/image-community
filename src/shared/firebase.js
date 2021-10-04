import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore"
import "firebase/storage";

import dotenv from 'dotenv'
dotenv.config()

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

require('dotenv').config()

const firebaseConfig = {
	apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
}

// Initialize firebaseConfig
firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth(); //인증만들기
const firestore = firebase.firestore();
const storage = firebase.storage()

export {auth, apiKey, firestore, storage};