const express = require('express');
const { getRoutineActivitiesByRoutine } = require('../db');
const routineActivitiesRouter = express.Router();
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async (req, res) => {
    console.log(req.params)
    const routineActivityId = req.params.routineActivityId
    // const routineActivityId = req.params.routineId
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    // Check for token
    if (!auth) {
        res.send({
            error: "AuthorizationError",
            message: "You must be logged in to perform this action",
            name: "Authorization"
        })
    } 
    else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try{
            const { id } = jwt.verify(token, JWT_SECRET)
            const potentiallyDeletedRoutine = await getRoutineActivitiesByRoutine(routineActivityId)
            console.log(potentiallyDeletedRoutine)
            if (id !== potentiallyDeletedRoutine.creatorId) {
                res.status(403).send({
                    error: "AuthorizationError",
                    message: `User Charlie is not allowed to delete In the afternoon`,
                    name: "403 Error"
                })
            } 
        } catch(error){
            console.error(error)
        }
    }
})
module.exports = routineActivitiesRouter;
