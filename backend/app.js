import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { neon } from "@neondatabase/serverless";

dotenv.config();
// const sql = neon(process.env.DATABASE_URL);


// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "minor",
//     password: process.env.dbpass,
//     port: 5432,
// });
// db.connect()
//     .then(() => console.log("Connected to database"))
//     .catch(err => console.error("Database connection error", err.stack));

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect()
    .then(() => console.log("Connected to Neon DB"))
    .catch(err => console.error("Neon DB connection error", err.stack));

const app = express();
const port =process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '<YOUR_GEMINI_API_KEY_HERE>';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';

// Nutrition Macros Endpoint
app.post('/api/gemini/macros', async (req, res) => {
  try {
    const { prompt } = req.body;
    const body = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await fetch(GEMINI_BASE_URL + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini macros error', details: err.message });
  }
});

// Food Recognition from Image Endpoint
app.post('/api/gemini/food-image', async (req, res) => {
  try {
    const { imageBase64, imagePrompt } = req.body;
    const body = {
      contents: [
        {
          parts: [
            { text: imagePrompt },
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
          ]
        }
      ]
    };
    const response = await fetch(GEMINI_BASE_URL + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini food image error', details: err.message });
  }
});

// Fetch all data from init table
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM init");
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/food-diary/:userId", async (req, res) => {
    const userId = req.params.userId;

    const query = `SELECT * FROM userInfo WHERE id = $1 AND date::date = CURRENT_DATE ORDER BY date DESC`;

    try {
        const result = await db.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Database error");
    }
});

