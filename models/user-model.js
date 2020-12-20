const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        type: { type: String, required: true }, // type in mongodb syntax will resolve to 'string' that is why we have to wrap the  
        email: { type: String, required: true, match: /\S+@\S+\.\S+/ },
        password: { type: String, required: true},
        phone: { type: Number},
        savedPets: { type: [String], required: false },
        fosteredPets: { type: [String], required: false },
    },
    { timestamps: true },
)


module.exports = mongoose.model('users', User)