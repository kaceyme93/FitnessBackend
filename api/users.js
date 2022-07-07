/* eslint-disable no-unused-vars */
const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByUsername, getUserById } = require('../db/users')
const {getAllRoutinesByUser, getPublicRoutinesByUser} = require('../db/routines')
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
        } else {
            res.send({
                message: "Incorrect username and/or password.",
                name: "CredentialsError"
            })
        }
    } catch({ name, message}) {
        next({ name, message})
    }
})

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
usersRouter.get('/me', async(req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

  if (!auth) {
    res.status(401).send({
        error: "AuthorizationError",
        message: "You must be logged in to perform this action",
        name: "401 Error"
    })
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        const user = await getUserById(id);
        res.send({
            id: user.id,
            username: user.username
        })
      }
    } catch ({ name, message }) {
      res.send({
        error: 401
      });
    }
  } 
})
// GET /api/users/:username/routines
usersRouter.get('/:username/routines', async (req, res, next) => {
    const publicRoutines = await getPublicRoutinesByUser(req.params)
    const routines = await getAllRoutinesByUser(req.params)
    res.send(
        publicRoutines
    )
})
module.exports = usersRouter;
