const fs = require('fs');

export const parseCSV = () => {
  let columnHeaders = []
  let columnsCSV = ""
  let dataArray = []
  let csvData = fs.readFileSync('./src/db/COVID19_line_list_data.csv', 'utf8');

  // create a new array by splitting the raw data csv based on newlines
  csvData = csvData.split('\n');
  columnsCSV = csvData[0]
  // get an array of the column headers delimited by commas
  columnHeaders = csvData[0].split(',')

  // loop through data and split data string based on commas while ignoring commas inside double quotes 
  // regex from https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
  // and parse into json using reduce loop to match column header array as keys to data as the values
  for ( let entry of csvData) {
    entry = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    dataArray.push(entry.reduce((json, value, key) => { 
      json[columnHeaders[key]] = value; return json; 
    }, {})
    )
  }

  const [idKey] = Object.keys(dataArray[0])

  return ({
    columns: columnHeaders, // array of column headers
    columnsJSON: dataArray[0], // columns in json
    idKey: idKey, // id key string (since their's an empty string in front for some reason)
    csvArray: csvData, // csv row by row array
    data: dataArray.splice(1) // data json
  })
}

export default parseCSV