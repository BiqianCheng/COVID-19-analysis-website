import express from 'express'
import parseCSV from '../../utils/csvUtils'

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
    filteredData: filteredData.splice(1) // remove column header row
  })
})

router.post('/insert', async (req: any, res) => {
  res.json({})
})

router.put('/update/:id', async (req: any, res) => {
  res.json({})
})

router.delete('/delete/:id', async (req: any, res) => {
  res.json({})
})

router.get('/test', async (req: any, res) => {
  console.log("Hello from the api server!")
  res.json({
    message: "Hello from the api server!"
  })
})

export default router