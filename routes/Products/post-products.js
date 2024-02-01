"use strict";
const query = require("../../scripts/query");

/**
 * Adds a new product to the database.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the insertion process.
 * @returns {Promise<void>} A Promise that resolves when the insertion is successful, sending a JSON response with a success message and the inserted rows.
 */
module.exports = async function postProduct(req, res) {
  try {
    const name = req.body.name ;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const ptype = req.body.productType;

    console.log("Received request to add product:", { name, quantity, price });
    console.log("Nome", { name });

    if (name !== undefined && quantity !== undefined && price !== undefined) {
      // Validate quantity and price as numeric values
      if (isNaN(quantity) || isNaN(price)) {
        console.error("Invalid quantity or price. Quantity:", quantity, ", Price:", price);
        return res.status(400).json({ error: 'Quantity and price must be numeric values.' });
      }

      // Perform data insertion
      const rows = await query(`
        INSERT INTO Product (Name, Quantity, Price, ProductTypeID)
        VALUES (?, ?, ?, (SELECT ProductTypeID FROM ProductType WHERE TypeName=?));
      `, [name , quantity || null, price || null, ptype || null]);

      console.log("Product added successfully. Rows:", rows);

      res.json({ message: 'Product added successfully.', rows });
    } else {
      console.error("Missing required fields. Ensure name, quantity, and price are provided.");
      res.status(400).json({ error: 'Missing required fields. Ensure name, quantity, and price are provided.' });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    query.sendError(error, res);
  }
};