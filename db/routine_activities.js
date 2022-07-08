const client = require('./client')

async function getRoutineActivityById(id){
  try{
    const { rows: [routineActivity] } = await client.query(`
    SELECT *
    FROM routineactivities
    WHERE id = ($1)
    `, [id])
    return routineActivity
  } catch(error) {
    console.error("ERROR GETTING ROUTINEACTIVITY BY ID")
    throw(error)
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
      const { rows } = await client.query(`
      INSERT INTO routineactivities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `, [routineId,activityId,count,duration])
    
      return rows[0]
    } catch(error) {
      console.error("ERROR ADDING ACTIVITY TO ROUTINE")
      throw error
    }
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routineactivities
    WHERE "routineId" = ($1)
    `, [id])

    return rows
  } catch(error){
    console.error("ERROR GETTING ROUTACT BY ROUTINEID")
    throw error
  }
}

async function updateRoutineActivity ({id, ...fields}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ')

  if (setString.length === 0) {
    return
  }
  try{
    const { rows: [routineActivity] } = await client.query(`
    UPDATE routineactivities
    SET ${ setString }
    WHERE "routineId"= ${id}
    RETURNING *
    `, Object.values(fields))

    return routineActivity
  } catch(error){
    console.error("ERROR UPDATING ROUTINEACTIVITY")
    throw(error)
  }
}

async function destroyRoutineActivity(id) {
  try {
    
    const {rows: [routine]} = await client.query(`
    DELETE 
    FROM routineactivities
    WHERE id = $1
    RETURNING *
    `, [id])


   return routine

  } catch(error){
    console.error("ERROR DELETING ROUTINEACTIVITY")
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const routineActivityInQuestion = await getRoutineActivityById(routineActivityId)
    const {creatorId} = await getRoutineById(routineActivityInQuestion.routineId)
    if(creatorId === userId){
      return true
    }else{
      return false
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
