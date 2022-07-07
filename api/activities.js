const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities } = require('../db/activities')
const { getPublicRoutinesByActivity } = require('../db/routines')

// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    // const id = req.params
    // const routines = await getPublicRoutinesByActivity(id)
    // console.log(routines)
    // res.send(
    //     routines
    // )
    try {
        const id = req.params
        const routines = await getPublicRoutinesByActivity(id)
        console.log(routines)
        res.send(
            routines
    )
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

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
