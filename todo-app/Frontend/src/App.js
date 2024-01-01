import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [data, setData] = useState([]);
  const [task, setTask] = useState("");
  const handleData = (e) => {
    // Use the setter function with the new value
    setTask(e.target.value);
  };
  useEffect(() => { 
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      // Destructure the data from the response
      const { data } = await axios.get("http://localhost:5000/tasks");
      // Set the data as state
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      // Send the task as an object with the name property
      await axios.post("http://localhost:5000/add", { name: task });
      // Clear the input field
      setTask("");
      // Fetch the updated tasks
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      getTasks(); // Fetch the updated tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className=" card-header">
          <h1 className=" card-title mb-0">ToDo List</h1>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              onChange={handleData}
              id="taskInput"
              placeholder="Add a new task"
              aria-label="Add a new task"
              aria-describedby="addTaskBtn"
              // Use the task state variable as the value of the input
              value={task}
            />
            <button
              className="btn btn-primary"
              id="addTaskBtn"
              onClick={addTask}
            >
              Add Task
            </button>
          </div>

          <div className="task-list" id="taskList"></div>
          {
           data.map((item, index) => (
            <ul>
              <li key={index} className="d-flex justify-content-between "><span>Id:{item.task_id}</span>
                {item.task_name} <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(item.task_id)}
                >
                  Delete
                </button></li>
            </ul>
          ))       
          }
        </div>
      </div>
    </div>
  );
}

export default App;
