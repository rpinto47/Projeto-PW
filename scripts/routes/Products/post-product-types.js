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

app.post('/product-types/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    // Extract typeName from request body
    const { typeName } = req.body;

    // Check if typeName is provided
    if (!typeName) {
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    // Use an INSERT query to add a new product type
    const insertQuery = `
      INSERT INTO ProductType (TypeName)
      VALUES (?);
    `;

    // Execute the query with typeName as a parameter
    const [result] = await connection.execute(insertQuery, [typeName]);

    // Check if the insertion was successful
    if (result.affectedRows > 0) {
      res.json({ message: 'Product type added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add product type' });
    }
  } catch (err) {
    console.error('Error executing insert query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await connection.end();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
