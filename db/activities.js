const client = require("./client")

// database functions
async function getAllActivities() {

  try {
    const { rows: activities } = await client.query(`
    SELECT *
    FROM activities
    `)
    return activities
  } catch(error) {
    console.error("ERROR GETTING ACTIVITIES")
    throw error
  }
}

async function getActivityById(id) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id =($1)
    `, [id])

    return routine
  } catch(error) {
    console.error("ERROR GETTING ACTIVITY BY ID")
    throw error
  }
  
}

async function getActivityByName(name) {
  try {
    const { rows: [routine]} = await client.query(`
    SELECT *
    FROM activities
    WHERE name =($1);
    `, [name])

    return routine
  } catch(error) {
    console.error("ERROR GETING ACTIVITY BY NAME")
    throw error
  }
}

async function attachActivitiesToRoutines(routines) {
  // console.log("ROUTINES ARE", routines)
  try {
    const { rows } = await client.query(`
    SELECT 
    activities.*,
    routineactivities.count,
    routineactivities.duration,
    routineactivities."routineId",
    routineactivities.id AS "routineActivityId"
    FROM activities
    JOIN routineactivities ON activities.id = "activityId";
    `)
    
    for (let i = 0; i < routines.length; i++) {
      const routineWActivity = rows.filter(row => row.routineId ===routines[i].id)
      routines[i].activities=routineWActivity
      // console.log(routines)
      // console.log(routines[i].activities)
    }
    
    // console.log(routines)
    return routines
  } catch(error) {
    console.log("ERROR ATTACHING ACTIVITY TO ROUTINE")
    throw error
    }
  }


// select and return an array of all activities
async function createActivity({ name, description }) {

  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `, [name, description])

    return activity
  }catch(error) {
    console.error("ERROR CREATING ACTIVITY")
    throw error
  }
}

// return the new activity
async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key}"=$${ index + 1 }`
  ).join(', ')

  if (!setString.length) return

  try {
    const { rows: [upActivity] } = await client.query(`
    UPDATE activities
    SET ${ setString}
    WHERE id =${ id }
    RETURNING *;
    `, Object.values(fields))

    return upActivity
  } catch(error){
    console.error("ERROR UPDATING ACTIVITY")
    throw error
  }
}

// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
