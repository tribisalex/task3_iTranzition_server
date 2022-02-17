const db = require('../db')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')

const generateJwt = (id, name, email, status) => {
  return jwt.sign(
    {id, name, email, status},
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  )
}

class UserController {
  async registration(req, res, next) {
    const {name, email, password, dataRegistration, dateLastAuthorization, status} = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Incorrect email or password'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const newUser = await db.query('INSERT INTO users (name, email, password, dateregistration, datelastauthorization, status) values ($1, $2, $3, $4, $5, $6) RETURNING *', [name, email, hashPassword, dataRegistration, dateLastAuthorization, status], (error, result) => {
      if (error) {
        return next(ApiError.badRequest('User with this name exists'))
      }
      if (result) {
        const token = generateJwt(result.rows[0].id, name, email, status)
        res.json({token})
      }
    })
  }

  async login(req, res, next) {
    const {email, password} = req.body;
    try {
      const data = await db.query(`SELECT * FROM users WHERE email = $1;`, [email]) //Verifying if the user exists in the database
      const user = data.rows;
      if (user.length === 0) {
        return next(ApiError.internal('User not found'))
      } else {
        bcrypt.compare(password, user[0].password, (err, result) => { //Comparing the hashed password
          if (err) {
            return next(ApiError.internal('Server error'))
          } else if (result === true && user[0].status !== 'block') {
            const token = generateJwt(user[0].id, user[0].name, user[0].email, user[0].status)
            res.status(200).json({token})
          } else {
            if (result !== true)
              res.status(400).json({
                error: "Enter correct password!",
              });
          }
        })
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Database error occurred while signing in!",
      });
    };
  };

  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.status)
    return res.json({token})
  }

  async createUser(req, res) {
    const {name, email, password, status} = req.body
    if (!email || !password) {
      return next(Api)
    }
    const newUser = await db.query('INSERT INTO users (name, email, password, status) values ($1, $2, $3, $4) RETURNING *', [name, email, password, status])
    res.json(newUser.rows[0])
  }

  async getUsers(req, res) {
    const users = await db.query('SELECT * FROM users')
    res.json(users.rows)
  }

  async getOneUser(req, res) {
    const id = req.params.id
    const user = await db.query('SELECT * FROM users where id = $1', [id])
    res.json(user.rows[0])
  }

  async updateUserStatus(req, res) {
    const {users, status} = req.body
    const user = await db.query(`UPDATE users set status = $1 where id in (${users.map(user => user.id)}) RETURNING *`, [status])
    res.json(user.rows[0])
  }

  async deleteUser(req, res) {
    const {users} = req.body
    const user = await db.query(`DELETE FROM users where id in (${users.map(user => user.id)})`)
    res.json(user.rows[0])
  }
}

module.exports = new UserController()