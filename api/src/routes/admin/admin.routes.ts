import express from 'express'
const { Parser } = require('json2csv');
import parseCSV from '../../utils/csvUtils'
const fs = require('fs');

const router = express.Router()

router.post('/insert', async (req: any, res) => {
  let { jsonData } = req.body
  const {columns, data} = parseCSV()
  // get the last element's id in the dataset
  const [[lastIdKey, lastIdValue]] = Object.entries(data.slice(-2)[0]) 
 
  // After testing. This console.log proves that the id key has an empty string in front of it.
  // Thus obj.id won't work must use Object.keys and get the key value directly
  // console.log(lastIdKey[0].split(''))

  console.log("Json Data: ", jsonData)
  jsonData[lastIdKey] = Number(lastIdValue)+1
  const parser = new Parser({
    fields: columns,
    header: false,
  })

  // parsed json + newline
  const csv = parser.parse(jsonData) + "\r\n"

  fs.appendFile('./src/db/COVID19_line_list_data.csv', csv, (err) => {
    if (err) console.error('Couldn\'t append the data');
    console.log("CSV Data: ", csv)
    console.log('The data was appended to file!');
  });

  res.json({
    csv: csv
  })
})

router.put('/update/:id', async (req: any, res) => {
  const { id } = req.params

  res.json({})
})

router.delete('/delete/:id', async (req: any, res) => {
  const { id } = req.params

  res.json({})
})

export default router