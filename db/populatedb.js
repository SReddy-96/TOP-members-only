#! /usr/bin/env node

require("dotenv").config();
const { Client } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

async function main(dbUrl) {
  console.log("🌱 Checking database...");
  const client = new Client({
    connectionString: dbUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();

    // Check if tables exist
    const tableCheck = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;

    const { rows } = await client.query(tableCheck);

    if (rows[0].exists) {
      // Only check for data if tables exist
      const countCheck = await client.query("SELECT COUNT(*) FROM users");
      if (countCheck.rows[0].count > 0) {
        console.log("✅ Database already populated, skipping seed");
        return;
      }
    }

    // If tables don't exist or are empty, run the seed
    const SQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  member_status VARCHAR(255) NOT NULL,
  admin BOOLEAN DEFAULT FALSE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

    await client.query(SQL);
    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    throw err;
  } finally {
    await client.end();
  }
}

const dbUrl = process.argv[2];
if (!dbUrl) {
  console.error("Please provide a database URL");
  process.exit(1);
}

main(dbUrl).catch((err) => {
  console.error(err);
  process.exit(1);
});
