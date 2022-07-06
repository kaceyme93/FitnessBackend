const client = require("./client");
const bcrypt = require("bcrypt")
// database functions
const SALT = 10
// user functions
async function createUser({ username, password }) {
  const hashPassword = bcrypt.hashSync(password, SALT)
  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, hashPassword])

    delete user.password
    return user
  } catch(error) {
    console.error("ERROR CREATING USER")
    throw error;
  }
}

async function getUser({ username, password }) {

  try {
    const user = await getUserByUsername(username)
    if (!user) return
    const hashPassword = user.password
    const passwordsMatch = bcrypt.compareSync(password, hashPassword)
    if (!passwordsMatch) return
    delete user.password
    return user
  } catch(error) {
    console.error("ERROR GETTING USER")
    throw error
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT*
    FROM users
    WHERE id = ${userId};
    `)

    delete user.password
    return user
  } catch(error){
    console.error("ERROR GETTING USER BY ID")
    throw error
  }

}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE username=$1;
    `, [userName])

    return user
  } catch(error) {
    console.error("ERROR GETTING USER BY USERNAME")
    throw error
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
