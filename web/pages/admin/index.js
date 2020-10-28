import styles from "../../styles/pages/Admin.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Button from "@material-ui/core/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import DataTable from "../../components/Analytics/DataTable";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

export default function Analytics() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    country: "",
    age: "",
    gender: "",
    recovered: "",
    death: "",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertData = () => {};
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/analytics/search/`, {
        params: {
          data: {},
        },
      })
      .then(({ data }) => {
        console.log("Successfully talked to the server!: ", data.filteredData);
        setData(data.filteredData);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setInput({
      ...input,
      [evt.target.id]: value,
    });
  };

  const handleSubmit = () => {
    setOpen(false);
    console.log(input);
    setInput({ country: "", age: "", gender: "", recovered: "", death: "" });
  };

  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.title}>Admin</div>
        </div>
        <div className={styles.contentWrapper}>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Insert Data
          </Button>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Data</DialogTitle>
          <DialogContent>
            <DialogContentText>Insert your data below:</DialogContentText>
            <Grid
              container
              className={styles.gridContainer}
              justify="center"
              spacing={1}
            >
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={input.country}
                  variant="outlined"
                  size="small"
                  autoFocus
                  margin="dense"
                  id="country"
                  label="country"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={input.age}
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  id="age"
                  label="Age"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={input.gender}
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  id="gender"
                  label="Gender"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={input.recovered}
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  id="recovered"
                  label="Recovered"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={input.death}
                  variant="outlined"
                  autoFocus
                  margin="dense"
                  id="death"
                  label="Death"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        {loading && (
          <div className={styles.loading}>
            <CircularProgress style={{ color: "black" }} size={16} />
          </div>
        )}
        {data && (
          <div className={styles.table}>
            <DataTable data={data} key={data} />
          </div>
        )}
      </div>
    </>
  );
}
