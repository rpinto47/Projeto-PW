const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the database.
 * @returns {Promise<import('mysql2/promise').PoolConnection>} Database connection
 * @throws {Error} If connection to the database fails
 */
const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(connectionOptions);
    return connection;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
};

/**
 * Deletes a product type and updates associated products.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
app.delete('/product-types/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productTypeId = req.params.id;

    const productsQuery = `
      SELECT ProductID
      FROM Product
      WHERE ProductTypeID = ?;
    `;
    const [productsResult] = await connection.execute(productsQuery, [productTypeId]);

    if (productsResult.length > 0) {
      const updateProductsQuery = `
        UPDATE Product
        SET ProductTypeID = NULL
        WHERE ProductTypeID = ?;
      `;
      await connection.execute(updateProductsQuery, [productTypeId]);
    }

    const deleteQuery = `
      DELETE FROM ProductType
      WHERE ProductTypeID = ?;
    `;
    const [result] = await connection.execute(deleteQuery, [productTypeId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Product type deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product type not found' });
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