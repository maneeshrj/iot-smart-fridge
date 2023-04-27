import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './LoginView';
import Signup from './SignupView';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue, child, set, update, get } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAgo8lyflJx8_E1F_lGQDzyq1GtF9FHR6Q",
  authDomain: "iot-smart-fridge.firebaseapp.com",
  databaseURL: "https://iot-smart-fridge-default-rtdb.firebaseio.com",
  projectId: "iot-smart-fridge",
  storageBucket: "iot-smart-fridge.appspot.com",
  messagingSenderId: "299219803272",
  appId: "1:299219803272:web:1ce356b0057e0bb1e8533d"
};

function createData(name, date_added, expiry_date, cost) {
  return {
    name,
    date_added,
    expiry_date,
    cost,
  };
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebaseApp);
var publicDataRef = ref(database, 'public');

const email = 'teamaccessdenied22@gmail.com';
const password = 'group9'; //prompt("Password");
const auth = getAuth();

// Function that gets called when user submits login form
function submitLogin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
  .then(
    (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user.email);

      var userRef = ref(database, 'users/' + user.uid);
      renderApp(userRef);
    }
  )
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, "\n", errorMessage);
  });
}

function submitSignup(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up
    const user = userCredential.user;
    console.log(user.email);

    var userRef = ref(database, 'users/' + user.uid);
    renderApp(userRef);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, "\n", errorMessage);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

function renderApp(userRef) {
  root.render(
    <React.StrictMode>
      <App userRef={userRef} />
    </React.StrictMode>
  );
}

function renderLogin(submitLogin) {
  root.render(
    <React.StrictMode>
      <Login submitLogin={submitLogin} />
    </React.StrictMode>
  );
}


function renderSignup(submitSignup) {
  root.render(
    <React.StrictMode>
      <Signup submitSignup={submitSignup} />
    </React.StrictMode>
  );
}
//renderLogin(submitLogin);
submitLogin(email, password);
// renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
