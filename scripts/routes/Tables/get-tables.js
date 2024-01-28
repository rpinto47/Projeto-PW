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


app.get('/tables', async (req, res) => {
  try {
    const connection = await connectToDatabase();

    const query = `
      SELECT Mesa.MesaID FROM Mesa;
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
