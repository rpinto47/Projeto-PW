"use strict";
const query = require("../../scripts/query");

/**
 * Updates a product in the database with the specified information.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the update process.
 * @returns {Promise<void>} A Promise that resolves when the update is successful, sending a JSON response with a success message and the affected rows.
 */
module.exports = async function putProductTypes(req, res) {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const productType = req.body.productType;

    console.log("Received request to update Product with ID:", id);

    if (isNaN(quantity) || isNaN(price)) {
      console.error("Invalid quantity or price. Quantity:", quantity, ", Price:", price);
      return res.status(400).json({ error: 'Quantity and price must be numeric values.' });
    }

    const updateProductQuery = `
      UPDATE Product
      SET Name = ?, Quantity = ?, Price = ?, ProductTypeID = (SELECT ProductTypeID FROM ProductType WHERE TypeName = ?)
      WHERE ProductID = ?;
    `;
    const result = await query(updateProductQuery, [name, quantity, price, productType, id]);
    console.log("Query result:", result);

    const rows = result && result.affectedRows !== undefined ? result.affectedRows : 0;

    if (rows > 0) {
      console.log("Product updated successfully. Rows affected:", rows);
      res.json({ message: 'Product updated successfully.', rows });
    } else {
      console.error("Product not updated with ID:", id);
      res.status(500).json({ error: 'Product not updated. Please check your input and try again.' });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    query.sendError(error, res);
  }
};
