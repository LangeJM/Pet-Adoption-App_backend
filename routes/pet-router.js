const express = require('express')
const router = express.Router()

const PetController = require('../controllers/pet-controller')
const upload = require('../upload/uploadPetImages')

router.post('/pet', upload.single('image'), PetController.createPet)
router.get('/petsSample', PetController.getPetsSample)
router.get('/pets', PetController.getPets)
router.get('/petsSearch', PetController.getPetsBySearch)
router.get('/pet/:id', PetController.getPetById)
router.put('/petUpdate', PetController.updatePet)
router.post('/userPets', PetController.getUserPets)

router.delete('/pet/:id', PetController.deletePet)

module.exports = router