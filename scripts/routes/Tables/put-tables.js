"use strict";
const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the MySQL database.
 * @returns {Promise<mysql.Connection>} A promise resolving to the database connection.
 * @throws {Error} Throws an error if there's an issue connecting to the database.
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
 * Express route to close orders associated with a specific table.
 * @name PUT /tables/:id
 * @function
 * @memberof module:Server
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise resolving to the response being sent.
 */
app.put('/tables/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const tableId = req.params.id;

    const deleteOrderProductsQuery = `
      DELETE FROM OrderProduct
      WHERE OrderID IN (
        SELECT OrderID
        FROM TableOrder
        WHERE MesaID = ?
      );
    `;

    const [result] = await connection.execute(deleteOrderProductsQuery, [tableId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Order closed successfully' });
    } else {
      res.status(404).json({ error: 'No order products found for the table' });
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
