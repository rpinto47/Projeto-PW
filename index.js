"use strict";

const express = require('express');
const app = express();

// Order Items Routes
const deleteOrderItemsRoute = require("./routes/Order-items/delete-order-items");
const getOrderItemsRoute = require("./routes/Order-items/get-order-items");
const postOrderItemsRoute = require("./routes/Order-items/post-order-items");
const putOrderItemsRoute = require("./routes/Order-items/put-order-items");

// Products Routes
const deleteProductTypesRoute = require("./routes/Products/delete-product-types");
const deleteProductsRoute = require("./routes/Products/delete-products");
const getProductTypesRoute = require("./routes/Products/get-product-types");
const getProductsRoute = require("./routes/Products/get-products");
const postProductTypesRoute = require("./routes/Products/post-product-types");
const postProductsRoute = require("./routes/Products/post-products");
const putProductTypesRoute = require("./routes/Products/put-product-types");
const putProductsRoute = require("./routes/Products/put-products");

// Tables Routes
const getTablesRoute = require("./routes/Tables/get-tables");
const putTablesRoute = require("./routes/Tables/put-tables");

// Middleware
app.use(express.static("www", { "index": "index.html" }));
app.use(express.json());

// Route Definitions

/*----------- Order Items -------------*/
app.delete("/order-items/:id", deleteOrderItemsRoute);
app.get("/order-items/:table", getOrderItemsRoute);
app.post("/order-items/:table", postOrderItemsRoute);
app.put("/order-items/:table", putOrderItemsRoute);

/*----------- Products -------------*/
app.delete("/product-types/:id", deleteProductTypesRoute);
app.delete("/products/:id", deleteProductsRoute);
app.get("/product-types/", getProductTypesRoute);
app.get("/products/:id?", getProductsRoute);
app.post("/product-types", postProductTypesRoute);
app.post("/products", postProductsRoute);
app.put("/product-types/:id", putProductTypesRoute);
app.put("/products/:id", putProductsRoute);

/*----------- Tables -------------*/
app.get("/tables", getTablesRoute);
app.put("/tables/:id", putTablesRoute);

// Server Initialization
app.listen(5500, function () {
  console.log("Server running at http://localhost:5500");
});
