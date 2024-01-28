"use strict";
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const readTasks = require("./routes/read-tasks");
const createTask = require("./routes/create-task");
const updateTasks = require("./routes/update-task");
const deleteTasks = require("./routes/delete-task");
