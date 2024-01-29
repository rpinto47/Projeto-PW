const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

app.use(express.json());

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
 * Handles the PUT request to update product information.
 * @function
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} A promise that resolves after processing the request.
 */
app.put('/products/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const productId = req.params.id;

    console.log('Received PUT request for product update');

    const { name, quantity, price, productType } = req.body;

    if (!name || !quantity || !price || !productType) {
      console.log('Incomplete request data');
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    console.log('Received data:', { productId, name, quantity, price, productType });

    const transaction = await connection.beginTransaction();

    try {
      const updateQuery = `
        UPDATE Product
        SET Name = ?, Quantity = ?, Price = ?, ProductTypeID = (SELECT ProductTypeID FROM ProductType WHERE TypeName = ?)
        WHERE ProductID = ?;
      `;

      const [result] = await connection.execute(updateQuery, [name, quantity, price, productType, productId]);

      if (result.affectedRows > 0) {
        console.log('Product updated successfully');
        await connection.commit();
        res.json({ message: 'Product updated successfully' });
      } else {
        console.log('Product not found');
        await connection.rollback();
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      console.error('Error executing update query:', err);
      await connection.rollback();
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await connection.end();
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
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
