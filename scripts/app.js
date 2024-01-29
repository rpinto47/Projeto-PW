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

app.get("/tasks/:done?", readTasks);
app.post("/tasks", createTask);
app.put("/tasks/:id", updateTasks);
app.delete("/tasks/:id", deleteTasks);

app.listen(3000, function () {
    console.log("Server running at http://localhost:3000");
});
