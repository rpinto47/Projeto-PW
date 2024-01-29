"use strict";
const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Connects to the database using the provided connection options.
 * @returns {Promise<import("mysql2/promise").Connection>} A promise that resolves to the database connection.
 * @throws {Error} If there's an error connecting to the database.
 */
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(connectionOptions);
    console.log('Connected to the database');
    return connection;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
};

/**
 * Retrieves information about products from the database.
 * @param {string} [productId] - Optional parameter for filtering by product ID.
 * @returns {Promise<void>} A promise that resolves to the products information.
 * @throws {Error} If there's an error executing the query.
 */
app.get('/products/:id?', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productId = req.params.id;

    let query;
    let params;

    if (productId) {
      query = `
        SELECT Product.ProductID, Product.Name, Product.Quantity, Product.Price, ProductType.TypeName
        FROM Product
        INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID
        WHERE Product.ProductID = ?;
      `;
      params = [productId];
    } else {
      query = `
        SELECT Product.ProductID, Product.Name, Product.Quantity, Product.Price, ProductType.TypeName
        FROM Product
        INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID;
      `;
      params = [];
    }

    const [results] = await connection.execute(query, params);

    const productsInfo = results.map((row) => {
      return {
        productId: row.ProductID,
        name: row.Name,
        quantity: row.Quantity,
        price: row.Price,
        productType: row.TypeName
      };
    });

    res.json(productsInfo);
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