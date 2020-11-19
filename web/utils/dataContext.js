import { useState, useEffect } from "react";
import axios from "axios";

export const Context = React.createContext();

export default function dataContext(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`/analytics/allData/`)
      .then(({ data }) => {
        setData(data);
        console.log("Dataset received! ", data.dataset.length);
        console.log("Analytics received! ", data.analytics);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <Context.Provider value={data}>{props.children}</Context.Provider>;
}
