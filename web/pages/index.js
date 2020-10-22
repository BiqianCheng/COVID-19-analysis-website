import styles from "../styles/pages/Home.module.css";
import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const countries = ["Afghanistan", "Algeria", "Australia", "Austria", "Bahrain", "Belgium", "Cambodia", "Canada", "China", "Croatia", "Egypt", "Finland", "France", "Germany", "Hong Kong", "India", "Iran", "Israel", "Italy", "Japan", "Kuwait", "Lebanon", "Malaysia", "Nepal", "Phillipines", "Russia", "Singapore", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "UAE", "UK", "USA", "Vietnam"];
const age = ["18", "23", "24"];
const sex = ["Male", "Female", "NA"];

export default function Home() {
  const [value, setValue] = React.useState({
    countries: countries[0],
    sex: sex[0],
  });
  const [inputValue, setInputValue] = React.useState({
    countries: "",
    sex: "",
  });
  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.title}>BBCDS Covid-19 Analytics</div>
          <div className={styles.description}>
            Helping you understand the current state of Covid-19
          </div>
          <Container maxWidth="lg">
            <Grid container spacing={5}>
              {/* Country Autocompete */}
              <Grid item xs={4}>
                <Autocomplete
                  value={value.countries}
                  onChange={(event, newValue) => {
                    setValue({ ...value, countries: newValue });
                  }}
                  // inputValue={inputValue.countries}
                  // onInputChange={(event, newInputValue) => {
                  //   setInputValue({ countries: newInputValue });
                  // }}
                  id="controllable-states-demo"
                  options={countries}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country" variant="outlined" />
                  )}
                />
              </Grid>

              {/* Age selection */}
              <Grid item xs={4}>
                <Autocomplete
                  value={value.age}
                  onChange={(event, newValue) => {
                    setValue({ ...value, age: newValue });
                  }}
                  id="controllable-states-demo"
                  options={age}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Age" variant="outlined" />
                  )}
                />
              </Grid>

              {/* Sex autocomplete */}
              <Grid item xs={4}>
                <Autocomplete
                  value={value.sex}
                  onChange={(event, newValue) => {
                    setValue({ ...value, sex: newValue });
                  }}
                  // inputValue={inputValue.sex}
                  // onInputChange={(event, newInputValue) => {
                  //   setInputValue({ ...inputValue, sex: newInputValue });
                  // }}
                  id="controllable-states-demo"
                  options={sex}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sex" variant="outlined" />
                  )}
                />
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
}
