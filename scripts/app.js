"use strict";
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");

const deleteOrderItemsRoute = require("./routes/Order-items/delete-order-items");
const getOrderItemsRoute = require("./routes/Order-items/get-order-items");
const postOrderItemsRoute = require("./routes/Order-items/post-order-items");
const putOrderItemsRoute = require("./routes/Order-items/put-order-items");

const deleteProductTypesRoute = require("./routes/Products/delete-product-types");
const deleteProductsRoute = require("./routes/Products/delete-products");
const getProductTypesRoute = require("./routes/Products/get-product-types");
const getProductsRoute = require("./routes/Products/get-products");
const postProductTypesRoute = require("./routes/Products/post-product-types");
const postProductsRoute = require("./routes/Products/post-products");
const putProductTypesRoute = require("./routes/Products/put-product-types");
const putProductsRoute = require("./routes/Products/put-products");

const getTablesRoute = require("./routes/Tables/get-tables");
const putTablesRoute = require("./routes/Tables/put-tables");

const app = express();

app.use(favicon(path.join(__dirname, "/www/images/favicon.ico")));
app.use(express.static("www", { "index": "index.html" }));
app.use(express.json());

// Rota para ler tarefas
app.get("/tasks/:done?", readTasks);

// Rota para criar uma tarefa
app.post("/tasks", createTask);

// Rota para atualizar tarefas
app.put("/tasks/:id", updateTasks);

// Rota para excluir tarefas
app.delete("/tasks/:id", deleteTasks);

// Inicialização do servidor
app.listen(3000, function () {
    console.log("Server running at http://localhost:3000");
});

// Manipuladores de rota para tarefas
function readTasks(req, res) {
    const doneParam = req.params.done;
    // Faça algo com doneParam e retorne a resposta
    res.send(`Read tasks with done parameter: ${doneParam}`);
}

function createTask(req, res) {
    const taskData = req.body;
    // Faça algo com taskData e retorne a resposta
    res.send("Create a new task");
}

function updateTasks(req, res) {
    const taskId = req.params.id;
    const updatedTaskData = req.body;
    // Faça algo com taskId e updatedTaskData e retorne a resposta
    res.send(`Update task with ID ${taskId}`);
}

function deleteTasks(req, res) {
    const taskId = req.params.id;
    // Faça algo com taskId e retorne a resposta
    res.send(`Delete task with ID ${taskId}`);
}

// Exemplo de chamada de rotas relacionadas a pedidos
app.use("/order-items", deleteOrderItemsRoute);
app.use("/order-items", getOrderItemsRoute);
app.use("/order-items", postOrderItemsRoute);
app.use("/order-items", putOrderItemsRoute);

// Exemplo de chamada de rotas relacionadas a produtos
app.use("/products", deleteProductTypesRoute);
app.use("/products", deleteProductsRoute);
app.use("/products", getProductTypesRoute);
app.use("/products", getProductsRoute);
app.use("/products", postProductTypesRoute);
app.use("/products", postProductsRoute);
app.use("/products", putProductTypesRoute);
app.use("/products", putProductsRoute);

// Exemplo de chamada de rotas relacionadas a mesas
app.use("/tables", getTablesRoute);
app.use("/tables", putTablesRoute);
