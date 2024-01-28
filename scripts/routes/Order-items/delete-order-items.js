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

app.delete('/order-items/:table/:productId', async (req, res) => {
    try {
      const connection = await connectToDatabase();
      const tableId = req.params.table;
      const productId = req.params.productId;
  
      const deleteQuery = `
        DELETE FROM OrderProduct
        WHERE OrderID IN (
          SELECT OrderID
          FROM TableOrder
          WHERE MesaID = ?
        ) AND ProductID = ?;
      `;
  
      const [result] = await connection.execute(deleteQuery, [tableId, productId]);
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Order item removed successfully' });
      } else {
        res.status(404).json({ error: 'Order item not found' });
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