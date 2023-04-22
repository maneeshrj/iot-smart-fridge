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
import { BarChart, Legend, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
      displayData: 'analytic1',
      itemList: this.props.userData.items==='empty' ? [] : this.props.userData.items,
    };
  }

  handleAnalyticSelect = (event) => {
    console.log(event.target.value);
    this.setState((prevState) => ({ 
      ...prevState,
      displayData: event.target.value 
    }));
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
              <EnhancedTable rows={this.state.itemList} updateRows={this.props.updateRows} />
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
              <FormControl fullWidth>
                <Select
                  value={this.state.displayData}
                  onChange={this.handleAnalyticSelect}
                >
                  <MenuItem value={'analytic1'}>Analytic 1</MenuItem>
                  <MenuItem value={'analytic2'}>Analytic 2</MenuItem>
                  <MenuItem value={'analytic3'}>Analytic 3</MenuItem>
                </Select>
              </FormControl>

              <ResponsiveContainer width="80%" height={400}>
                <BarChart
                  layout="vertical"
                  data={data0}
                  margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                >
                  {/* <Line type="monotone" dataKey="uv" stroke="#FFC0CB" /> */}
                  <CartesianGrid stroke="#ccc" />
                  <XAxis type="number" tickCount={10}/>
                  <YAxis dataKey="name" type="category"/>
                  <Legend formatter={(value, entry, index) => {return value.charAt(0).toUpperCase() + value.slice(1)}}/>
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
          </Paper>
        </Paper>
      </div>
      
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           {testVal}
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
