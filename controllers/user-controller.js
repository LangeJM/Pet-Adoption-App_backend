const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models/user-model');
const { Session } = require('../models/session-model');

createUser = async (req, res) => { 
    const body = await req.body;

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
      
    await user.save(async function (err, user) {
        if (err) return res.status(400).json({
                err,
                message: "Something didn't work. Please try again later!"
            });
        const session = new Session()
        const sessionId = uuidv4();
        session._id = sessionId;
        session.userId = user._id
    
        await session.save((err, session) => {
            if (err) return res.status(400).json({
                err,
                message: "Something didn't work. Please try again later!"
            });
            return res.status(202).send({
                sessionId: session._id,
                name: `${user.firstName} ${user.lastName}`,
                // email: user.email,
            });
        });
    });
}

loginUser = async (req, res) => {
    const body = await req.body;

    if (!body || body === false || body === '') {
        return res.status(401).json({
            success: false,
            error: "No login information provided.",
        })
    }

    await User.findOne({ "email": body.email }, async (err, user) => {
                
        if (!user) {
            return res.status(404).json({
                success: false,
                error: `This email address is not registered. \n\nPlease try again with a different email address or sign up with a new account.`,
            })
        }
        
        await bcrypt.compare(body.password, user.password, async (err, result) => {
            if (result) {
                const session = new Session()
                const sessionId = uuidv4();
                session._id = sessionId;
                // session.userId = mongoose.Types.ObjectId(user._id)
                session.userId = user._id

                await session.save((err, session) => {
                    if (err) {
                        return res.status(400)
                            .json({
                                err,
                                message: "Something didn't work. Please try again later!"
                            });
                    }
                    return res.status(202).json({
                        sessionId: session._id,
                        name: `${user.firstName} ${user.lastName}`,
                    })
                })
            }
            else return res.status(401).json({
                success: false,
                error: 'Password incorrect. Please try again!',
            })
        })
            
    })
}

currentUser = async (req, res) => {
    const body = await req.body
    try {
        const session = await Session.findById(body.sessionId)
        const user = await User.findById(session.userId)
        if (user) {
            res.send(user)
        } else {
            res.status(500).json({
                success: false,
                err: 'Something went wrong while attempting to log you in. Please try again later!',
            })
        }   
    } catch (err) {
        res.status(440).json({
            success: false,
            message: "Your session has expired. Please log in again." 
        })
    }
     
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
    User.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { useFindAndModify: false }, (err, user) => { 
        if (err) {
            return res.status(404).json({
                err,
                message: "User not found!",
            })
        }
        // when using switch/case instead, it will update the db but throw an error with message 'User not updated!' 
        if ('firstName' in req.body) user.firstName = body.firstName
        if ('lastName' in req.body) user.lastName = body.lastName
        if ('email' in req.body) user.email = body.email
        if ('password' in req.body) user.password = body.password
        if ('phone' in req.body) user.phone = body.phone
        if ('bio' in req.body) user.bio = body.bio
        if ('savedPets' in req.body) user.savedPets = body.savedPets
        if ('fosteredPets' in req.body) user.fosteredPets = body.fosteredPets

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

updateUserPets = async (req, res) => {
    const body = req.body
    console.log(body)

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "No user information provided",
        })
    }
    let keyVar;
    if ('savedPets' in req.body) keyVar = "savedPets"
    if ('fosteredPets' in req.body) keyVar = "fosteredPets"
    console.log(keyVar)
    
    /* Below provides a more flexible solution to update one or several specific fields instead of the whole entry.
    Inspired by https://stackoverflow.com/questions/30602057/how-to-update-some-but-not-all-fields-in-mongoose */
    User.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, {new: true}, (err, user) => { 
        if (err) {
            return res.status(404).json({
                err,
                message: "User not found!",
            })
        }
        console.log(user)
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
    updateUserPets,
    loginUser,
    getUserById,
    getUserPetsById,
    getUsers,
    currentUser
}