"use strict";
const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

// Middleware to parse JSON in the request body
app.use(express.json());

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
    console.log('Received PUT request for product update');

    const connection = await connectToDatabase();
    const productId = req.params.id;

    // Log the entire req.body object
    console.log('Received body:', req.body);

    const { name, quantity, price, productType } = req.body;

    // Check if required fields are present
    if (!name || !quantity || !price || !productType) {
      console.log('Incomplete request data');
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    console.log('Received data:', { productId, name, quantity, price, productType });

    // Use the connection object for transactions
    const transaction = await connection.beginTransaction();

    try {
      const updateQuery = `
        UPDATE Product
        SET Name = ?, Quantity = ?, Price = ?, ProductTypeID = (SELECT ProductTypeID FROM ProductType WHERE TypeName = ?)
        WHERE ProductID = ?;
      `;
    
      const [result] = await connection.execute(updateQuery, [name, quantity, price, productType, productId]);
    
      if (result.affectedRows > 0) {
        console.log('Product updated successfully');
        await connection.commit(); // Use commit directly on the connection
        res.json({ message: 'Product updated successfully' });
      } else {
        console.log('Product not found');
        await connection.rollback(); // Use rollback directly on the connection
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      console.error('Error executing update query:', err);
      await connection.rollback(); // Use rollback directly on the connection
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Close the connection (no release method for direct connection)
      await connection.end();
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
