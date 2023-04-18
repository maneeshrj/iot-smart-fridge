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

class App extends React.Component {
  constructor(props) {
    super(props);
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
            <Box sx={{ minWidth: 120 }} marginBottom={5}>
              <EnhancedTable rows={this.props.itemList} updateRows={this.props.updateRows} />
            </Box>

            <Paper sx={{ minWidth: 120, p: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Chart</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={10}
                  label="Age"
                >
                  <MenuItem value={10}>Analytic 1</MenuItem>
                  <MenuItem value={20}>Analytic 2</MenuItem>
                  <MenuItem value={30}>Analytic 3</MenuItem>
                </Select>
              </FormControl>
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
