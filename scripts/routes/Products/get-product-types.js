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

app.get('/product-types', async (req, res) => {
  try {
    const connection = await connectToDatabase();

    const query = `
      SELECT ProductType.ProductTypeID, ProductType.TypeName
      FROM ProductType;
    `;

    const [results] = await connection.execute(query);

    const productTypesInfo = results.map((row) => {
      return {
        productTypeId: row.ProductTypeID,
        typeName: row.TypeName
      };
    });

    res.json(productTypesInfo);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
