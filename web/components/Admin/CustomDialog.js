import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function CustomDialog({
  title,
  contentText,
  open,
  input,
  handlePopUpClose,
  handlePopUpSumbit,
  handlePopUpChange,
}) {

  return (
    <Dialog
      open={open}
      onClose={handlePopUpClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
        {Object.keys(input).map((value, i) => {
          if (value === "reporting date") {
            return (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  inputVariant="outlined"
                  label={value}
                  value={input[value]}
                  onChange={(date) => {
                    let e = { target: { id: value, value: date } };
                    handlePopUpChange(e);
                  }}
                  fullWidth
                />
              </MuiPickersUtilsProvider>
            );
          }
          return (
            (value === "death" || value === "recovered") ?
              <>
                <FormControl
                  variant="outlined"
                  size="medium"
                  margin="dense"
                  style={{ minHeight: "3rem" }}
                  fullWidth
                >
                  <InputLabel>{value}</InputLabel>
                  <Select
                    id={value}
                    name={value}
                    label={value}
                    value={input[value]}
                    onChange={handlePopUpChange}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={0}>0</MenuItem>
                  </Select>
                </FormControl>
              </>
              :
              <TextField
                style={{ minHeight: "3rem" }}
                onChange={handlePopUpChange}
                value={input[value]}
                variant="outlined"
                autoFocus={i == 0}
                size="medium"
                margin="dense"
                id={value}
                label={value}
                disabled={(value === "id" || value === "index") ? true : false}
                fullWidth
              />
          )

        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePopUpClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePopUpSumbit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog >
  );
}
