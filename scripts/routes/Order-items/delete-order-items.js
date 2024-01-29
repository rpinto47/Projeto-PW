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

app.delete('/order-items/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const identifier = req.params.id;

    // Transaction: Start a transaction to ensure atomicity
    await connection.beginTransaction();

    try {
      // Delete OrderProduct records associated with the TableOrder
      const deleteOrderProductsQuery = `
        DELETE FROM OrderProduct
        WHERE OrderID IN (
          SELECT OrderID
          FROM TableOrder
          WHERE MesaID = ? OR OrderID = ?
        );
      `;
      await connection.execute(deleteOrderProductsQuery, [identifier, identifier]);

      // Delete the TableOrder
      const deleteTableOrderQuery = `
        DELETE FROM TableOrder
        WHERE MesaID = ? OR OrderID = ?;
      `;
      const [result] = await connection.execute(deleteTableOrderQuery, [identifier, identifier]);

      // Commit the transaction
      await connection.commit();

      if (result.affectedRows > 0) {
        res.json({ message: 'Order items and TableOrder removed successfully' });
      } else {
        res.status(404).json({ error: 'Order items or TableOrder not found' });
      }
    } catch (error) {
      // Rollback the transaction in case of an error
      await connection.rollback();
      throw error; // Propagate the error after rolling back
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
