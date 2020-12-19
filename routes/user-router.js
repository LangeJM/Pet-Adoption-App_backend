const express = require('express')

const UserController = require('../controllers/user-controller')

const router = express.Router()

router.post('/user', UserController.createUser)
router.put('/user/:id', UserController.updateUser)
router.get('/login/:id', UserController.loginUser)
router.get('/user/:id', UserController.getUserById)
router.get('/user/pets/:id', UserController.getUserPetsById)
router.get('/users', UserController.getUsers)

module.exports = router
