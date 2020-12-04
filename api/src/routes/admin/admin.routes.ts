import { json } from 'body-parser';
import express from 'express'
const { Parser } = require('json2csv');
import parseCSV, {activeDataset} from '../../utils/csvUtils'
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
  // only if the user doesn't manually enter a reporting date
  if (!jsonData["reporting date"]) {
    var today = new Date();
    jsonData["reporting date"] = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear()
  }
  const parser = new Parser({
    fields: columns,
    header: false,
    quote: ''
  })

  // parsed json + newline
  const csv = parser.parse(jsonData) + "\r\n"

  fs.appendFile(activeDataset, csv, (err) => {
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
      error: `Data based on that ID not found in the dataset ${activeDataset}` 
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
  csvArray.splice(index, 1, updatedDataCsv)
  csvArray.unshift(columns) // readd column headers to top of csv
  const csv = csvArray.join('\n')

  fs.writeFile(activeDataset, csv, (err) => { 
    if(err) { return console.log(err); }
    console.log(`Data ${index} has been updated to `, data[index])
  }); 

  res.json({
    updatedData: data[index]
  })
})

router.delete('/delete/:index', async (req: any, res) => {
  const { index } = req.params
  let {columns, csvArray, data} = parseCSV()

  // check if data exists at index passed
  const found = data[index]

  console.log("Delete test: ", found)

  if (!found) {
    res.status(404).json({ 
      error: `Data based on that ID not found in the dataset ${activeDataset}` 
    })
  }

  // delete data at index
  csvArray.splice(index, 1) 
  csvArray.unshift(columns) // readd column headers to top of csv
  // turn array into one big string merged according to the delimiter '\n'
  csvArray = csvArray.join('\n')

  fs.writeFile(activeDataset, csvArray, (err) => { 
    if(err) { return console.log(err); }
    console.log(`Data ${index} has been deleted`)
  }); 

  res.json({})
})

// Copies the content of the active data set (.aka ./src/db/COVID19_line_list_data.csv )
// and pastes it into a new file located in ./src/db/backups 
// and named with a time stamp (yyyy-mm-dd-hh-mm) prefixed to it
router.get('/backup', async (req: any, res) => {
  let today = new Date()
  let newBackupFile = `./src/db/backups/${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${activeDataset.slice(9)}`
  fs.copyFile(activeDataset, newBackupFile, (err) => { 
    if(err) { return console.log(err); }
    console.log(`Backed up data into a new dataset located at: ${newBackupFile}`)
  }); 

  res.json({
    fileName: newBackupFile
  })
})

// Chooses a file from the backups folder to overwrite the active dataset with
// The active dataset is located at ./src/db/COVID19_line_list_data.csv
router.post('/import', async (req: any, res) => {
  const { file } = req.body
  if (!file) {
    res.status(404).json({ 
      error: `File selector is empty` 
    })
  }

  let fileToImport = `./src/db/backups/${file}`
  fs.copyFile(fileToImport, activeDataset, (err) => { 
    if(err) { return console.log(err); }
    console.log(`Imported data into working dataset`)
  }); 

  res.json({})
})

// Gets an array of the files located in the folder ./src/db/backups
router.get('/import/options', async (req: any, res) => {
  fs.readdir("./src/db/backups", (err, files) => {
    res.json({
      options: files
    })
  });
})

router.post('/saveDataset', async (req: any, res) => {
  let {columns} = parseCSV()

  const dataset = req.body.dataset //get passed in dataset

  const parser = new Parser({
    fields: columns,
    header: true, // put data passed in fields to top of csv (.aka the header)
    quote: ''
  })
  // parse from array of json data to csv + newline
  const updatedDataCsv = parser.parse(dataset) + "\r\n"

  fs.writeFile(activeDataset, updatedDataCsv, (err) => { 
    if(err) { return console.log(err); }
  }); 
})


export default router