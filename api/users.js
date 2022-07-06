/* eslint-disable no-unused-vars */
const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require('../db/users')
// POST /api/users/login Adding some stuff
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body

})
// POST /api/users/register
// usersRouter.get('/', async (req, res, next) => {
//     res.send({message: "Success"})
// })
usersRouter.post('/register', async (req, res, next) => {
    // try{
    //     console.log(req.body)
    // }catch(error){
    //     next(error)
    // }
    const {username, password} = req.body
    
    try {
        const _user = await getUserByUsername(username)
        // if (_user) {
        //     next({
        //         name: "UserExistsError",
        //         message: "Username already exists"
        //     })
        // }
        // if (!username || !password) {
        //     next({
        //         name: "MissingCredentialsError",
        //         message: "Please supply username and password"
        //     })
        // }

        // if (password.length < 8) {
        //     next({
        //         name: "PasswordLengthError",
        //         message: "Password must be at least 8 characters"
        //     })
        // }

        const user = await createUser(username, password)
        console.log("USER IS", user)
        res.send(res.send(
            {
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
