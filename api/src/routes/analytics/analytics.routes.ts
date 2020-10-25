import express from 'express'
const { Parser } = require('json2csv');
import parseCSV from '../../utils/csvUtils'
const fs = require('fs');

const router = express.Router()

router.get('/search', async (req: any, res) => {
  const {columns, data} = parseCSV()

  // turn the inputs from the client into a JSON Object
  let queryInputs = JSON.parse(req.query.data)

  const filteredData = data.filter( entry => {
    for (let key in queryInputs) {
      if (entry[key] === undefined || entry[key].toLowerCase() != queryInputs[key].toLowerCase())
        return false;
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