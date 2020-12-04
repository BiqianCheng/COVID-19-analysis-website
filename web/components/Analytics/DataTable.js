import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useState, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Button } from "@material-ui/core";
import axios from "axios";
import CustomDialog from "../../components/Admin/CustomDialog";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Context } from "../../utils/dataContext";

// Using material-ui's table ui and populating it with our data

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

const columns = [
  { id: "index", label: "Index", minWidth: 170 },
  { id: "reporting date", label: "Reporting Date", minWidth: 100 },
  {
    id: "country",
    label: "Country",
    minWidth: 170,
    align: "right",
  },
  {
    id: "location",
    label: "Location",
    minWidth: 170,
    align: "right",
  },
  {
    id: "age",
    label: "Age",
    minWidth: 170,
    align: "right",
  },
  {
    id: "gender",
    label: "Gender",
    minWidth: 170,
    align: "right",
  },
  {
    id: "death",
    label: "Death",
    minWidth: 170,
    align: "right",
  },
  {
    id: "recovered",
    label: "Recovered",
    minWidth: 170,
    align: "right",
  },
];

function createData(
  index,
  reporting_date,
  country,
  location,
  age,
  gender,
  death,
  recovered,
  id,
  summary
) {
  return {
    id,
    index,
    "reporting date": reporting_date,
    country,
    location,
    age,
    gender,
    death,
    recovered,
    summary,
  };
}

const DataTable = ({ data, action, setAction }) => {
  const [popUpOpen, setPopUpOpen] = useState(false);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [input, setInput] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState();

  const dataContext = useContext(Context);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePopUpOpen = () => {
    setPopUpOpen(true);
  };

  const handlePopUpClose = () => {
    setPopUpOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handlePopUpChange = (evt) => {
    const value = evt.target.value;

    if (evt.target.id) {
      setInput({
        ...input,
        [evt.target.id]: value,
      });
    } else {
      setInput({
        ...input,
        [evt.target.name]: value,
      });
    }
  };

  const handleDeletion = (index) => {
    setDeleteOpen(false);
    console.log("Deleteing by row index: ", index);
    // Non IA version commented out
    // axios
    //   .delete(`/admin/delete/${index}`)
    //   .then(() => {
    //     console.log("Succesfully deleted data in the dataset: ", index);
    //     setAction("delete");
    //   })
    //   .catch((error) => {
    //     setAction("error");
    //     if (error.response) {
    //       console.log(error.response.data);
    //     } else {
    //       console.log(error);
    //     }
    //   });
    dataContext.deleteData(index)
  };

  const handleEdit = (row) => {
    setInput(row);
    handlePopUpOpen();
  };

  const handlePopUpSumbit = () => {
    const index = input.index;
    const jsonData = input;
    handlePopUpClose();
    // axios
    //   .put(`/admin/update/${index}`, { jsonData })
    //   .then(({ data }) => {
    //     console.log(
    //       "Succesfully updated data in the dataset: ",
    //       data.updatedData
    //     );
    //     setAction("edit");
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response.data);
    //     } else {
    //       console.log(error);
    //     }
    //   });
    dataContext.updateData(index, jsonData)
  };

  const rows = data.map((point, i) => {
    return createData(
      i,
      point["reporting date"],
      point.country,
      point.location,
      point.age,
      point.gender,
      point.death,
      point.recovered,
      point.id,
      point.summary
    );
  });

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    // const classes = useRowStyles();
    return (
      <>
        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
          <StyledTableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          {action ? (
            <StyledTableCell>
              <Button
                size="small"
                onClick={() => {
                  setRowIndex(row.index);
                  handleDeleteOpen();
                }}
              >
                <DeleteIcon />
              </Button>
              <Button
                onClick={() => {
                  handleEdit(row);
                }}
                size="small"
              >
                <EditIcon />
              </Button>
            </StyledTableCell>
          ) : (
              <></>
            )}
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <StyledTableCell key={column.id} align={column.align}>
                {column.format && typeof value === "number"
                  ? column.format(value)
                  : value}
              </StyledTableCell>
            );
          })}
        </StyledTableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Summary
                </Typography>
                {row.summary}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Summary</StyledTableCell>
              {action ? (
                <React.Fragment>
                  <StyledTableCell style={{ minWidth: "10rem" }}>
                    Action
                  </StyledTableCell>
                </React.Fragment>
              ) : (
                  <></>
                )}
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return <Row key={row.name} row={row} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <div>
        <CustomDialog
          title="Edit Data"
          contentText="Modifiy your dataset below:"
          input={input}
          open={popUpOpen}
          handlePopUpChange={handlePopUpChange}
          handlePopUpClose={handlePopUpClose}
          handlePopUpSumbit={handlePopUpSumbit}
        />
      </div>
      <div>
        <Dialog
          open={deleteOpen}
          onClose={handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this data?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The selected data will be permanently deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeletion(rowIndex);
              }}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Paper>
  );
};

export default DataTable;
