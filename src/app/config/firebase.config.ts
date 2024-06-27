import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: process.env.FIREB_API_KEY,
    authDomain: process.env.FIREB_AUTH_DOMAIN,
    projectId: process.env.FIREB_PROJECT_ID,
    storageBucket: process.env.FIREB_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREB_MESSAGING_SENDER_ID,
    appId: process.env.FIREB_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
  login_hint: 'user@example.com',
});

export {
  auth,
  firebaseConfig,
  provider,
  db,
  storage
};
