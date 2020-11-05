import express from 'express'
import parseCSV from '../../utils/csvUtils'

const router = express.Router()

router.get('/search', async (req: any, res) => {
  const {columns, data} = parseCSV()
  let {queryInputs, startDate, endDate} = req.query

  // turn the inputs from the client into a JSON Object
  queryInputs = JSON.parse(req.query.data)

  // turn dates into same format as reporting date column
  if (req.query.startDate) {
    startDate = new Date(startDate)
  } else {
    startDate = new Date("1900-01-01") // from the beginning
  }
  if (req.query.endDate) {
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
    // Convert Yes/No into boolean values
    if (queryInputs[key] == "Yes") {
      queryInputs[key] = true
    } else if (queryInputs[key] == "No") {
      queryInputs[key] = false
    }
  }

  filteredData = filteredData.filter( entry => {
    for (let key in queryInputs) {
      if (entry[key] === undefined) {
        return false
      } else if (typeof entry[key] != "string" || typeof queryInputs[key] != "string") {
        return entry[key] == queryInputs[key]
      } else if (entry[key].toLowerCase() != queryInputs[key].toLowerCase()) {
        return false
      }
    }
    return true;
  })

  res.json({
    filteredData: filteredData
  })
})

router.get('/test', async (req: any, res) => {
  console.log("Hello from the api server!")
  res.json({
    message: "Hello from the api server!"
  })
})

export default router