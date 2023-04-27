import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import AddItemForm from './AddItemForm';
import dayjs from 'dayjs';

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Item name',
  },
  {
    id: 'days_left',
    numeric: true,
    disablePadding: false,
    label: 'Days left',
  },
  {
    id: 'date_added',
    numeric: true,
    disablePadding: false,
    label: 'Date added',
  },
  {
    id: 'expiry_date',
    numeric: true,
    disablePadding: false,
    label: 'Expiry date',
  },
  {
    id: 'cost',
    numeric: true,
    disablePadding: false,
    label: 'Cost ($)',
  },
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'days_left';

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead className="Table-header">
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      className='Table-toolbar'
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Inventory
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Remove">
          <IconButton onClick={props.delete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        // <Tooltip title="Filter list">
        //   <IconButton>
        //     <FilterListIcon />
        //   </IconButton>
        // </Tooltip>
        <Typography
          component="div"
        >
          {new Date().toLocaleDateString()}
        </Typography>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  delete: PropTypes.func.isRequired,
};


class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'expiry_date',
      selected: [],
      rows: [],
    };
  }

  loadRows = () => {
    let rowData = [];
    if(this.props.rows && this.props.rows !== 'empty') {
      rowData = this.props.rows.map((row) => {
        return {
          ...row,
          days_left: Math.ceil((new Date(row.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)),
          cost: row.cost.toFixed(2),
        }
      });
      // console.log('rowData', rowData);
    }
    this.setState((prevState) => ({
      ...prevState,
      rows: rowData,
    })); 
  }

  componentDidMount() {
    this.loadRows();
  }

  componentDidUpdate(prevProps) {
    if(this.props.rows && this.props.rows !== prevProps.rows) {    
      this.loadRows();  
    } 
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    this.setState((prevState) => ({
      ...prevState,
      order: isAsc ? 'desc' : 'asc',
      orderBy: property,
      selected: [],
    }));
  }

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = this.state.rows.map((n) => n.id);
      this.setState((prevState) => ({
        ...prevState,
        selected: newSelecteds,
      }));
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      selected: [],
    }));
  }

  handleClick = (event, id) => {
    const selectedIndex = this.state.selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, id);
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected.slice(1));
    }
    else if (selectedIndex === this.state.selected.length - 1) {
      newSelected = newSelected.concat(this.state.selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected.slice(0, selectedIndex),
        this.state.selected.slice(selectedIndex + 1),
      );
    }
    this.setState((prevState) => ({
      ...prevState,
      selected: newSelected,
    }));
  }

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  deleteSelected = () => {
    // const updatedRows = this.state.rows.filter((row) => !this.state.selected.includes(row.id));
    // this.setState((prevState) => ({
    //   ...prevState,
    //   rows: updatedRows,
    //   selected: [],
    // }));
    // this.props.updateRows(updatedRows);
    this.props.deleteRows(this.state.selected);
    this.setState((prevState) => ({
      ...prevState,
      selected: [],
    }));
  }

  render() {
    let sortedRows = []
    if (this.state.rows && this.state.rows !== 'empty') {
      sortedRows = stableSort(
        this.state.rows,
        getComparator(this.state.order, this.state.orderBy),
      );
    }
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={this.state.selected.length} delete={this.deleteSelected} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'small'}
            >
              <EnhancedTableHead
                numSelected={this.state.selected.length}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={sortedRows.length}
              />
              <TableBody>
                {sortedRows ? sortedRows.map((row, index) => {
                      const isItemSelected = this.isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
  
                      return (
                        <TableRow
                          hover
                          onClick={(event) => this.handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                          // if expiry date has passed, highlight row
                          // style={new Date(row.expiry_date) < new Date() ? { backgroundColor: '#ffcccc' } : null}
                          style={dayjs(row.expiry_date).isBefore(dayjs().format('YYYY/MM/DD')) ? { backgroundColor: '#ffcccc' } : null}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.days_left}</TableCell>
                          <TableCell align="right">{row.date_added}</TableCell>
                          <TableCell align="right">{row.expiry_date}</TableCell>
                          <TableCell align="right">{row.cost}</TableCell>
                        </TableRow>
                      );
                    })
                  : null}
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <AddItemForm addItem={this.props.addRow} startScan={this.props.startScan} userRef={this.props.userRef} />
        </Paper>
      </Box>
    );
  }
}

export default EnhancedTable;