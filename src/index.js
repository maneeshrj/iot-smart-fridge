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
var test = ref(database, 'public');
var testVal = "test";

// TEST DATA
// function createData(name, date_added, expiry_date, cost) {
//   return {
//     name,
//     date_added,
//     expiry_date,
//     cost,
//   };
// }
// const rows = [
//   createData('Cupcake',     '3/22/2023',  '3/22/2023',  4.3),
//   createData('Donut',       '3/22/2023',  '3/28/2023',  4.9),
//   createData('Eclair',      '3/22/2023',  '4/11/2023',  6.0),
//   createData('Yogurt',      '3/22/2023',  '4/12/2023',  4.0),
//   createData('Gingerbread', '3/22/2023',  '4/22/2023',  3.9),
//   createData('Honeycomb',   '3/22/2023',  '4/24/2023',   6.5),
//   createData('Ice cream',   '3/22/2023',  '4/26/2023',   4.3),
// ];
// set(ref(database, '/public/test_list'), rows);

// Attach an asynchronous callback to read the data at our posts reference
onValue(test, function(snapshot) {
  console.log(snapshot.val());
  testVal = snapshot.val();
  renderApp(testVal.test_list);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

const root = ReactDOM.createRoot(document.getElementById('root'));

function updateRows(newRows) {
  console.log("updateRows called");
  newRows = newRows.map((row) => ({
      name: row.name,
      date_added: row.date_added,
      expiry_date: row.expiry_date,
      cost: parseFloat(row.cost),
  }));
  console.log(newRows);
  set(ref(database, '/public/test_list'), newRows);
}

function renderApp(itemList) {
  root.render(
    <React.StrictMode>
      <App itemList={itemList} updateRows={updateRows} />
    </React.StrictMode>
  );
}

// renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
