"use strict";
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const readTasks = require("./routes/read-tasks");
const createTask = require("./routes/create-task");
const updateTasks = require("./routes/update-task");
const deleteTasks = require("./routes/delete-task");

const app = express();

app.use(favicon(path.join(__dirname, "/www/images/favicon.ico")));
app.use(express.static("www", { "index": "index.html" }));
app.use(express.json());

app.get("/tasks/:done?", readTasks);
app.post("/tasks", createTask);
app.put("/tasks/:id", updateTasks);
app.delete("/tasks/:id", deleteTasks);

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});
