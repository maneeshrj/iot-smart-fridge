
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
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

class SignupView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        validPassword: false,
      };
    }

    setUsername = (event) => {
      this.setState((prevState) => ({
        ...prevState,
        username: event.target.value,
      }));
    }

    setPassword = (event) => {
      // check event.target.value for password requirements on signup page
      this.setState((prevState) => ({
        ...prevState,
        password: event.target.value,
      }));
    }

    submitSignup = () => {
      this.props.submitSignup(this.state.username, this.state.password);
    }

    render() {
      return (
        <Box 
            className="Login"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Paper 
              className="Login-body"
              sx={{
                p: 2,
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'linen',
              }}
            >
                <Paper 
                  sx={{ minWidth: 120, p: 2 }}
                >
                  <FormControl fullWidth>
                    <Stack 
                      spacing={2} 
                      direction="column"
                      textAlign={'center'}
                    >
                      <Typography variant="h4">Smart Fridge</Typography>
                      <TextField id="outlined-basic" label="Username" variant="outlined" onChange={this.setUsername} />
                      <TextField id="outlined-basic" label="Password" variant="outlined" onChange={this.setPassword} type='password' />
                      <Button variant="outlined" color='warning' onClick={this.submitLogin}>Login</Button>
                    </Stack>
                  </FormControl>
                </Paper>
          </Paper>
        </Box>        
      );
    }
}

export default SignupView;