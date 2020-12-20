
const Pet = require('../models/pet-model') 

createPet = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No pet information provided!"
        })
    }

    const pet = new Pet(body)

    if (!pet) {
        return res.status(400).json({
            success: false,
            error: err
        })
    }
}