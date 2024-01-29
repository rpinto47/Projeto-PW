const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Connects to the database using the provided connection options.
 * @returns {Promise<object>} A Promise that resolves to a database connection.
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
 * Deletes a product and its associated OrderProducts from the database.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @returns {void}
 */
app.delete('/products/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productId = req.params.id;

    const orderProductsQuery = `
      SELECT OrderProductID
      FROM OrderProduct
      WHERE ProductID = ?;
    `;
    const [orderProductsResult] = await connection.execute(orderProductsQuery, [productId]);

    if (orderProductsResult.length > 0) {
      const deleteOrderProductsQuery = `
        DELETE FROM OrderProduct
        WHERE ProductID = ?;
      `;
      await connection.execute(deleteOrderProductsQuery, [productId]);
    }

    const deleteQuery = `
      DELETE FROM Product
      WHERE ProductID = ?;
    `;
    const [result] = await connection.execute(deleteQuery, [productId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Product and associated OrderProducts deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
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
