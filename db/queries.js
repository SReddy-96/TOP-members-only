const pool = require("./pool");

// get user by username
const getUserByUsername = async (username) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = rows[0];
  return user;
};

// get user by id
const getUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
  const user = rows[0];
  return user;
};

// signup

const insertUser = async (first_name, last_name, username, hashedPassword) => {
  const newUser = await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [first_name, last_name, username, hashedPassword]
  );
  return newUser.rows[0];
};

// club
const toggleClub = async (id) => {
  const results = await pool.query(
    "UPDATE users SET premium_member = true WHERE id = $1",
    [id]
  );
  return results.rows[0];
};

// message
const insertMessage = async (message, user) => {
  await pool.query("INSERT INTO messages (message, user_id) VALUES ($1, $2);", [
    message,
    user.id,
  ]);
};

const getAllMessages = async () => {
  const result = await pool.query(`
    SELECT messages.*, users.username
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.date DESC
  `);
  return result.rows;
};

const deleteMessage = async (id) => {
  await pool.query("DELETE FROM messages WHERE id=$1", [id]);
};

// admin
const toggleAdmin = async (id) => {
  const results = await pool.query(
    "UPDATE users SET admin = true WHERE id = $1",
    [id]
  );
  return results.rows[0];
};

module.exports = {
  getUserByUsername,
  getUserById,
  insertUser,
  toggleClub,
  insertMessage,
  getAllMessages,
  deleteMessage,
  toggleAdmin,
};
