import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useState, useEffect } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from "axios";

export default function ImportDialog({ open, onClose, setAction }) {

  const [file, setFile] = useState("")
  const [options, setOptions] = useState([])

  const handleChange = (e) => {
    setFile(e.target.value)
  }

  const handleSubmit = () => {
    axios.post(`/admin/import`, { file })
      .then(() => {
        console.log("Succesfully imported dataset")
        setAction("error")
        handleClose()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    axios.get(`/admin/import/options`)
      .then(({ data }) => {
        setOptions(data.options)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
        } else {
          console.log(error)
        }
      });
  }, [])

  const handleClose = () => {
    setFile("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Import a dataset</DialogTitle>
      <DialogContent>
        <DialogContentText>Choose what file to import:</DialogContentText>
        <FormControl style={{ "width": "100%" }} variant="outlined">
          <InputLabel>File</InputLabel>
          <Select
            value={file}
            onChange={handleChange}
            label="File"
            fullWidth
          >
            {options && options.map((e) => {
              return (
                <MenuItem key={e} value={e}>{e}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
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
  );
}
