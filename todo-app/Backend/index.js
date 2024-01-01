const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
});

app.get("/tasks", async (req, res) => {
  try {
    // Get the stored values
    let sql = "SELECT * FROM tasks";
    db.query(sql, (err, tasks) => {
      if (err) return res.json(err);
      return res.json(tasks);
    });
  } catch (error) {
    // Send the error message and status code 500
    res.status(500).send(error.message);
  }
});

app.post("/add", async (req, res) => {
  try {
    const sql = "INSERT INTO tasks (task_id, task_name) VALUES (?, ?)";

    // Generate a unique key for the task
    let key = Date.now().toString();
    let name = req.body.name;
    // Create a task object with the key and the name
    let task = [key, name];
    db.query(sql, task, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      // Send the inserted task details
      res.json({ id: key, name: name });
    });
  } catch (error) {
    // Send the error message and status code 500
    res.status(500).send(error.message);
  }
});

app.delete('/delete/:id', (req, res) => {
  const taskId = req.params.id;

  // Delete the task from the database
  db.query('DELETE FROM tasks WHERE task_id = ?', [taskId], (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    res.sendStatus(200);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Exiting...");
  await storage.clear();
  process.exit();
});
