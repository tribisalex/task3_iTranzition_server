require('dotenv').config()
const express = require('express')
const router = require('./routes/index')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)


app.use(errorHandler)

app.listen(PORT, () => console.log(`server started on port ${PORT}`))

