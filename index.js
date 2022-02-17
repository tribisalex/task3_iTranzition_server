require('dotenv').config()
const express = require('express')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandingMiddleware')
const cors = require('cors')
const corsOptions ={
  origin:'https://tribisalex.github.io/task3_iTranzition_client/',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cors(corsOptions));
app.use('/api', router)




app.use(errorHandler)

app.listen(PORT, () => console.log(`server started on port ${PORT}`))

