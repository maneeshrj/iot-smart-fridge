import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './LoginView';
import Signup from './SignupView';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

//const email = 'teamaccessdenied22@gmail.com';
//const password = 'group9'; //prompt("Password");
const auth = getAuth();

var userData = null;
var rerenderKey = 0;

// Function that gets called when user submits login form
function submitLogin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
  .then(
    (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user.email);
      // usertag = user.email.split("@")[0];

      var userRef = ref(database, 'users/' + user.uid);

      // TEST DATA
      // const rows = [
      //   createData('Cupcake',     '3/22/2023',  '3/22/2023',  4.3),
      //   createData('Donut',       '3/22/2023',  '3/28/2023',  4.9),
      //   createData('Eclair',      '3/22/2023',  '4/11/2023',  6.0),
      //   createData('Yogurt',      '3/22/2023',  '4/12/2023',  4.0),
      //   createData('Gingerbread', '3/22/2023',  '4/22/2023',  3.9),
      //   createData('Honeycomb',   '3/22/2023',  '4/24/2023',   6.5),
      //   createData('Ice cream',   '3/22/2023',  '4/26/2023',   4.3),
      // ];
      // set(ref(database, 'users/' + user.uid + '/items'), rows);

      onValue(userRef, function(snapshot) {
        console.log('Got update from firebase:', snapshot.val());
        userData = snapshot.val();
        
        // var saveUserData = ((data) => {
        //   set(ref(database, 'users/' + user.uid), data);
        // });
        
        // If signed in and user data changes, render app view
        rerenderKey++;
        renderApp(userData, (rows) => {
          updateRows(rows, 'users/' + user.uid);
        });
      }, function (errorObject) {
        console.log("Failed to read data: " + errorObject.code);
      });
    }
  )
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, "\n", errorMessage);
  });
}

// Attach an asynchronous callback to read the data at our posts reference
// onValue(test, function(snapshot) {
//   console.log(snapshot.val());
//   testVal = snapshot.val();
//   renderApp(testVal.test_list);
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

const root = ReactDOM.createRoot(document.getElementById('root'));

function updateRows(newRows, userRefKey) {
  console.log("updateRows called");
  newRows = newRows.map((row) => ({
      name: row.name,
      date_added: row.date_added,
      expiry_date: row.expiry_date,
      cost: parseFloat(row.cost),
  }));
  console.log(newRows);
  if (newRows.length == 0) {
    newRows = 'empty';
  }
  set(ref(database, userRefKey+'/items'), newRows).then(() => {
    console.log("Data saved successfully!");
    // get(ref(database, userRefKey)).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     console.log(snapshot.val());
    //     // return snapshot.val();
    //     renderApp(snapshot.val(), (rows) => {
    //       updateRows(rows, userRefKey);
    //     });
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // })
  }).catch((error) => {
    console.log("Data could not be saved: " + error);
  });
}

function renderApp(userData, updateRows) {
  root.render(
    <React.StrictMode>
      <App userData={userData} updateRows={updateRows} key={rerenderKey} />
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


renderLogin(submitLogin);
// submitLogin(email, password);
// renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
