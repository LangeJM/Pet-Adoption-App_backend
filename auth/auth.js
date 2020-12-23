const jwt = require('jsonwebtoken')
const { id } = require('../db/db')

const secretTokenKey = 'd98435603469834069' //mock secretTokenKey

const createToken = (id) => {
    return jwt.sign({id}, secretTokenKey)
}

