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

app.get('/order-items/:table', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const tableId = req.params.table;

    const query = `
      SELECT Product.ProductID, Product.Name, OrderProduct.Quantity, Product.Price, ProductType.TypeName
      FROM Product
      INNER JOIN OrderProduct ON Product.ProductID = OrderProduct.ProductID
      INNER JOIN TableOrder ON OrderProduct.OrderID = TableOrder.OrderID
      INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID
      WHERE TableOrder.MesaID = ?;
    `;

    const [results] = await connection.execute(query, [tableId]);

    const itemsInfo = results.map((row) => {
      return {
        productId: row.ProductID,
        name: row.Name,
        quantity: row.Quantity,
        price: row.Price,
        productType: row.TypeName
      };
    });

    res.json(itemsInfo);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});