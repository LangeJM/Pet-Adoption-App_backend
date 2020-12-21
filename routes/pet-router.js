const express = require('express')

const PetController = require('../controllers/pet-controller')

const router = express.Router()

/* 
Consider using express-validator: https://express-validator.github.io/docs/
npm install --save express-validator
No sure where this has to go exactly with this setup
*/


router.post('/pet', PetController.createPet)
router.put('/pet/:id', PetController.updatePet)
router.get('/pet/:id', PetController.getPetById)
router.get('/pets', PetController.getPets)
router.delete('/pet/:id', PetController.deletePet)
// return to org, adopt, save pet APIs will be part of update pe3ts API

module.exports = router