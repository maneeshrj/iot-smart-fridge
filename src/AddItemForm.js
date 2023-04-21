import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';

export default function AddItemForm(props) {
    const [date, setDate] = React.useState(dayjs());
    const [itemName, setItemName] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [cost, setCost] = React.useState(0);
    const [err, setErr] = React.useState('none');

    const handleCostChange = (event) => {
        setCost(event.target.value.replace(/[^0-9.]/g,''));
    };
    
    const handleSubmit = () => {
        if (itemName === '') {
            setErr('name');
            return;
        }
        setErr('none');
        setShow(false);
        const newItem = {
            name: itemName,
            date_added: dayjs().format('MM/DD/YYYY'),
            expiry_date: date.format('MM/DD/YYYY'),
            days_left: date.diff(dayjs(), 'day'),
            cost: (cost === '') ? 0 : cost,
        }
        console.log(newItem);
        props.addItem(newItem);
        setCost(0);
        setItemName('');
        setDate(dayjs());
    };
    
    return show ? (
        <Paper
            margin={2}
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
            className='AddItemForm'
        >
            <Grid container spacing={2}>
                <Grid item md={5}>
                    <TextField 
                        label="Item Name" 
                        variant="outlined" 
                        error={err === 'name' ? true : false}
                        fullWidth 
                        onChange={(e) => {
                            setItemName(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item md={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Expiry Date"
                            value={date}
                            onChange={setDate}
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item md={2}>
                    <TextField
                        label="Cost" 
                        variant="outlined" 
                        fullWidth 
                        value={cost}
                        onChange={handleCostChange}
                    />
                </Grid>
                <Grid item md={12}>
                    <Button
                        aria-label="add"
                        onClick={() => handleSubmit()}
                        variant="outlined"
                        sx={{
                            alignSelf: 'center',
                            justifySelf: 'center',
                            height: '100%',
                            width: '100%'
                        }}
                        color="warning"
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
                onClick={() => { 
                    setShow(true);
                    setErr('none');
                }}
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