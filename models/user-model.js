const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
        lastName: { type: String, required: true, minlength: 3, maxlength: 50 },
        type: { type: String, required: true }, // type in mongodb syntax will resolve to 'string' that is why we have to wrap the  
        email: { type: String, required: true, match: /\S+@\S+\.\S+/, minlength: 5, maxlength: 255, unique: true },
        password: { type: String, required: true, minlength: 3, maxlength: 255 },
        phone: { type: String, required: true },
        bio: { type: String, required: false },
        savedPets: { type: [String], required: false },
        fosteredPets: { type: [String], required: false },
        isAdmin: Boolean
    },
    { timestamps: true },
);

const User = mongoose.model('User', UserSchema)

exports.User = User;
