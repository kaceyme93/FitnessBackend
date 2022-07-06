/* eslint-disable no-unused-vars */
const express = require('express');
const apiRouter = express.Router();

// GET /api/health
apiRouter.get('/health', async (req, res, next) => {
    res.status(200).send("Health is goooood!!!")
});

// ROUTER: /api/users
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
apiRouter.use('/routine_activities', routineActivitiesRouter);

module.exports = apiRouter;