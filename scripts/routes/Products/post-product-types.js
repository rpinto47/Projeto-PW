const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the database using the provided options.
 * @returns {Promise<mysql.Connection>} A promise that resolves to a MySQL connection.
 * @throws Will throw an error if there's an issue connecting to the database.
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
 * Handles POST requests to add a new product type.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the handling is complete.
 */
app.post('/product-types/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    const { typeName } = req.body;

    if (!typeName) {
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    const insertQuery = `
      INSERT INTO ProductType (TypeName)
      VALUES (?);
    `;

    const [result] = await connection.execute(insertQuery, [typeName]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Product type added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add product type' });
    }
  } catch (err) {
    console.error('Error executing insert query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await connection.end();
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
