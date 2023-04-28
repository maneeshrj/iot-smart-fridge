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
import dayjs from 'dayjs';

// THIS IS DEMO ANALYTICS DATA 
// const data0 = [
//   { name: "Apple", count: 10},
//   { name: "Banana", count: 5},
//   { name: "Cantalope", count: 2},
//   { name: "Dragonfruit", count: 8},
//   { name: "Eggs", count: 12},
// ];


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      analytic: 'added_count',
      rows: null,
      analyticData: [],
      loadingAnalytic: true,
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

    this.loadAnalytic(this.state.analytic);
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
    
    let newRowName = newRow.name;
    get(child(this.props.userRef, 'added_count')).then((snapshot) => {
      if (snapshot.exists()) {
        var analyticData = snapshot.val();
        if (analyticData === 'empty') {
          analyticData = [];
        }
        var found = false;
        for (var i = 0; i < analyticData.length; i++) {
          if (analyticData[i].name === newRowName) {
            analyticData[i].count += 1;
            found = true;
            break;
          }
        }
        if (!found) {
          analyticData.push({name: newRowName, count: 1});
        }
        console.log('Analytic updated:', analyticData);
        set(child(this.props.userRef, 'added_count'), analyticData).then(() => {
          console.log("Analytic data saved successfully!");
        }).catch((error) => {
          console.log("Analytic data could not be saved: " + error);
        });

        if(this.state.analytic === 'added_count') {
          this.setState((prevState) => ({
            ...prevState,
            analyticData: analyticData,
          }));
        }
      } else {
        console.log("No analytic data available");
      }
    }).catch((error) => {
      console.log('Error loading analytic: '+error);
    });
  }

  deleteRows = (ids) => {
    console.log("deleteRow called");
    const updatedRows = this.state.rows.filter((row) => !ids.includes(row.id));

    // Update analytic data on expired items
    let expiredItems = this.state.rows.filter((row) => (ids.includes(row.id) && dayjs(row.expiry_date).isBefore(dayjs().format('YYYY/MM/DD'))) );
    let expiredItemNames = expiredItems.map((item) => item.name);
    get(child(this.props.userRef, 'expired_count')).then((snapshot) => {
      if (snapshot.exists()) {
        var analyticData = snapshot.val();
        if (analyticData === 'empty') {
          analyticData = [];
        }

        for (var expiredItemName of expiredItemNames) {
          var found = false;
          for (var i = 0; i < analyticData.length; i++) {
            if (analyticData[i].name === expiredItemName) {
              analyticData[i].count += 1;
              found = true;
              break;
            }
          }
          if (!found) {
            analyticData.push({name: expiredItemName, count: 1});
          }
        }

        console.log('Analytic updated:', analyticData);
        set(child(this.props.userRef, 'expired_count'), analyticData).then(() => {
          console.log("expired_count updated successfully!");
        }).catch((error) => {
          console.log("expired_count could not be saved: " + error);
        });
        
        if(this.state.analytic === 'expired_count') {
          this.setState((prevState) => ({
            ...prevState,
            analyticData: analyticData,
          }));
        }
      } else {
        console.log("No analytic data available");
      }
    }).catch((error) => {
      console.log('Error loading analytic: '+error);
    });

    this.updateRows(updatedRows);
  }

  handleAnalyticSelect = (event) => {
    this.loadAnalytic(event.target.value);
  }

  loadAnalytic = (analyticName) => {
    console.log(analyticName);
    this.setState((prevState) => ({ 
      ...prevState,
      analytic: analyticName,
      loadingAnalytic: true,
    }));
  
    if (analyticName === 'expires_count') {
      const itemsRef = ref(getDatabase(), this.props.userRef + '/items');
      const expirationCounts = {};
      onValue(itemsRef, (snapshot) => {
        snapshot.forEach((itemSnapshot) => {
          const item = itemSnapshot.val();
          const expirationDate = item.expiry_date;
          if (expirationDate in expirationCounts) {
            expirationCounts[expirationDate] += 1;
          } else {
            expirationCounts[expirationDate] = 1;
          }
        });
        const data = Object.entries(expirationCounts).map(([key, value]) => ({ name: key, count: value }));
        console.log('Analytic loaded:', data);
        this.setState((prevState) => ({
          ...prevState,
          analyticData: data,
          loadingAnalytic: false,
        }));
      }, {
        onlyOnce: true
      });
    } else {
      get(child(this.props.userRef, analyticName)).then((snapshot) => {
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
    }
  };

  startScan = () => {
    set(child(this.props.userRef, 'scanning'), true).then(() => {
      console.log("Scan started successfully!");
    }).catch((error) => {
      console.log("Could not start scan: " + error);
    });
  }

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
            <Box sx={{ minWidth: 120 }} mb={3}>
              <EnhancedTable 
                rows={this.state.rows}
                addRow={this.addRow} 
                deleteRows={this.deleteRows}
                updateRows={this.updateRows}
                // startScan={this.startScan}
                userRef={this.props.userRef}
              />
            </Box>

            <Paper 
              sx={{ 
                minWidth: 120, 
                p: 2,
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
                  <MenuItem value={'added_count'}>How often are items added?</MenuItem>
                  <MenuItem value={'expired_count'}>How often do items expire?</MenuItem>
                </Select>
              </FormControl>
              { this.state.loadingAnalytic ?
                <Typography variant='h6' m={1} >Loading...</Typography>
                :
                (
                  (this.state.analyticData === 'empty') ?
                  <Typography variant='h6' m={1} >No data available</Typography>
                  :
                  <ResponsiveContainer width="95%" height={80*this.state.analyticData.length}>
                    <BarChart
                      layout="vertical"
                      data={this.state.analyticData}
                      margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid stroke="#ccc" />
                      <XAxis type="number" tickCount={10} allowDecimals={false} />
                      <YAxis dataKey="name" type="category"/>
                      <Legend formatter={(value, entry, index) => {return value.charAt(0).toUpperCase() + value.slice(1)}}/>
                      <Bar dataKey="count" fill="#82ca9d" />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                )
              }
          </Paper>
        </Paper>
      </div>
    );
  }
  
}

export default App;
