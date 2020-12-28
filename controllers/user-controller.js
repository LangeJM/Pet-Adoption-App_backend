// const auth = require("../auth/auth");
const bcrypt = require("bcrypt");
const { User, validate } = require('../models/user-model');

createUser = async (req, res) => { 
    const body = await req.body;
    console.log(body)
// Returns a validate is not a function from Joi. There is currently a problem with this...Compare with user-model.js
    // const error = await validate(body);
    // if (error) {
    //     console.log('WHOOOOOO', error)
    //     return res.status(400).json({
    //         success: false,
    //         // error: error.details[0].message
    //         error: error
    //     })
    // }

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No user information provided",
        })
    }

    const emailExists = await User.findOne({ email: body.email });
    if (emailExists) {
        return res.status(400).json({
            success: false,
            error: 'An account with this email address already exists. \nPlease choose a different email address or try to log in instead.'
        })
    }

    const user = new User(body);
    
    user.password = await bcrypt.hash(user.password, 10)
      
    user //Need to resolve this block
        .save()
        .then(() => {
            const token = user.generateAuthToken();
            return res.status(202).header("x-auth-token", token).send({
                _id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            });
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "User not created!"
            })
        })
}

updateUser = async (req, res) => {
    const body = req.body

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "No user information provided",
        })
    }

    /* Below provides a more flexible solution to update one or several specific fields instead of the whole entry. 
    Inspired by https://stackoverflow.com/questions/30602057/how-to-update-some-but-not-all-fields-in-mongoose */
    User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { useFindAndModify: false }, (err, user) => { 
        if (err) {
            return res.status(404).json({
                err,
                message: "User not found!",
            })
        }
        // when using switch/case instead, it will update the db but throw an error with message 'User not updated!' 
        if ('firstName' in req.body) user.firstName = body.firstName
        if ('lastName' in req.body) user.lastName = body.lastName
        if ('type' in req.body) user.type = body.type
        if ('email' in req.body) user.email = body.email
        if ('password' in req.body) user.password = body.password
        if ('phone' in req.body) user.phone = body.phone

        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: "User updated!",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "User not updated!",
                })
            })
    })
}

currentUser = async (req, res) => {
    const user = await User.findById(req.user._id).isSelected("-password");
    res.send(user);
}

loginUser = async (req, res) => {
    const body = await req.body;
    console.log(body)
    console.log(body.email)

    if (!body || body === false || body === '') {
        return res.status(401).json({
            success: false,
            error: "No login information provided.",
        })
    }

    User.findOne({ "email": body.email }, (err, user) => {
                
        if (!user) {
            return res.status(404).json({
                success:false,
                error: `This email address is not registered. \n\nPlease try again with a different email address or sign up with a new account.`,
            })
        }
        
        bcrypt.compare(body.password, user.password)
            .then(function (result) {
                if (result) {
                    return res.status(200).json({
                        success: true,
                        name: `${user.firstName} ${user.lastName}`,
                        message: 'User authenticated!',
                    })
                } else return res.status(401).json({
                        success: false,
                        name: `${user.firstName} ${user.lastName}`,
                        message: 'Password incorrect. Please try again!',
                    })
            }).catch(err => console.log(err))
    })
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "User not found"
                })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserPetsById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" })
        }
        return res.status(200).json({ success: true, data: [user.savedPets, user.fosteredPets] })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "User not found"
                })
        }
        return res.status(200).json({
            success: true,
            data: users
        })
    }).catch(err => console.log(err))
}

module.exports = {
    createUser,
    updateUser,
    loginUser,
    getUserById,
    getUserPetsById,
    getUsers,
    currentUser
}