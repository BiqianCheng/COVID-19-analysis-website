import { useState, useEffect } from "react";
import axios from "axios";

export const Context = React.createContext();

export default function dataContext(props) {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null)
  const [columns, setColumns] = useState([])

  useEffect(() => {
    axios.get(`/analytics/allData/`)
      .then(({ data }) => {
        setData(data.dataset);
        setAnalytics(data.analytics)
        setColumns(data.columns)
        // console.log("Dataset received! ", data.dataset.length);
        // console.log("Analytics received! ", data.analytics);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const insertData = (jsonData) => {
    console.log("Inserting Data: ", jsonData)

    let newData = {}
    columns.map((column) => {
      if (jsonData[column]) {
        newData[column] = jsonData[column]
      } else {
        newData[column] = ''
      }
    })

    analytics.cases++
    // console.log("test: ", newData[columns[columns.length - 1]])
    newData.death == true ? analytics.deaths++ : null
    newData.recovered == true ? analytics.recoveries++ : null

    data.push(newData)
  }

  const updateData = (index, jsonData) => {
    const found = data[index]

    if (!found) {
      console.log(`Data not found in the dataset for: ${index}`)
    }

    data[index] = jsonData
  }

  const deleteData = (index) => {
    const found = data[index]

    if (!found) {
      console.log(`Data not found in the dataset for: ${index}`)
    }
    data.splice(index, 1)
  }

  return (
    <Context.Provider
      value={{
        data,
        analytics,
        columns,
        insertData,
        updateData,
        deleteData
      }}>
      {props.children}
    </Context.Provider>
  )
}
