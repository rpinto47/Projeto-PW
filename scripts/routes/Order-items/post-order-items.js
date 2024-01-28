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

app.post('/order-items/:table', async (req, res) => {
    try {
      const connection = await connectToDatabase();
      const tableId = req.params.table;
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ error: 'Incomplete request data' });
      }
 
      const tableExistsQuery = 'SELECT MesaID FROM TableOrder WHERE MesaID = ?';
      const [tableExists] = await connection.execute(tableExistsQuery, [tableId]);
  
      if (tableExists.length === 0) {
        return res.status(404).json({ error: 'Table not found' });
      }
  
      const insertQuery = `
        INSERT INTO OrderProduct (OrderID, ProductID, Quantity)
        VALUES (
          (SELECT OrderID FROM TableOrder WHERE MesaID = ?),
          ?,
          ?
        );
      `;
  
      const [result] = await connection.execute(insertQuery, [tableId, productId, quantity]);
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Order item added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add order item' });
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