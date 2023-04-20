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
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

// THIS IS DEMO DATA 
const data0 = [
  { name: "Page A", uv: 800, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 100, pv: 4567, amt: 2400 },
  { name: "Page C", uv: 200, pv: 1398, amt: 2400 },
  { name: "Page D", uv: 500, pv: 9800, amt: 2400 },
  { name: "Page E", uv: 678, pv: 3908, amt: 2400 },
  { name: "Page F", uv: 289, pv: 4800, amt: 2400 },
];

const data1 = [
  { name: "Page B", uv: 100, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 200, pv: 4567, amt: 2400 },
  { name: "Page C", uv: 300, pv: 1398, amt: 2400 },
  { name: "Page D", uv: 400, pv: 9800, amt: 2400 },
  { name: "Page E", uv: 580, pv: 3908, amt: 2400 },
  { name: "Page F", uv: 689, pv: 4800, amt: 2400 },
];

const data2 = [
  { name: "Page D", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 300, pv: 4567, amt: 2400 },
  { name: "Page C", uv: 300, pv: 1398, amt: 2400 },
  { name: "Page D", uv: 200, pv: 9800, amt: 2400 },
  { name: "Page E", uv: 278, pv: 3908, amt: 2400 },
  { name: "Page F", uv: 189, pv: 4800, amt: 2400 },
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { displayData: data0 };
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

            <Paper sx={{ minWidth: 120, p: 2, mb: 2, mt: 2 }}>
            <FormControl fullWidth>
              <Select
                value={this.state.displayData}
                onChange={(e) => {
                  console.log(e.target.value);
                  this.setState({ displayData: e.target.value });
                }}
              >
                <MenuItem value={data0}>Analytic 1</MenuItem>
                <MenuItem value={data1}>Analytic 2</MenuItem>
                <MenuItem value={data2}>Analytic 3</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          <Paper>
            <LineChart
              width={600}
              height={300}
              data={this.state.displayData}
              margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="uv" stroke="#FFC0CB" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart>
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
