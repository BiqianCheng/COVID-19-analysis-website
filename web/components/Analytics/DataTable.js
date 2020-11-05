import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
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
  { id: "reporting_date", label: "Reporting Date", minWidth: 100 },
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
  id
) {
  return { index, reporting_date, country, location, age, gender, death, recovered, id };
}

const DataTable = ({ data, action, setAction }) => {
  const [popUpOpen, setPopUpOpen] = useState(false);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [input, setInput] = useState({});

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

  const handlePopUpChange = (evt) => {
    const value = evt.target.value;
    setInput({
      ...input,
      [evt.target.id]: value,
    });
  };

  const handleDeletion = (row) => {
    const index = row.index;
    console.log("Deleteing by row index: ", row.index);
    axios
      .delete(`/admin/delete/${index}`)
      .then(() => {
        console.log("Succesfully deleted data in the dataset: ", index);
        setAction("delete");
      })
      .catch((error) => {
        setAction("error");
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  const handleEdit = (row) => {
    setInput(row);
    handlePopUpOpen();
  };

  const handlePopUpSumbit = () => {
    const index = input.index;
    const jsonData = input;
    handlePopUpClose();
    axios
      .put(`/admin/update/${index}`, { jsonData })
      .then(({ data }) => {
        console.log(
          "Succesfully updated data in the dataset: ",
          data.updatedData
        );
        setAction("edit");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  const rows = data.map((point, i) => {
    return createData(
      i,
      point["reporting date"],
      point.country,
      point.location,
      point.age,
      point.gender,
      Number(point.death) ? "Yes" : "No",
      Number(point.recovered) ? "Yes" : "No",
      point.id
    );
  });

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
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
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                  >
                    {action ? (
                      <StyledTableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            handleDeletion(row);
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
                );
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
    </Paper>
  );
};

export default DataTable;
