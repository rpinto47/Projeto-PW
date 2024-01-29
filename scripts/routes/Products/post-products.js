const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the database using the provided options.
 * @returns {Promise<Connection>} A promise that resolves to the database connection.
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
 * Handles POST requests to create new products.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
app.post('/products', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const { name, quantity, price, productType } = req.body;

    if (!name || !quantity || !price || !productType) {
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    const insertQuery = `
      INSERT INTO Product (Name, Quantity, Price, ProductTypeID)
      VALUES (?, ?, ?, (SELECT ProductTypeID FROM ProductType WHERE TypeName = ?));
    `;

    const [result] = await connection.execute(insertQuery, [name, quantity, price, productType]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Product added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add product' });
    }
  } catch (err) {
    console.error('Error executing insert query:', err);
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