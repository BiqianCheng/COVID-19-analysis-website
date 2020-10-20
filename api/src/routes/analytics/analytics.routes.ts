import express from 'express'
import parseCSV from '../../utils/csvUtils'

const router = express.Router()

router.get('/search', async (req: any, res) => {
  const {columns, data} = parseCSV()

  let queryInputs = JSON.parse(req.query.data)
  let filter = {...queryInputs}

  const filteredData = data.filter( entry => {
    for (let key in filter) {
      if (entry[key] === undefined || entry[key].toLowerCase() != filter[key].toLowerCase())
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