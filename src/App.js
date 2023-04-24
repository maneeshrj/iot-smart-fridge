import logo from './logo.svg';
import './App.css';
import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import EnhancedTable from './EnhancedTable';
import Paper from '@mui/material/Paper';
import { BarChart, Legend, Bar, Tooltip, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue, child, set, update, get } from "firebase/database";
import { Typography } from '@mui/material';

// THIS IS DEMO DATA 
const data0 = [
  { name: "Apple", count: 10},
  { name: "Banana", count: 5},
  { name: "Cantalope", count: 2},
  { name: "Dragonfruit", count: 8},
  { name: "Eggs", count: 12},
];


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      analytic: 'analytic1',
      rows: null,
      analyticData: data0,
    };
  }

  componentDidMount() {
    const updateUserData = (snapshot) => {
      const newUserData = snapshot.val();
      console.log('Got update from firebase:', newUserData);
      this.setState((prevState) => ({
        ...prevState,
        rows: newUserData
      }));
    }

    onValue(child(this.props.userRef, '/items'), updateUserData, 
      function (errorObject) {
        console.log("Failed to read update from firebase: " + errorObject.code);
      }
    );
  }

  updateRows = (updatedRows) => {
    if (updatedRows.length === 0) {
      updatedRows = 'empty';
    }
    this.setState((prevState) => ({
      ...prevState,
      rows: updatedRows
    }));

    const updatedItems = updatedRows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        date_added: row.date_added,
        expiry_date: row.expiry_date,
        cost: parseFloat(row.cost),
      }
    });

    set(child(this.props.userRef, '/items'), updatedItems).then(() => {
      console.log("Data saved successfully!");
    }).catch((error) => {
      console.log("Data could not be saved: " + error);
    });
  }

  addRow = (newRow) => {
    console.log("addRow called");
    var updatedRows = this.state.rows === 'empty' ? [] : this.state.rows;
    console.log('updatedRows', updatedRows);
    updatedRows.push(newRow);
    this.updateRows(updatedRows);
  }

  deleteRows = (ids) => {
    console.log("deleteRow called");
    const updatedRows = this.state.rows.filter((row) => !ids.includes(row.id));
    this.updateRows(updatedRows);
  }

  handleAnalyticSelect = (event) => {
    console.log(event.target.value);
    this.setState((prevState) => ({ 
      ...prevState,
      analytic: event.target.value,
      loadingAnalytic: true,
    }));

    get(child(this.props.userRef, event.target.value)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log('Analytic loaded:', snapshot.val());
        this.setState((prevState) => ({
          ...prevState,
          analyticData: snapshot.val(),
          loadingAnalytic: false,
        }));
      } else {
        console.log("No analytic data available");
      }
    }).catch((error) => {
      console.log('Error loading analytic: '+error);
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
          <Paper 
            className="App-body"
            sx={{
              m: 2,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'linen',
            }}
          >
            <Box sx={{ minWidth: 120 }} marginBottom={5}>
              <EnhancedTable 
                // rows={ (this.state.userData !== null && this.state.userData.items !== 'empty'? this.state.userData.items : []) } 
                rows={this.state.rows}
                addRow={this.addRow} 
                deleteRows={this.deleteRows}
                updateRows={this.updateRows}
              />
            </Box>

            <Paper 
              sx={{ 
                minWidth: 120, 
                p: 2, 
                mb: 2, 
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant='h6' mb={1} >Analytics</Typography>
              <FormControl fullWidth>
                <Select
                  value={this.state.analytic}
                  onChange={this.handleAnalyticSelect}
                >
                  <MenuItem value={'analytic1'}>How often are items added?</MenuItem>
                  <MenuItem value={'analytic2'}>How often do items expire?</MenuItem>
                </Select>
              </FormControl>

              <ResponsiveContainer width="80%" height={80*this.state.analyticData.length}>
                <BarChart
                  layout="vertical"
                  data={this.state.analyticData}
                  margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#ccc" />
                  <XAxis type="number" tickCount={10}/>
                  <YAxis dataKey="name" type="category"/>
                  <Legend formatter={(value, entry, index) => {return value.charAt(0).toUpperCase() + value.slice(1)}}/>
                  <Bar dataKey="count" fill="#82ca9d" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
          </Paper>
        </Paper>
      </div>
      
    );
  }
}

export default App;
