import express from 'express'
import parseCSV from '../../utils/csvUtils'

const router = express.Router()

router.get('/allData', async (req: any, res) => {
  const {columns, data} = parseCSV()

  data.pop()

  let analytics = {
    cases: data.length, //subtract last row and column header row
    deaths: 0,
    recoveries: 0,
    mostCountry: "",
    mostLocation: "",
    mostAgeGroup: "",
    mostGender: ""
  }

  let countries = {}
  let locations = {}
  let genders = {}
  let ageGroups = {
    "0-17": 0,
    "18-29": 0,
    "30-44": 0,
    "45-59": 0,
    "60+": 0,
  }

  data.map((entry) => {
    if (!entry.id || !entry.country || !entry.location || !entry.gender) return // return if empty entry

    entry.death == 1 ? analytics.deaths++ : null
    entry.recovered == 1 ? analytics.recoveries++ : null


    let country = entry.country.toLowerCase()
    if (countries[country] && country.length > 0) {
      countries[country] = ++countries[country]
    } else {
      countries[country] = 1
    }

    let location = entry.location.toLowerCase()
    if (locations[location] && location.length > 0) {
      locations[location] = ++locations[location]
    } else {
      locations[location] = 1
    }

    let gender = entry.gender.toLowerCase()
    if (genders[gender] && gender.length > 0 ) {
      genders[gender] = ++genders[gender]
    } else {
      genders[gender] = 1
    }

    if (entry.age <= 0) {
      // skip
    } else if (entry.age <= 17) {
      ageGroups["0-17"] = ageGroups["0-17"] + 1
    } else if (entry.age <= 29) {
      ageGroups["18-29"] = ageGroups["18-29"] + 1
    } else if (entry.age <= 44) {
      ageGroups["30-44"] = ageGroups["30-44"] + 1
    } else if (entry.age <= 59) {
      ageGroups["45-59"] = ageGroups["45-59"] + 1
    } else if (entry.age >= 60) {
      ageGroups["60+"] = ageGroups["60+"] + 1
    }
    
  })
  

  let maxVal: any = 0
  let countryData = []
  Object.entries(countries).map(([key, value]) => {
    countryData.push({
      [key]: value
    })
    if ( maxVal < value) {
      maxVal = value
      analytics.mostCountry = key
    }
  })

  maxVal = 0
  let locationData = []
  Object.entries(locations).map(([key, value]) => {
    locationData.push({
      [key]: value
    })
    if ( maxVal < value) {
      maxVal = value
      analytics.mostLocation = key
    }
  })

  maxVal = 0
  let genderData = []
  Object.entries(genders).map(([key, value]) => {
    genderData.push({
      [key]: value
    })
    if ( maxVal < value) {
      maxVal = value
      analytics.mostGender = key
    }
  })

  maxVal = 0
  let ageData = []
  Object.entries(ageGroups).map(([key, value]) => {
    ageData.push({
      [key]: value
    })
    if ( maxVal < value) {
      maxVal = value
      analytics.mostAgeGroup = key
    }
  })

  res.json({
    columns: columns,
    dataset: data,
    analytics: analytics
  })
})

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
    if (queryInputs[key] == "1") {
      queryInputs[key] = 1
    } else if (queryInputs[key] == "0") {
      queryInputs[key] = 0
    }
  }

  // If the data is not equal to any of the filters then discard.
  // Else if it passes each filter then keep
  filteredData = filteredData.filter( entry => {
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

  res.json({
    filteredData: filteredData
  })
})

export default router