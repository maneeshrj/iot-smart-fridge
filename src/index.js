import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, child, set, update, get } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://iot-smart-fridge-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebaseApp);
var test = ref(database, 'public/test');
var testVal = "test";

// Attach an asynchronous callback to read the data at our posts reference
onValue(test, function(snapshot) {
  console.log(snapshot.val());
  testVal = snapshot.val();
  renderApp();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

const root = ReactDOM.createRoot(document.getElementById('root'));

function renderApp() {
  root.render(
    <React.StrictMode>
      <App testVal={testVal} />
    </React.StrictMode>
  );
}

// renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
