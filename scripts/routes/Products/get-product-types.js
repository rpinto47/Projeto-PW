const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Connects to the database using the provided connection options.
 * @returns {Promise<import("mysql2/promise").Connection>} A promise that resolves to the database connection.
 * @throws {Error} If there's an error connecting to the database.
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
 * Retrieves information about product types from the database.
 * @param {string} [productTypeId] - Optional parameter for filtering by product type ID.
 * @returns {Promise<void>} A promise that resolves to the product types information.
 * @throws {Error} If there's an error executing the query.
 */
app.get('/product-types/:id?', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productTypeId = req.params.id;

    let query;
    let params;

    if (productTypeId) {
      query = `
        SELECT ProductType.ProductTypeID, ProductType.TypeName
        FROM ProductType
        WHERE ProductType.ProductTypeID = ?;
      `;
      params = [productTypeId];
    } else {
      query = `
        SELECT ProductType.ProductTypeID, ProductType.TypeName
        FROM ProductType;
      `;
      params = [];
    }

    const [results] = await connection.execute(query, params);

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

/**
 * Starts the Express server on the specified port.
 * @constant {number} PORT - The port on which the server will listen.
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});