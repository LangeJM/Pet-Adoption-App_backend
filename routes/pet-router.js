const express = require('express')

const PetController = require('../controllers/pet-controller')

const router = express.Router()

router.post('/pet', PetController.createPet)
router.put('/pet/:id', PetController.updatePet)
router.get('/pet/:id', PetController.getPetById)
router.get('/pets', PetController.getPets)
router.delete('/pets/:id', PetController.deletePet)
// return to org, adopt, save pet APIs will be part of update pe3ts API

module.exports = router