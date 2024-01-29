"use strict";

const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the database.
 * @returns {Promise<mysql.Connection>} A promise that resolves to a MySQL connection.
 * @throws {Error} If there is an error connecting to the database.
 */
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

/**
 * Deletes order items and associated table orders.
 * @function
 * @async
 * @name deleteOrderItems
 * @memberof module:express-server
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
app.delete('/order-items/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const identifier = req.params.id;

    await connection.beginTransaction();

    try {
      const deleteOrderProductsQuery = `
        DELETE FROM OrderProduct
        WHERE OrderID IN (
          SELECT OrderID
          FROM TableOrder
          WHERE MesaID = ? OR OrderID = ?
        );
      `;
      await connection.execute(deleteOrderProductsQuery, [identifier, identifier]);

      const deleteTableOrderQuery = `
        DELETE FROM TableOrder
        WHERE MesaID = ? OR OrderID = ?;
      `;
      const [result] = await connection.execute(deleteTableOrderQuery, [identifier, identifier]);

      await connection.commit();

      if (result.affectedRows > 0) {
        res.json({ message: 'Order items and TableOrder removed successfully' });
      } else {
        res.status(404).json({ error: 'Order items or TableOrder not found' });
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (err) {
    console.error('Error executing delete query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Starts the Express server on the specified port.
 * @constant {number} PORT - The port on which the server will listen.
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
