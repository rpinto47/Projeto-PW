"use strict";
const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

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
app.delete('/products/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productId = req.params.id;

    // Check if there are associated OrderProduct records
    const orderProductsQuery = `
      SELECT OrderProductID
      FROM OrderProduct
      WHERE ProductID = ?;
    `;
    const [orderProductsResult] = await connection.execute(orderProductsQuery, [productId]);

    if (orderProductsResult.length > 0) {
      // If there are associated OrderProduct records, delete them first
      const deleteOrderProductsQuery = `
        DELETE FROM OrderProduct
        WHERE ProductID = ?;
      `;
      await connection.execute(deleteOrderProductsQuery, [productId]);
    }

    // Now you can delete the Product
    const deleteQuery = `
      DELETE FROM Product
      WHERE ProductID = ?;
    `;
    const [result] = await connection.execute(deleteQuery, [productId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Product and associated OrderProducts deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error executing delete query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
