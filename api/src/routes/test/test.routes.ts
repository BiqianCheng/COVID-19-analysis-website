import express from 'express'

const router = express.Router()

router.get('/test', async (req: any, res) => {
  console.log("Hello from the api server!")
  res.json({
    message: "Hello from the api server!"
  })
})

export default router