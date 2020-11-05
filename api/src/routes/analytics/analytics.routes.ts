import express from 'express'
import parseCSV from '../../utils/csvUtils'

const router = express.Router()

router.get('/search', async (req: any, res) => {
  const {columns, data} = parseCSV()

  // turn the inputs from the client into a JSON Object
  let queryInputs = JSON.parse(req.query.data)

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

  console.log("Test: ", queryInputs)

  const filteredData = data.filter( entry => {
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

  console.log("Data: ", filteredData.length)

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