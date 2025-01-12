require("dotenv").config();

const process = require("process");
const express = require("express");
const axios = require("axios");
const pool = require("./db");

const app = express();

app.get("/test", async (req, res) => {
  res.status(200).json({msg: "Hello, World!"});
});
app.get("/db", async (req, res) => {
  const {user} = req.query;
  if (!user) {
    return res.status(400).json({error: "Missing user's id!"});
  }
  try {
    const query = `
            SELECT 
               *
            FROM 
                users
            WHERE 
                id = $1
             `;
    const values = [user];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching report:", err.message);
    res.status(500).json({error: "Internal server error"});
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port:", process.env.PORT);
});
