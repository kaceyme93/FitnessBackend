/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const {createUser, getUserByUsername} = require('../db/users')
// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body

})
// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const {username, password} = req.body
    const _user = await getUserByUsername(username)
    try {
        if (_user) {
            next({
                name: "UserExistsError",
                message: "Username already exists"
            })
        }
        if (!username || !password) {
            next({
                name: "MissingCredentialsError",
                message: "Please supply username and password"
            })
        }

        if (password.length < 8) {
            next({
                name: "PasswordLengthError",
                message: "Password must be at least 8 characters"
            })
        }

        const user = await createUser(username, password)
        res.send(user)
    } catch({ name, message}) {
        next({ name, message})
    }
})
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
