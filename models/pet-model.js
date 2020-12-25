const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pet = new Schema(
    {
        name: { type: String, required: true },
        status: { type: String, required: true }, // fostered, adopted, available
        type: { type: String, required: true }, // type in mongodb syntax will resolve to 'string' that is why we have to wrap the  
        breed: { type: String, required: true},
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        color: { type: String, required: true },
        hypoallergenic: { type: Boolean, required: true },
        dietaryRestrictions: { type: String, required: true },
        fosteredBy: { type: String, required:false },
        savedBy: { type: [String], required: false },
        image: { type: String, required: false },
        imageName: {type: String, required:false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('pets', Pet)