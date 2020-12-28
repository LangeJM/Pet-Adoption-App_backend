const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
        lastName: { type: String, required: true, minlength: 3, maxlength: 50 },
        type: { type: String, required: true }, // type in mongodb syntax will resolve to 'string' that is why we have to wrap the  
        email: { type: String, required: true, match: /\S+@\S+\.\S+/, minlength: 5, maxlength: 255, unique: true },
        password: { type: String, required: true, minlength: 3, maxlength: 255 },
        phone: { type: String, required: true },
        savedPets: { type: [String], required: false },
        fosteredPets: { type: [String], required: false },
        isAdmin: Boolean
    },
    { timestamps: true },
);

UserSchema.methods.generateAuthToken = function () { 
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
    return token;
}

const User = mongoose.model('User', UserSchema)

//function to validate user, currently does not work. Compare with user-controller.js

// const validateUser = (user) => {
//     const schema = Joi.object({
//         firstName: Joi.string().min(3).max(50).required(),
//         lastName: Joi.string().min(3).max(50).required(),
//         type: Joi.string().required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(3).max(255).required(),
//         passwordControl: Joi.string().min(3).max(255).required(),
//         phone: Joi.number().required(),
//         passwordTooltip: Joi.boolean(),
//         buttonDisabled: Joi.boolean()

//     });
//     const validation = schema.validate(user);
//     return validation
// }

exports.User = User;
// exports.validate = validateUser;