app.get("/macros/:userId", async (req, res) => {
    const userId = req.params.userId;

    const query = `
    SELECT SUM(calories) AS total_cals, 
           SUM(protein) AS total_protein, 
           SUM(carbs) AS total_carbs 
    FROM userInfo
    WHERE id = $1
      AND date::date = CURRENT_DATE;
`;
    try {
        const result = await db.query(query, [userId]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Database error");
    }
});


// Add a new user food entry
app.post("/add", async (req, res) => {
    try {
        const { userId, name, dateTime, foodItem, cals, protein, carbs } = req.body;
        const query = `INSERT INTO userInfo (id, name, date, food_item, calories, protein, carbs) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        await db.query(query, [userId, name, dateTime, foodItem, cals, protein, carbs]);
        res.json({ message: "Data added successfully!" });
    } catch (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch today's entries for a specific user
app.get("/today", async (req, res) => {
    try {
        const { userId, date } = req.query;
        const query = "SELECT * FROM userInfo WHERE id = $1 AND date::date = $2";
        const result = await db.query(query, [userId, date]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch all food entries for a specific user
app.get("/all", async (req, res) => {
    try {
        const { userId } = req.query;
        const query = "SELECT * FROM userInfo WHERE id = $1";
        const result = await db.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/userdata", async (req, res) => {
    try {
        const { userId } = req.query;
        const query = "SELECT * FROM users WHERE id = $1";
        const result = await db.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query", err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/user/:userId/targetCalories", async (req, res) => {
    const { userId } = req.params;
    const { targetCalories } = req.body;
  
    if (!targetCalories) {
      return res.status(400).json({ error: "Target calories required" });
    }
  
    try {
        // 1. Add column if not exists (no parameters here)
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS targetcalories INTEGER;
          `);
          
          // 2. Then update the value
          await db.query(
            `UPDATE users 
             SET targetcalories = $1 
             WHERE id = $2`,
            [targetCalories, userId]
          );
      res.json({ message: "Target calories updated successfully" });
    } catch (error) {
      console.error("Error updating target calories", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  app.post("/adduser", async (req,res) => {
    const username=req.body.name;
    // const userId=req.body.userId;
    console.log(username + " and " );
    try{
        await db.query(
            'INSERT INTO users(name) VALUES($1);',
            [username]
          );
        console.log("added user")
        res.status(200).send("user added")
    }catch(err){
        console.log("unable to add user", err)
        res.json({error:err});
    }
  })

  app.get("/users",async (req,res) => {
    let userlist=await db.query(`SELECT id,name FROM users;`);
    res.json(userlist.rows);
  })


  app.post("/changeinfo", async (req, res) => {
    console.log("info here");
    const { userId } = req.query;
    const details = req.body.data;
    console.log(typeof(userId));
    console.log(details);
  
    if (!details) {
      return res.status(400).json({ error: "Data not given" });
    }
    console.log(typeof(details))
    try {
      for (let column in details) {
        const value = details[column];
        console.log(value + " " + column);
        // 1. Add column if it doesn't exist
        const alterQuery = `
          ALTER TABLE users 
          ADD COLUMN IF NOT EXISTS "${column}" TEXT;
        `;
        await db.query(alterQuery);
  
        // 2. Update user's value
        const updateQuery = `
          UPDATE users 
          SET "${column}" = $1 
          WHERE id = $2;
        `;
        await db.query(updateQuery, [value, userId]);

        //3. Update to health_data history table
        const query=`INSERT INTO health_data (user_id, name, date, parameter, value)
                      VALUES($1, 'default', NOW(), $2, $3)`;
        console.log(query, [userId, column, parseInt(value)]);
        await db.query(query, [userId, column, parseInt(value)])
      }
  
      res.json({ message: "Details updated successfully" });
    } catch (error) {
      console.error("Error updating target calories", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  


  app.post("/bot/chat", async (req, res) => {

    const { userId, message, isBot } = req.body;
//   console.log(req.body);
    if (!userId || !message) {
        console.log("miss here")
      return res.status(400).json({ error: "Missing required fields" });
    }
    console.log("here");
    try {
      await db.query(
        "INSERT INTO chatHistory (user_id, message, is_bot) VALUES ($1, $2, $3)",
        [userId, message, isBot || false]
      );
      console.log("added chat");
      res.json({ message: "Chat entry added" });
    } catch (err) {
      console.error("Error inserting chat", err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  

  app.get("/bot/getchat/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await db.query(
        "SELECT * FROM chatHistory WHERE user_id = $1 ORDER BY timestamp ASC",
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching chat", err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  app.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
      const ollamaRes = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mybiom",
          messages: [{ role: "user", content: message }],
          stream: true,
        }),
      });
  
      // Set headers for streaming response to frontend
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
  
      const decoder = new TextDecoder();
      const reader = ollamaRes.body.getReader();
  
      while (true) {

        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        
        // console.log("chunk is: ",chunk)
        res.write(chunk);
      }
  
      res.end();
    } catch (err) {
      console.error("Ollama API error:", err);
      res.status(500).json({ error: "Failed to connect to Ollama" });
    }
  });
  

app.get("/api/graphdata/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows: entries } = await db.query(
      `
      SELECT 
        food_item,
        calories::FLOAT,
        protein::FLOAT,
        carbs::FLOAT,
        date 
      FROM userInfo
      WHERE id = $1 
        AND date >= CURRENT_DATE - INTERVAL '100 days'
      ORDER BY date ASC
      `,
      [userId]
    );

    const dayMap = {};
    const foodCount = {};

    for (let entry of entries) {
      const date = entry.date.toISOString().split("T")[0]; // to group by date

      // For line charts (group by day)
      if (!dayMap[date]) {
        dayMap[date] = { calories: 0, protein: 0, carbs: 0 };
      }
      dayMap[date].calories += entry.calories || 0;
      dayMap[date].protein += entry.protein || 0;
      dayMap[date].carbs += entry.carbs || 0;

      // For pie chart (food item proportion)
      if (!foodCount[entry.food_item]) {
        foodCount[entry.food_item] = 0;
      }
      foodCount[entry.food_item] += entry.calories || 0;
    }
 
    // Format data for frontend graphs
    const graphData = { 
      lineData: Object.entries(dayMap).map(([date, values]) => ({
        date, 
        ...values,
      })),
      pieData: Object.entries(foodCount).map(([food_item, count]) => ({
        name: food_item,
        value: count,
      })),
    };

    res.json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/healthgraphdata/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      "SELECT parameter, date, value FROM health_data WHERE user_id = $1 ORDER BY date ASC",
      [userId]
    );
    const parameters = new Set();
    const data = {};

    result.rows.forEach((row) => {
      const param = row.parameter.toLowerCase();
      parameters.add(param);

      if (!data[param]) {
        data[param] = [];
      }

      data[param].push({
        date: row.date.toISOString(), // Format: YYYY-MM-DD
        value: Number(row.value),
      });
    });
    res.json({
      parameters: Array.from(parameters),
      data,
    });
  } catch (err) {
    console.error("Error fetching health data:", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
