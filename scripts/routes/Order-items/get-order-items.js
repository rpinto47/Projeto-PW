"use strict";
const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the database using provided options.
 * @returns {Promise<import("mysql2/promise").Connection>} A promise that resolves to a MySQL database connection.
 * @throws {Error} If there is an error connecting to the database.
 */
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(connectionOptions);
    return connection;
  } catch (err) {
    throw err;
  }
};

/**
 * Retrieves order items for a specific table from the database.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves after handling the request.
 */
app.get('/order-items/:table', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const tableId = req.params.table;

    const query = `
      SELECT Product.ProductID, Product.Name, OrderProduct.Quantity, Product.Price, ProductType.TypeName
      FROM Product
      INNER JOIN OrderProduct ON Product.ProductID = OrderProduct.ProductID
      INNER JOIN TableOrder ON OrderProduct.OrderID = TableOrder.OrderID
      INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID
      WHERE TableOrder.MesaID = ?;
    `;

    const [results] = await connection.execute(query, [tableId]);

    const itemsInfo = results.map((row) => {
      return {
        productId: row.ProductID,
        name: row.Name,
        quantity: row.Quantity,
        price: row.Price,
        productType: row.TypeName
      };
    });

    res.json(itemsInfo);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Starts the Express server on the specified port.
 * @constant {number} PORT - The port on which the server will listen.
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});