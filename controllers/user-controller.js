const User = require('../models/user-model')

createUser = (req, res) => { //Maybe rename to signupUser?
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No user information provided',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({
            success: false,
            error: err
        })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
}

updateUser = async (req, res) => {
    const body = req.body
    
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No user information provided',
        })
    }

    /* Below provides a more flexible solution to update one or several specific fields instead of the whole entry. 
    Inspired by https://stackoverflow.com/questions/30602057/how-to-update-some-but-not-all-fields-in-mongoose */
    User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { useFindAndModify: false }, (err, user) => { 
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
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
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

loginUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No user information provided',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        if (user.email === body.email && user.password === body.password) {
            return res.status(200).json({
                success: true,
                id: user._id,
                message: 'User authenticated!',
            })
        }
    })
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
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
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: [user.savedPets, user.fosteredPets] })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

module.exports = {
    createUser,
    updateUser,
    loginUser,
    getUserById,
    getUserPetsById,
    getUsers,
}