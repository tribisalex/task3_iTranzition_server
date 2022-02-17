const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
// router.post('/user', userController.createUser)
router.get('/users', authMiddleware, userController.getUsers)
router.get('/user/:id', userController.getOneUser)
router.put('/status', authMiddleware, userController.updateUserStatus)
router.delete('/user', authMiddleware, userController.deleteUser)

module.exports = router