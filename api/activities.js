const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities } = require('../db/activities')
const { getPublicRoutinesByActivity } = require('../db/routines')
const { getUserById }= require('../db/users')
const jwt = require('jsonwebtoken')
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
activitiesRouter.post('/', async (req, res, next)  => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    //Check for token
    if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)

        try{
            //jwt verify to get user id
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                const user = await getUserById(id);
                res.send({
                    id: user.id,
                    username: user.username
                })
                }

        }catch(error){
            console.log(error)
            next(error)
        }
    }
})
// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
