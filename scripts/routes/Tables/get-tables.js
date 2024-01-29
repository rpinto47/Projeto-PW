"use strict";
const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");


/**
 * Establishes a connection to the database using the provided options.
 * @function
 * @async
 * @returns {Promise<mysql.Connection>} A promise that resolves to a MySQL connection.
 * @throws {Error} If an error occurs while connecting to the database.
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
 * Handles the GET request to retrieve information about tables.
 * @function
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves after processing the request.
 */
app.get('/tables', async (req, res) => {
  try {
    const connection = await connectToDatabase();

    const query = `
      SELECT Mesa.MesaID, Mesa.TableNumber, Mesa.OpenOrders
      FROM Mesa;
    `;

    const [results] = await connection.execute(query);

    const tablesInfo = results.map((row) => {
      return { tableId: row.MesaID, tableNumber: row.TableNumber, openOrders: row.OpenOrders };
    });

    res.json(tablesInfo);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
