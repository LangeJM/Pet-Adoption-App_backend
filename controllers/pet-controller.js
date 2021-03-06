const Pet = require('../models/pet-model')

createPet = (req, res) => {
    const body = req.body;
    const file = req.file;
    console.log('body, file') // Delete!!!
    console.log(body, file)
    // console.log(file.location)

    if (!body && !file) {
        return res.status(400).json({
            success: false,
            error: "No pet information provided!"
        })
    }

    const pet = new Pet({
        name: req.body.name,
        status: req.body.status,
        type: req.body.type,
        breed: req.body.breed,
        height: req.body.height,
        weight: req.body.weight,
        color: req.body.color,
        hypoallergenic: req.body.hypoallergenic,
        dietaryRestrictions: req.body.dietaryRestrictions,
        fostered: req.body.fostered,
        savedBy: req.body.savedBy,
        // image: file,
        // imageName: file
        image: file.location,
        imageName: file.originalname
    })

    if (!pet) {
        return res.status(400).json({
            success: false,
            error: err
        })
    }

    pet
        .save()        
        .then(() => {
            return res.status(201).json({
                success: true,
                id: pet._id,
                message: "Pet created!"
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Pet not created!"
            })
        }) 
}

getPetsSample = async (req, res) => {
    await Pet.aggregate([{$sample: {size: 4}}], (err, pets) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        if (!pets.length) {
            return res
                .status(404)
                .json({
                    success: true,
                    data: pets
                })
        }
        return res.status(200).json({
            success: true,
            data: pets
        })
    }).catch(err => console.log(err))
} 

getPets = async (req, res) => {
    await Pet.find({}, (err, pets) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        if (!pets.length) {
            return res
                .status(404)
                .json({
                    success: true,
                    data: pets
                })
        }
        return res.status(200).json({
            success: true,
            data: pets
        })
    }).catch(err => console.log(err))
} 

getPetsBySearch = async (req, res) => {
    const query = req.query
    if (query) await Pet.find(query, (err, pets) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        if (!pets.length) {
            return res
                .status(404)
                .json({
                    success: false,
                    data: "There is no match for your search."
                })
        }
        return res.status(200).json({
            success: true,
            data: pets
        })
    }).catch(err => console.log(err))
}

updatePet = async (req, res) => {
    const body = req.body
    console.log("Coming through with updatePet: ", body)
    console.log("Coming through with updatePet: ", req.query)

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "No pet information provided",
        })
    }

    /* Below provides a more flexible solution to update one or several specific fields instead of the whole entry. 
    Inspired by https://stackoverflow.com/questions/30602057/how-to-update-some-but-not-all-fields-in-mongoose */
    Pet.findOneAndUpdate({ _id: req.query.id }, { $set: req.body }, { useFindAndModify: false }, (err, pet) => { 
        if (err) {
            return res.status(404).json({
                err,
                message: "Pet not found!",
            })
        }
        // when using switch/case instead, it will update the db but throw an error with message 'Pet not updated!' 
        if ('name' in req.body) pet.name = body.name
        if ('status' in req.body) pet.status = body.status
        if ('type' in req.body) pet.type = body.type
        if ('breed' in req.body) pet.breed = body.breed
        if ('height' in req.body) pet.height = body.height
        if ('weight' in req.body) pet.weight = body.weight
        if ('color' in req.body) pet.color = body.color
        if ('hypoallergenic' in req.body) pet.hypoallergenic = body.hypoallergenic
        if ('dietaryRestrictions' in req.body) pet.dietaryRestrictions = body.dietaryRestrictions
        if ('fosteredBy' in req.body) pet.fosteredBy = body.fosteredBy
        if ('savedBy' in req.body) pet.savedBy = body.savedBy //this is an array, so we might need to adjust to push etc..

        pet
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: pet._id,
                    message: "Pet updated!",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Pet not updated!",
                })
            })
    })
}

getPetById = async(req, res) => {
    await Pet.findOne({ _id: req.params.id }, (err, pet) => {
        if (err) {
            return res
                .status(400)
                .json({
                success: false,
                error: err
                })
        }

        if (!pet) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Pet not found"
                })
        }
        return res
            .status(200)
            .json({
                success: true,
                data:pet
            })
        
    }).catch(err => console.log(err))
}

getUserPets = async (req, res) => {
    // Inspired by discussion here https://stackoverflow.com/a/57637077/12754665
    await Pet.find({ '_id': { $in: req.body } }, (err, pet) => {
        console.log("REQ BODY USER PETS: ", req.body)
        if (err) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: err
                })
        }

        if (!pet) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Pet not found"
                })
        }
        return res
            .status(200)
            .json({
                success: true,
                data: pet
            })
        
    }).catch(err => console.log(err))
}




deletePet = async(req, res) => {
    await Pet.findOneAndDelete({ _id: req.params.id }, (err, pet) => {
        if (err) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: err
                })
        }
        if (!pet) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Pet not found"
                })
        }
        return res
            .status(200)
            .json({
                success: true,
                // message: `Pet with id ${req.params.id} deleted from database!`,
                data: pet
            })
    }).catch(err => console.log(err))
}

module.exports = {
    createPet,
    updatePet,
    getPetById,
    getPets,
    getPetsSample,
    getPetsBySearch,
    getUserPets,

    deletePet, // Not sure if to implement that or not 
}