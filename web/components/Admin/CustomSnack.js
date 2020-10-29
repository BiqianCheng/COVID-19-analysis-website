import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomSnack(props) {
  const { action, setAction, severity, message } = props;
  return (
    <Snackbar
      // Success Snackbar
      open={action === "none" ? false : true}
      autoHideDuration={4000}
      onClose={() => {
        setAction("none");
      }}
    >
      <Alert
        onClose={() => {
          setAction("none");
        }}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
