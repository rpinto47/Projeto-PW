const express = require('express');
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());

const connectionOptions = require("../../connection-options.json");

/**
 * Establishes a connection to the database.
 * @returns {Promise<Connection>} A promise that resolves to a MySQL connection.
 * @throws {Error} If there's an error connecting to the database.
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
 * Handles POST requests to add an order item.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
app.post('/order-items/:table', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const tableId = req.params.table;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Incomplete request data' });
    }

    const tableExistsQuery = 'SELECT MesaID FROM TableOrder WHERE MesaID = ?';
    const [tableExists] = await connection.execute(tableExistsQuery, [tableId]);

    if (tableExists.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const insertQuery = `
      INSERT INTO OrderProduct (OrderID, ProductID, Quantity)
      VALUES (
        (SELECT OrderID FROM TableOrder WHERE MesaID = ?),
        ?,
        ?
      );
    `;

    const [result] = await connection.execute(insertQuery, [tableId, productId, quantity]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Order item added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add order item' });
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