/* eslint-disable no-unused-vars */
const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require('../db/users')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const bcrypt = require('bcrypt')
const SALT = 10
// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.send({
            name: "MissingCredentialsError",
            message: "Username and password required."
        })
    }
    try {
        const hashPassword = await bcrypt.hashSync(password, SALT)
        const user = await getUserByUsername(username)
        //If there's a user and the password = password, call jwt.sign
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password)
            if (validPassword) {
                const token = jwt.sign({
                    id: user.id,
                    username: username
                }, JWT_SECRET)
            
                res.send({
                    user: user,
                     message: "you're logged in!",
                    token: token
                })
            }
        }
        // if(user && user.password == password) {
        //     const token = jwt.sign({
        //         id: user.id,
        //         username: username
        //     }, JWT_SECRET)

        //     res.send({
        //         message: "Successful Login.",
        //         token: token
        //     })
        // } 
        else {
            res.send({
                message: "Incorrect username and/or password.",
                name: "CredentialsError"
            })
        }
    } catch({ name, message}) {
        next({ name, message})
    }
})
// POST /api/users/register
// usersRouter.get('/', async (req, res, next) => {
//     res.send({message: "Success"})
// })
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body
    
    try {
        const _user = await getUserByUsername(username)
        if (_user) {
            res.send({
                error: "Username error",
                name: "UserExistsError",
                message: `User ${_user.username} is already taken.`
            })
        }
        if (!username || !password) {
            res.send({
                name: "MissingCredentialsError",
                message: "Please supply username and password"
            })
        }

        if (password.length < 8) {
            res.send({
                error: "Password Error",
                message: "Password Too Short!",
                name: "PasswordLengthError",
            })
        }

        const user = await createUser({username, password})
        const token = jwt.sign({
            id: user.id,
            username
          }, JWT_SECRET)
        
        res.send(res.send(
            {
            token: token,
            user : user,
            message: `Thank you for registering ${username}`
            }
        ))
    } catch({ name, message}) {
        next({ name, message})
    }
})
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
