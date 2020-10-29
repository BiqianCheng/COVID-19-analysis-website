import { json } from 'body-parser';
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
  jsonData[lastIdKey] = Number(lastIdValue)+1

  // populate reporting date with date of insert
  var today = new Date();
  jsonData["reporting date"] = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear()

  const parser = new Parser({
    fields: columns,
    header: false,
    quote: ''
  })

  // parsed json + newline
  const csv = parser.parse(jsonData) + "\r\n"

  fs.appendFile('./src/db/COVID19_line_list_data.csv', csv, (err) => {
    if (err) console.error('Couldn\'t append the data');
    console.log('The data was inserted to the file!', csv);
  });

  res.json({
    csv: csv
  })
})

router.put('/update/:index', async (req: any, res) => {
  const { index } = req.params
  const { jsonData } = req.body

  let {columns, csvArray, data} = parseCSV()

  // check if data exists at index passed
  const found = data[index]

  console.log("Found? ", index)

  if (!found) {
    res.status(404).json({ 
      error: 'Data based on that ID not found in the dataset ./src/db/COVID19_line_list_data.csv' 
    })
  }

  // Update keys based on input and leave the rest of the keys untouched
  for (let key in jsonData) {
    data[index][key] = jsonData[key]
  }

  const parser = new Parser({
    fields: columns,
    header: false,
    quote: ''
  })

  // parse updated data to csv
  const updatedDataCsv = parser.parse(data[index])

  // replace csv row at index with updated data
  csvArray.splice(index+1, 1, updatedDataCsv)
  const csv = csvArray.join('\n')

  fs.writeFile("./src/db/COVID19_line_list_data.csv", csv, (err) => { 
    if(err) { return console.log(err); }
    console.log(`Data ${index} has been updated to `, data[index])
  }); 

  res.json({
    updatedData: data[index]
  })
})

router.delete('/delete/:index', async (req: any, res) => {
  const { index } = req.params
  let {csvArray, data} = parseCSV()

  // check if data exists at index passed
  const found = data[index]

  console.log("Delete test: ", found)

  if (!found) {
    res.status(404).json({ 
      error: "Data based on that ID not found in the dataset ./src/db/COVID19_line_list_data.csv" 
    })
  }

  // delete data at index
  csvArray.splice(index+1, 1) 
  // turn array into one big string merged according to the delimiter '\n'
  csvArray = csvArray.join('\n')

  fs.writeFile("./src/db/COVID19_line_list_data.csv", csvArray, (err) => { 
    if(err) { return console.log(err); }
    console.log(`Data ${index} has been deleted`)
  }); 


  res.json({})
})

export default router