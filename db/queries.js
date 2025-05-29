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
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  const user = rows[0];
  return user;
};

// signup

const insertUser = async (first_name, last_name, username, hashedPassword) => {
  await pool.query(
    "insert into users (first_name, last_name, username, password) values ($1, $2, $3, $4)",
    [first_name, last_name, username, hashedPassword]
  );
};

module.exports = {
  getUserByUsername,
  getUserById,
  insertUser,
};
