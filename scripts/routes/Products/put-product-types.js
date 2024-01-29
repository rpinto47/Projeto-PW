const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

const connectionOptions = require("../../connection-options.json");

app.use(express.json());

/**
 * Establishes a connection to the database.
 * @returns {Promise<import('mysql2/promise').Connection>} The database connection.
 * @throws Will throw an error if connection to the database fails.
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
 * Adds a new product type to the database.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
app.post('/product-types/:id', async (req, res) => {
  let connection;

  try {
    connection = await connectToDatabase();

    /** @type {string} */
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
    if (connection) {
      await connection.end();
    }
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
