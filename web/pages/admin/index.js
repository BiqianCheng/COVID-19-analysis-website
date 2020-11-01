import styles from "../../styles/pages/Admin.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Button from "@material-ui/core/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import DataTable from "../../components/Analytics/DataTable";
import CustomDialog from "../../components/Admin/CustomDialog";
import CustomSnack from "../../components/Admin/CustomSnack";

export default function Analytics() {
  const [popUpOpen, setpopUpOpen] = React.useState(false);
  const [action, setAction] = React.useState("none");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    country: "",
    location: "",
    age: "",
    gender: "",
    recovered: "",
    death: "",
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/analytics/search/`, {
        params: {
          data: {},
        },
      })
      .then(({ data }) => {
        setData(data.filteredData);
        console.log("Successfully talked to the server!: ", data.filteredData);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePopUpOpen = () => {
    setpopUpOpen(true);
  };

  const handlePopUpClose = () => {
    setpopUpOpen(false);
    setInput({
      country: "",
      location: "",
      age: "",
      gender: "",
      recovered: "",
      death: "",
    });
  };

  const handlePopUpChange = (evt) => {
    const value = evt.target.value;
    setInput({
      ...input,
      [evt.target.id]: value,
    });
  };

  const handlePopUpSumbit = () => {
    const jsonData = input;
    axios
      .post(`/admin/insert/`, { jsonData })
      .then(({ data }) => {
        console.log("Succesfully inserted data into file: ", data.csv);
        setAction("error");
      })
      .catch((error) => {
        console.log(error);
      });
    setpopUpOpen(false);
    setInput({
      country: "",
      location: "",
      age: "",
      gender: "",
      recovered: "",
      death: "",
    });
  };

  const handleBackup = () => {
    axios.get(`/admin/backup/`)
      .then(({ data }) => {
        console.log("Succesfully created backup: ", data.fileName);
        setAction("error");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleImport = () => {
    axios.get(`/admin/import/`)
      .then(() => {
        console.log("Succesfully imported dataset");
        setAction("error");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.title}>Admin</div>
        </div>
        <div className={styles.contentWrapper}>
          <Button variant="contained" color="primary" onClick={handlePopUpOpen}>
            Insert Data
          </Button>
          <Button variant="contained" color="primary" onClick={handleBackup}>
            Backup Data
          </Button>
          <Button variant="contained" color="primary" onClick={handleImport}>
            Import Data
          </Button>
        </div>

        <CustomDialog
          open={popUpOpen}
          input={input}
          handlePopUpClose={handlePopUpClose}
          handlePopUpSumbit={handlePopUpSumbit}
          handlePopUpChange={handlePopUpChange}
        />
        <CustomSnack
          action={action}
          setAction={setAction}
          severity="success"
          message="Opreation Successful"
        />

        {loading && (
          <div className={styles.loading}>
            <CircularProgress style={{ color: "black" }} size={16} />
          </div>
        )}
        {data && (
          <div className={styles.table}>
            <DataTable
              data={data}
              key={data}
              action={action}
              setAction={setAction}
              handlePopupOpen={handlePopUpOpen}
              input={input}
              setInput={setInput}
            />
          </div>
        )}
      </div>
    </>
  );
}
