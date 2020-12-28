const auth = require("../auth/auth");

const express = require('express')

const UserController = require('../controllers/user-controller')

const router = express.Router()

router.post('/user', UserController.createUser)
router.put('/user/:id', UserController.updateUser)
router.post('/login', UserController.loginUser)
router.get('/user/:id', UserController.getUserById)
router.get('/user/pets/:id', UserController.getUserPetsById)
router.get('/users', UserController.getUsers)
router.get('/currentUser', auth, UserController.currentUser)

module.exports = router
