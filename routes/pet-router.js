const express = require('express')
const router = express.Router()

const PetController = require('../controllers/pet-controller')
const upload = require('../upload/uploadPetImages')


/* 
Consider using express-validator: https://express-validator.github.io/docs/
npm install --save express-validator
No sure where this has to go exactly with this setup
*/

router.post('/pet', upload.single('image'), PetController.createPet)
router.get('/petsSample', PetController.getPetsSample)
router.get('/pets', PetController.getPets)
router.get('/petsSearch', PetController.getPetsBySearch)


router.put('/pet/:id', PetController.updatePet)
router.get('/pet/:id', PetController.getPetById)
router.delete('/pet/:id', PetController.deletePet)

// return to org, adopt, save pet APIs will be part of update pe3ts API

module.exports = router