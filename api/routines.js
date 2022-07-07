const express = require('express');
const routinesRouter = express.Router();
const {getAllPublicRoutines, createRoutine} = require('../db/routines')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
// GET /api/routines
routinesRouter.get('/', async (req, res, next) =>{
    const routines = await getAllPublicRoutines()

    res.send(
        routines
    )
})
// POST /api/routines
routinesRouter.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    //Check for token
    if (!auth) {
        res.send({
            error: "AuthorizationError",
            message: "You must be logged in to perform this action",
            name: "Authorization"
        })
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try{
            const { id } = jwt.verify(token, JWT_SECRET)
            if (id) {
                const newRoutine = await createRoutine({id, isPublic, name, goal})
                newRoutine.creatorId = id
                res.send(
                    newRoutine
                )
            }
        }catch(error){
            console.log(error)
            next(error)
        }
    }
})
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
