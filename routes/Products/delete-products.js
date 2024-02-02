'use strict';
const query = require('../../scripts/query');

/**
 * Deletes a product and its associated OrderProducts from the database.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @returns {void}
 */
module.exports = async function deleteProduct(req, res) {
  try {
    const deleteProductQuery = `
      DELETE FROM Product
      WHERE ProductID = ?;
    `;

    console.log("Deleting product from ProductType table with ID:", productId);

    const result = await query(deleteProductQuery, [productId]);

    if (result && typeof result === 'object' && 'affectedRows' in result && result.affectedRows > 0) {
      console.log("Product and associated OrderProducts deleted successfully for ID:", productId);
      res.json({ message: 'Product and associated OrderProducts deleted successfully' });
    } else {
      console.log("Product not found for deletion with ID:", productId);
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    query.sendError(error, res);
  }
};
