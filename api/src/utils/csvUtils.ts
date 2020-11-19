const fs = require('fs');

export const activeDataset = "./src/db/Merged_Dataset.csv"

const mergedDataset = {
  filePath: "./src/db/Merged_Dataset.csv",
  columns: [
    {
      name: "id",
      colNum: 0,
    },
    {
      name: "reporting date",
      colNum: 1,
    },
    {
      name: "summary",
      colNum: 2,
    },
    {
      name: "location",
      colNum: 3,
    },
    {
      name: "country",
      colNum: 4,
    },
    {
      name: "gender",
      colNum: 5,
    },
    {
      name: "age",
      colNum: 6,
    },
    {
      name: "death",
      colNum: 7,
    },
    {
      name: "recovered",
      colNum: 8,
    }
  ]
}

const datasets = [
  {
    name: "lineList",
    active: true, // toggle if this dataset will be used
    filePath: "./src/db/COVID19_line_list_data.csv",
    columns: [ // The columns we want to scrape from the dataset
      {
        name: "id",
        colNum: 0,
        link: "id" // The column to link to from the columns of the merged dataset
      },
      {
        name: "reporting date",
        colNum: 2,
        link: "reporting date"
      },
      {
        name: "summary",
        colNum: 4,
        link: "summary"
      },
      {
        name: "location",
        colNum: 5,
        link: "location"
      },
      {
        name: "country",
        colNum: 6,
        link: "country"
      },
      {
        name: "gender",
        colNum: 7,
        link: "gender"
      },
      {
        name: "age",
        colNum: 8,
        link: "age"
      },
      {
        name: "death",
        colNum: 16,
        link: "death"
      },
      {
        name: "recovered",
        colNum: 17,
        link: "recovered"
      }
    ]
  },
  {
    name: "openLineList",
    active: true,
    filePath: "./src/db/COVID19_open_line_list.csv",
    columns: [// The columns we want to scrape from the dataset
      {
        name: "ID",
        colNum: 0,
        link: "id" // The column to link to from the columns of the merged dataset
      },
      {
        name: "age",
        colNum: 1,
        link: "age"
      },
      {
        name: "sex",
        colNum: 2,
        link: "gender"
      },
      {
        name: "city",
        colNum: 3,
        link: "location"
      },
      {
        name: "country",
        colNum: 5,
        link: "country"
      },
      {
        name: "date_confirmation",
        colNum: 12,
        link: "reporting date"
      },
      {
        name: "outcome",
        colNum: 23,
        link: "death"
      },
      {
        name: "outcome",
        colNum: 23,
        link: "recovered"
      }
    ]
  }
]

// parse the merged datset into JSON for use throughout the API
export const parseCSV = () => {
  let dataArray = []
  let columnHeaders = []

  let csvData = fs.readFileSync(activeDataset, 'utf8');
  // create a new array by splitting the raw data csv based on newlines
  csvData = csvData.split('\n');
  columnHeaders = csvData[0].split(',')
  csvData.shift() // remove column headers from json data

  // loop through data and split data string based on commas while ignoring commas inside double quotes 
  // regex from https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
  // and parse into json using reduce loop to match column header array as keys to data as the values
  for ( let entry of csvData) {
    entry = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    dataArray.push(entry.reduce((json, value, key) => { 
      json[mergedDataset.columns[key].name] = value; return json; 
    }, {})
    )
  }
  return ({
    columns: mergedDataset.columns, // array of column headers
    csvArray: csvData, // csv row by row array
    data: dataArray // data json
  })
}

// scrape from the list of datasets and merge them into a single csv
export const mergeCSVs = () => {
  let mergedCSVArray = []
  let idCounter = 1
  // loop dataset metadata and populate the mergedCSVArray
  datasets.map((dataset) => {
    let csvData = fs.readFileSync(dataset.filePath, 'utf8');
  
    // create a new array by splitting the raw data csv based on newlines
    csvData = csvData.split('\n');
    csvData.shift() // remove column row from csv

    for ( let entry of csvData) {
      let modifiedEntry = []
      // split the data entry by commas. Ignore commans inside quotes
      entry = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      
      // create a new csv row based off the pattern of the mergedDataset
      // populate the row with the data from the dataset being scraped and push it into the merged array
      mergedDataset.columns.map((mColumn) => {
        let foundColumn = dataset.columns.filter((column) => {
          return column.link == mColumn.name
        })
        // if the dataset doesn't have the column then leave it blank in the resulting data
        // can't just ignore since it needs to match the resulting csv column pattern
        if (!foundColumn[0]) {
          modifiedEntry[mColumn.colNum] = ''
        } else {
          if (mColumn.name == "id") {
            modifiedEntry[mColumn.colNum] = idCounter
            idCounter++
          } else if (mColumn.name == "reporting date") {
            let date = entry[foundColumn[0].colNum]
            if (dataset.name == "openLineList") {
              // change from 1.20.2020 to 1/20/2020 date format
              // make sure to check if date is not undefined
              date = date ? date.split('.').join('/') : date
            }
            modifiedEntry[mColumn.colNum] = date
          } else if (mColumn.name == "recovered") {
            let recovered = entry[foundColumn[0].colNum]
            if (dataset.name == "openLineList") {
              if (recovered && (recovered == "stable" || recovered == "discharge" || recovered == "discharged" )) {
                recovered = 1
              } else {
                recovered = 0
              } 
            }
            modifiedEntry[mColumn.colNum] = recovered
          } else if (mColumn.name == "death") {
            let death = entry[foundColumn[0].colNum]
            if (dataset.name == "openLineList") {
              if (death && (death == "death" || death == "died" )) {
                death = 1
              } else {
                death = 0
              } 
            }
            modifiedEntry[mColumn.colNum] = death
          } else {
            modifiedEntry[mColumn.colNum] = entry[foundColumn[0].colNum]
          }
        }
      })
    
      mergedCSVArray.push(modifiedEntry)
    }
  })

  // Add the column header to the top of the csv
  mergedCSVArray.unshift(mergedDataset.columns.map((column) => {
    return column.name
  }).join(','))

  fs.writeFile(activeDataset, mergedCSVArray.join('\n'), (err) => { 
    if(err) { return console.log(err); }
  }); 

}

export default parseCSV