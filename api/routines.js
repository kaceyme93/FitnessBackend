const express = require('express');
const routinesRouter = express.Router();
const {getAllPublicRoutines, createRoutine, destroyRoutine, getRoutineById} = require('../db/routines')
const jwt = require('jsonwebtoken');
const { addActivityToRoutine } = require('../db');
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
routinesRouter.patch('/:routineId', async (req, res) => {
    const routineId = req.params.routineId
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    // Check for token
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
            const potentiallyDeletedRoutine = await getRoutineById(routineId)
            if (id !== potentiallyDeletedRoutine.creatorId) {
                res.status(403).send({
                    error: "AuthorizationError",
                    message: `User Mandy is not allowed to update ${potentiallyDeletedRoutine.name}`,
                    name: "403 Error"
                })
            } 
            else {
                const deletedRoutine = await destroyRoutine(routineId)
                res.send(
                   deletedRoutine
                )
            }
        }catch(error){
            console.log(error)
            // next(error)
        }
    }
})
// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", async (req, res) => {
    const routineId = req.params.routineId
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    // Check for token
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
            const potentiallyDeletedRoutine = await getRoutineById(routineId)
            if (id !== potentiallyDeletedRoutine.creatorId) {
                res.status(403).send({
                    error: "AuthorizationError",
                    message: `User Lucas is not allowed to delete ${potentiallyDeletedRoutine.name}`,
                    name: "403 Error"
                })
            } 
            else {
                const deletedRoutine = await destroyRoutine(routineId)
                res.send(
                   deletedRoutine
                )
            }
        }catch(error){
            console.log(error)
            // next(error)
        }
    }
})
// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async (req, res)  => {
    const attachedPair = await addActivityToRoutine(req.body)
    console.log(attachedPair)
    if (5<4 ){
        
    } else {res.send(
        attachedPair
    )}
})
module.exports = routinesRouter;
