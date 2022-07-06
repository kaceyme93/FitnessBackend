const client = require('./client');
const {attachActivitiesToRoutines} = require('./activities')
const {destroyRoutineActivity} = require('./routine_activities')

async function getRoutineById(id){
  try {
    const { rows: [routine] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = ${id}
    `)

    return routine
  } catch(error) {
    console.error("ERROR GETTING ROUTINE BY ID")
    throw error
  }
}

async function getRoutinesWithoutActivities(){
  try {

    const { rows: routineWoActivity } = await client.query(`
    SELECT *
    FROM routines
    `)

    return routineWoActivity
  } catch(error){
    console.error("ERROR GETTING ROUTINE")
  }
}

async function getAllRoutines() {
  try {
    const {rows: routines } = await client.query(`
    SELECT
    routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id;
    `)

    await attachActivitiesToRoutines(routines)
    return routines
  } catch(error){
    console.error("ERROR GETTING ALL ROUTINES")
    throw error
  }

}

async function getAllRoutinesByUser({username}) {
  const routines = await getAllRoutines()

  for (let i = 0; i < routines.length; i++) {
    const routineByUser = routines.filter(routine => routine.creatorName===username)
    return routineByUser
  }
}

async function getPublicRoutinesByUser({username}) {
 const routines = await getAllRoutines()

 for (let i = 0; i < routines.length; i++) {
  const pubRoutineByUser = routines.filter( routine => (routine.creatorName===username) && (routine.isPublic===true))
  return pubRoutineByUser
 }
}

async function getAllPublicRoutines() {
 const routines = await getAllRoutines()

 for (let i = 0; i < routines.length; i++) {
  const pubRoutines = routines.filter(pubRoutine => pubRoutine.isPublic === true)
  return pubRoutines
 }
}

async function getPublicRoutinesByActivity({id}) {
  try {
    const routines = await getAllRoutines();
    const publicRoutineByActivity = routines.filter(routine =>{
      if(routine.isPublic){
        for(let i = 0; i < routine.activities.length; i++){
          if(routine.activities[i].id === id){
            return routine
          }
        }
      }
    })
    return publicRoutineByActivity;
  } catch (error) {
    throw error;
  }
  }


async function createRoutine({creatorId, isPublic, name, goal}) {
  
  try {
    const { rows: [newRoutine] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `, [creatorId, isPublic, name, goal])

    return newRoutine
  } catch(error) {
    console.error("ERROR CREATING ROUTINE")
    throw error
  }
}

async function updateRoutine({id, ...fields}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index+1 }`
  ).join(', ')

  if (setString.length === 0) {
    return;
  }
  try {
      const { rows: [routine] } = await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id = ${id}
      RETURNING *
      `, Object.values(fields))
    return routine
  } catch(error){
    console.error("ERROR UPDATING ROUTINE")
    throw error
  }
}

async function destroyRoutine(id) {
  try {
    const { rows:[routine] } = await client.query(`
    DELETE 
    FROM routines
    WHERE id = ${id}
    RETURNING *
    `)
    console.log(routine)
    return routine
  } catch(error){
    console.error("ERROR DELETING ROUTINE")
    throw error
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}