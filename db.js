const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRES_USERNAME || process.env.DB_USER,
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
  host: process.env.POSTGRES_HOST || process.env.DB_HOST,
  port: process.env.DB_PORT,
  database:  process.env.POSTGRES_DATABASE || process.env.DB_NAME
})

module.exports = pool