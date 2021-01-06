const express = require('express')

const UserController = require('../controllers/user-controller')

const router = express.Router()

router.post('/user', UserController.createUser)
router.post('/login', UserController.loginUser)
router.post('/currentUser', UserController.currentUser)
router.put('/userUpdate', UserController.updateUser)
router.post('/userPetsUpdate', UserController.updateUserPets)

router.get('/user/:id', UserController.getUserById)
router.get('/user/pets/:id', UserController.getUserPetsById)
router.get('/users', UserController.getUsers)

module.exports = router
