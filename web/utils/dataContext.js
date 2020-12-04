import { useState, useEffect } from "react";
import axios from "axios";

export const Context = React.createContext();

export default function dataContext(props) {
  const [data, setData] = useState(null)
  const [modified, setModified] = useState(false) // if the dataset has been modified/changed
  const [analytics, setAnalytics] = useState(null)
  const [columns, setColumns] = useState([])

  // next.js check if client
  if (process.browser) {
    // when user leaves the window (close or refresh) run function
    window.onbeforeunload = () => {
      if (modified) {
        axios.post(`/admin/saveDataset/`, { dataset: data })
      }
    }
  }

  useEffect(() => {
    axios.get(`/analytics/allData/`)
      .then(({ data }) => {
        setData(data.dataset);
        setAnalytics(data.analytics)
        setColumns(data.columns)
      })
      .catch((error) => {
        console.log(error);
      })

  }, []);

  const insertData = (jsonData) => {
    console.log("Inserting Data: ", jsonData)
    setModified(true)
    let newData = {}
    columns.map((column) => {
      if (jsonData[column]) {
        newData[column] = jsonData[column]
      } else {
        newData[column] = ''
      }
    })

    /*Insert incremental analytics strategy*/
    analytics.cases++
    newData.death == true ? analytics.deaths++ : null
    newData.recovered == true ? analytics.recoveries++ : null

    data.push(newData)
  }

  const updateData = (index, jsonData) => {
    const found = data[index]
    setModified(true)
    if (!found) {
      console.log(`Data not found in the dataset for: ${index}`)
    }

    /* Update incremental analytics strategy */
    jsonData.death == true && found.death == false
      ? analytics.deaths++ : jsonData.death == false && found.death == true
        ? analytics.deaths-- : null

    jsonData.recovered == true && found.recovered == false
      ? analytics.recoveries++ : jsonData.recovered == false && found.recovered == true
        ? analytics.recoveries-- : null

    // convert date to dd/mm/yyyy format
    // first check if a date object exists 
    if (typeof jsonData["reporting date"].getMonth === "function") {
      let reportingDate = jsonData["reporting date"]
      jsonData["reporting date"] = (reportingDate.getMonth() + 1) + '/' + reportingDate.getDate() + '/' + reportingDate.getFullYear()
    }

    data[index] = jsonData
  }

  const deleteData = (index) => {
    const found = data[index]
    setModified(true)
    if (!found) {
      console.log(`Data not found in the dataset for: ${index}`)
    }

    /*Insert incremental analytics strategy*/
    analytics.cases--
    found.death == true ? analytics.deaths-- : null
    found.recovered == true ? analytics.recoveries-- : null

    data.splice(index, 1)
  }

  const searchData = (queryInputs, startDate, endDate) => {
    console.log("queryInputs: ", queryInputs)

    // turn dates into same format as reporting date column
    if (startDate) {
      startDate = new Date(startDate)
    } else {
      // if no start date specified then start from the beginning
      startDate = new Date("1900-01-01")
    }
    if (endDate) {
      endDate = new Date(endDate)
    } else {
      // if no end date specified then end at the absolute end
      endDate = new Date("2100-12-31")
    }

    let filteredData

    // filter by stateDate & endDate
    filteredData = data.filter(entry => {
      // keep immediately if no reporting date for entry
      if (!entry["reporting date"]) {
        return true
      }
      let reportingDate = new Date(entry["reporting date"]).getTime()
      if (startDate.getTime() <= reportingDate && reportingDate <= endDate.getTime()) {
        return true
      }
    })

    for (let key in queryInputs) {
      // delete empty fields from the query
      if (queryInputs[key] == null || queryInputs[key] == '') {
        delete queryInputs[key]
      } else {
        // Convert death/recovered into boolean values
        // special case: queryInputs[key].includes('/')
        // some entries in the dataset returns the date of recovery/death (ex. "2/04/2020")
        if (key == "death" || key == "recovered") {
          if (queryInputs[key] == "1" || queryInputs[key].includes('/')) {
            queryInputs[key] = 1
          } else if (queryInputs[key] == "0") {
            queryInputs[key] = 0
          }
        }
      }
    }

    // If the data is not equal to any of the filters then discard.
    // Else if it passes each filter then keep
    filteredData = filteredData.filter(entry => {
      for (let key in queryInputs) {
        if (entry[key] === undefined) {
          return false
        } else if (typeof queryInputs[key] != "string") {
          // special case for when a date is returned from the dataset from death/recovered column instead of a boolean stating whether death/recovered happened
          // if a date is returned than it's equal to being true
          if (key == "death" || key == "recovered") {
            if (entry[key].includes('/') && queryInputs[key]) {
              return true
            }
          }

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
