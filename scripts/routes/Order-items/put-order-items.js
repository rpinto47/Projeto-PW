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

app.put('/order-items/:id', async (req, res) => {
  try {
    console.log('Received PUT request for order item update');

    const connection = await connectToDatabase();
    const orderId = req.params.id;
    const { quantity } = req.body;

    // Check if required fields are present
    if (!quantity) {
      console.log('Incomplete request data');
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    try {
      await connection.beginTransaction();

      const updateQuery = `
        UPDATE OrderProduct
        SET Quantity = ?
        WHERE OrderID = ?;
      `;

      const [result] = await connection.execute(updateQuery, [quantity, orderId]);

      if (result.affectedRows > 0) {
        console.log('Order item updated successfully');
        await connection.commit();
        res.json({ message: 'Order item updated successfully' });
      } else {
        console.log('Order item not found');
        await connection.rollback();
        res.status(404).json({ error: 'Order item not found' });
      }
    } catch (err) {
      console.error('Error executing update query:', err);
      await connection.rollback();
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
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
