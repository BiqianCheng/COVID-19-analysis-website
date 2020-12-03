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

  const searchData = (queryInputs, startDate, endDate) => {

    console.log("Query Inputs: ", queryInputs)

    // turn dates into same format as reporting date column
    if (startDate) {
      startDate = new Date(startDate)
    } else {
      startDate = new Date("1900-01-01") // from the beginning
    }
    if (endDate) {
      endDate = new Date(endDate)
    } else {
      endDate = new Date("2100-12-31") // to the end
    }


    let filteredData = data.filter(entry => {
      let reportingDate = new Date(entry["reporting date"]).getTime()
      if (startDate.getTime() <= reportingDate && reportingDate <= endDate.getTime()) {
        return true
      }
    })


    for (let key in queryInputs) {
      // delete empty fields from the query
      if (queryInputs[key] == null || queryInputs[key] == '') {
        delete queryInputs[key]
      }
      // Convert 1/0 into boolean values
      if (queryInputs[key] == "1") {
        queryInputs[key] = 1
      } else if (queryInputs[key] == "0") {
        queryInputs[key] = 0
      }
    }

    // If the data is not equal to any of the filters then discard.
    // Else if it passes each filter then keep
    filteredData = filteredData.filter(entry => {
      for (let key in queryInputs) {
        if (entry[key] === undefined) {
          return false
        } else if (typeof queryInputs[key] != "string") {
          if (entry[key] != queryInputs[key]) {
            return false
          }
        } else if (entry[key].toLowerCase() != queryInputs[key].toLowerCase()) {
          return false
        }
      }
      return true;
    })

    return filteredData

  }

  return (
    <Context.Provider
      value={{
        data,
        analytics,
        columns,
        insertData,
        updateData,
        deleteData,
        searchData
      }}>
      {props.children}
    </Context.Provider>
  )
}
