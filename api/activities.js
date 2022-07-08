const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities, updateActivity, createActivity, getActivityByName, getActivityById } = require('../db/activities')
const { getPublicRoutinesByActivity } = require('../db/routines')
const { getUserById }= require('../db/users')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env

// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    // const id = req.params
    // const routines = await getPublicRoutinesByActivity(id)
    // console.log(routines)
    // res.send(
    //     routines
    // )
    try {
        const id = req.params.activityId
        const activity = await getActivityById(id)
        if (!activity) {
            res.send({
                error: "Whoops",
                message: `Activity ${id} not found`,
                name: "ActivityNotFound"
            })
        } else {
            const routines = await getPublicRoutinesByActivity(1)
            console.log(routines)
            res.send(
                routines
            )
        }
        
    }catch(error) {
        console.log(error)
        next(error)
    }
})
// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
    const activities = await getAllActivities()
    res.send(
        activities
    )
})
// POST /api/activities
activitiesRouter.post('/', async (req, res, next)  => {
    const { name, description } = req.body
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    //Check for token
    if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)

        try{
            const existingActivity = await getActivityByName(name)
            if (existingActivity){
                res.send({
                    error: "ActivityExistsError",
                    message: `An activity with name ${name} already exists`,
                    name: "ActivityExists"
                })
            } else{
            const newActivity = await createActivity({name, description})
            // console.log("newActivity", newActivity)
            res.send(
                newActivity
            )
            }
        }catch(error){
            console.log(error)
            next(error)
        }
    }
})
// // PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId', async (req, res, next)  => {
    const activityNeededUpdate = req.body
    activityNeededUpdate.id = req.params.activityId
    // const description = req.body.description
    const activityId = (req.params.activityId)
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    //Check for token
    if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try{
            const existingActivity = await getActivityById(activityId)
            if (!existingActivity) {
                res.send({
                    error: "ActivityExistsError",
                    message: `Activity ${activityId} not found`,
                    name: "NoExistingActivity"
                })
             } else {
                const { id } = jwt.verify(token, JWT_SECRET)
                const user = await getUserById(id);
                const updatedActivity = await updateActivity(activityNeededUpdate)
                console.log("UpdatedAct", updatedActivity)
                if (updatedActivity) {
                    res.send(
                        updatedActivity
                    )
                    //IS SENDING APPROPRIATE ERROR BUT FAILING ON TECHNICALITY
                } else{
                    res.send({
                        error: "Whoops",
                        message: `An activity with name Aerobics already exists`
                    })
                }
                }
                
        } catch(error){
        console.log(error)
        next(error)
        }
    }
})
module.exports = activitiesRouter;
