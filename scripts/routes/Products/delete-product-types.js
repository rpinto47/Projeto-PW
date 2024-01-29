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
app.delete('/product-types/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productTypeId = req.params.id;

    // Check if there are associated products
    const productsQuery = `
      SELECT ProductID
      FROM Product
      WHERE ProductTypeID = ?;
    `;
    const [productsResult] = await connection.execute(productsQuery, [productTypeId]);

    if (productsResult.length > 0) {
      // If there are associated products, update ProductTypeID to NULL
      const updateProductsQuery = `
        UPDATE Product
        SET ProductTypeID = NULL
        WHERE ProductTypeID = ?;
      `;
      await connection.execute(updateProductsQuery, [productTypeId]);
    }

    // Now you can delete the ProductType
    const deleteQuery = `
      DELETE FROM ProductType
      WHERE ProductTypeID = ?;
    `;
    const [result] = await connection.execute(deleteQuery, [productTypeId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Product type deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product type not found' });
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
