import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

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
          return (
            <TextField
              onChange={handlePopUpChange}
              value={input[value]}
              variant="outlined"
              size="small"
              autoFocus
              margin="dense"
              id={value}
              label={value}
              disabled={value === ("id" || "index") ? true : false}
              fullWidth
            />
          );
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
    </Dialog>
  );
}
