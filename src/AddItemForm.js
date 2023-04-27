import * as React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { getDatabase, ref, onValue, child, set, update, get } from "firebase/database";
import { Typography } from '@mui/material';

class AddItemForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: dayjs(),
            itemName: '',
            show: false,
            cost: 0,
            err: 'none',
            scanning: false,
        };
    }

    componentDidMount() {
        const updateScanResult = (snapshot) => {
            const scan = snapshot.val();
            console.log('Got scan result from firebase:', scan);
            this.setState((prevState) => ({
                ...prevState,
                itemName: scan.result,
                scanning: scan.scanning,
            }));
        }
    
        onValue(child(this.props.userRef, '/scan'), updateScanResult, 
            function (errorObject) {
                console.log("Failed to read scan result from firebase: " + errorObject.code);
            }
        );
    }

    componentWillUnmount() {
        this.clearScan();
    }

    handleNameChange = (event) => {
        this.setState((prevState) => ({...prevState, itemName: event.target.value, err: (prevState.err==='name'? 'none' : prevState.err)}));
    };

    handleCostChange = (event) => {
        this.setState((prevState) => ({...prevState, cost: event.target.value.replace(/[^0-9.]/g,'')}));
    };

    handleDateChange = (newDate) => {
        this.setState((prevState) => ({...prevState, date: newDate}));
    };
    
    handleSubmit = () => {
        if (this.state.itemName === '') {
            this.setState((prevState) => ({...prevState, err: 'name'}));
            return;
        }

        const newItem = {
            name: this.state.itemName,
            date_added: dayjs().format('MM/DD/YYYY'),
            expiry_date: this.state.date.format('MM/DD/YYYY'),
            days_left: this.state.date.diff(dayjs(), 'day'),
            cost: (this.state.cost === '') ? 0 : this.state.cost,
            id: Date.now(),
        }
        
        this.toggleShow(false);

        console.log(newItem);
        this.props.addItem(newItem);
    };

    toggleShow = (newShow) => {
        // if(!newShow) {
        //     this.clearScan();
        // }
        this.setState((prevState) => ({
            ...prevState,
            date: dayjs(),
            itemName: '',
            show: newShow,
            cost: 0,
            err: 'none',
        }));
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
        else if (event.key === 'Escape') {
            this.toggleShow(false);
        }
    }
    
    startScan = () => {
        console.log('start scan');
        set(child(this.props.userRef, '/scan'), {scanning: true, result: ""}).then(() => {
            console.log("Scan started successfully!");
          }).catch((error) => {
            console.log("Could not start scan: " + error);
          });

        // this.setState((prevState) => ({
        //     ...prevState, 
        //     scanning: true
        // }));
        // this.props.startScan();
    }

    clearScan = () => {
        set(child(this.props.userRef, '/scan'), {scanning: false, result: ""}).then(() => {
            console.log("Cleared scan result");
        }).catch((error) => {
            console.log("Error clearing scan result: " + error);
        });
    }

    render() {
        // const { date, itemName, show, cost, err } = this.state;
        return this.state.show ? (
            <Paper
                margin={2}
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                className='AddItemForm'
                onKeyDown={(e) => this.handleKeyDown(e)}
            >
                {/* <Typography>{this.state.itemName}</Typography> */}
                <Grid container spacing={2}>
                    <Grid item md={5} xs={12}>
                        <TextField 
                            label="Item Name" 
                            variant="outlined" 
                            error={this.state.err === 'name' ? true : false}
                            fullWidth 
                            value={this.state.itemName}
                            onChange={(e) => this.handleNameChange(e)}
                            {...(this.state.scanning ? {disabled: true} : {})}
                        />
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Expiry Date"
                                value={this.state.date}
                                onChange={(e) => this.handleDateChange(e)}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            label="Cost" 
                            variant="outlined" 
                            fullWidth 
                            value={this.state.cost}
                            onChange={(e) => this.handleCostChange(e)}
                        />
                    </Grid>
                    
                    <Grid item md={2} xs={4}>
                        <Button
                            aria-label="add"
                            onClick={() => this.toggleShow(false)}
                            variant="outlined"
                            sx={{
                                alignSelf: 'center',
                                justifySelf: 'center',
                                height: '100%',
                                width: '100%'
                            }}
                            color="error"
                        >
                            <ArrowBackIcon />
                        </Button>
                    </Grid>
                    <Grid item md={2} xs={4}>
                        <Button
                            aria-label="add"
                            onClick={() => this.startScan()}
                            variant="outlined"
                            sx={{
                                alignSelf: 'center',
                                justifySelf: 'center',
                                height: '100%',
                                width: '100%'
                            }}
                            color="info"
                            {...(this.state.scanning ? {disabled: true} : {})}
                        >
                            {(!this.state.scanning)? 
                                <CameraAltIcon />
                                :
                                <MoreHorizIcon />
                            }
                        </Button>
                    </Grid>
                    <Grid item md={8} xs={4}>
                        <Button
                            aria-label="add"
                            onClick={(e) => this.handleSubmit(e)}
                            variant="outlined"
                            sx={{
                                alignSelf: 'center',
                                justifySelf: 'center',
                                height: '100%',
                                width: '100%'
                            }}
                            color="warning"
                            {...(this.state.scanning ? {disabled: true} : {})}
                        >
                            <AddIcon />
                        </Button>
                    </Grid>
                </Grid>   
            </Paper>
        ) : (
            <Paper
                margin={2}
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Button
                    aria-label="add"
                    onClick={() => this.toggleShow(true)}
                    variant="outlined"
                    sx={{
                        alignSelf: 'center',
                        justifySelf: 'center',
                        height: '100%',
                        width: '100%'
                    }}
                    color="warning"
                >
                    Add Item
                </Button>
            </Paper>
        );
    }
}

export default AddItemForm;