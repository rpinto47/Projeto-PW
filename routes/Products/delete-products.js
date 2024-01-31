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
    const productId = req.params.id;

    console.log("Received request to delete product with ID:", productId);

    const orderProductsQuery = `
      SELECT OrderProductID
      FROM OrderProduct
      WHERE ProductID = ?;
    `;

    const orderProductsResult = await query(orderProductsQuery, [productId]);

    if (orderProductsResult && Array.isArray(orderProductsResult) && orderProductsResult.length > 0) {
      console.log("Associated OrderProducts for product with ID:", productId, ":", orderProductsResult);

      const deleteOrderProductsQuery = `
        DELETE FROM OrderProduct
        WHERE ProductID = ?;
      `;

      console.log("Deleting associated OrderProducts for product with ID:", productId);

      await query(deleteOrderProductsQuery, [productId]);
    }

    const updateProductQuery = `
      UPDATE Product
      SET ProductTypeID = null
      WHERE ProductTypeID = ?;
    `;

    console.log("Updating Product table for product with ID:", productId);

    await query(updateProductQuery, [productId]);

    const deleteProductQuery = `
      DELETE FROM ProductType
      WHERE ProductTypeID = ?;
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
