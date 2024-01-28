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

app.post('/product-types', async (req, res) => {
    try {
      const connection = await connectToDatabase();
      const { typeName } = req.body;

      if (!typeName) {
        return res.status(400).json({ error: 'Incomplete request data' });
      }
  
      const insertQuery = `
        INSERT INTO ProductType (TypeName)
        VALUES (?);
      `;
  
      const [result] = await connection.execute(insertQuery, [typeName]);
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Product type added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add product type' });
      }
    } catch (err) {
      console.error('Error executing insert query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });