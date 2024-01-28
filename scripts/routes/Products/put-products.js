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

app.put('/products/:id', async (req, res) => {
    try {
      const connection = await connectToDatabase();
      const productId = req.params.id;
      const { name, quantity, price, productType } = req.body;
  
      if (!name || !quantity || !price || !productType) {
        return res.status(400).json({ error: 'Incomplete request data' });
      }
  
      const updateQuery = `
        UPDATE Product
        SET Name = ?, Quantity = ?, Price = ?, ProductTypeID = (SELECT ProductTypeID FROM ProductType WHERE TypeName = ?)
        WHERE ProductID = ?;
      `;
  
      const [result] = await connection.execute(updateQuery, [name, quantity, price, productType, productId]);
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Product updated successfully' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      console.error('Error executing update query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  