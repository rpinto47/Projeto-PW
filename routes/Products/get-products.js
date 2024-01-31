"use strict";
const query = require("../../scripts/query");

/**
 * Retrieves product details based on the provided product ID or retrieves all products with associated product types if no specific ID is provided.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the retrieval process.
 * @returns {Promise<void>} A Promise that resolves when the retrieval is successful, sending a JSON response with the retrieved product details.
 */
module.exports = async function getProduct(req, res) {
  try {
    let id = req.params.id;
    let rows;
    if (id) {
      rows = await query(`
        SELECT Product.ProductID, Product.Name, Product.Quantity, Product.Price, ProductType.TypeName
        FROM Product
        INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID
        WHERE Product.ProductID = ?;
      `, [id]);
    } else {
      rows = await query(`
        SELECT Product.ProductID, Product.Name, Product.Quantity, Product.Price, ProductType.TypeName
        FROM Product
        INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID;
      `, []);
    }
    res.json({ rows });

  } catch (error) {
    query.sendError(error, res);
  }
}




