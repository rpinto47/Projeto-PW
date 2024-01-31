"use strict";
const query = require("../../scripts/query");

/**
 * Retrieves product types based on the provided parameters or retrieves all product types if no specific ID is provided.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the retrieval process.
 * @returns {Promise<void>} A Promise that resolves when the retrieval is successful, sending a JSON response with the retrieved product types.
 */
module.exports = async function getProductTypes(req, res) {
  try {
    let id = req.params.id;
    let rows;

    if (id) {
      rows = await query(`
        SELECT ProductType.ProductTypeID, ProductType.TypeName
        FROM ProductType
        WHERE ProductType.ProductTypeID = ?;
      `, [id]);
    } else {
      rows = await query(`
        SELECT ProductType.ProductTypeID, ProductType.TypeName
        FROM ProductType;
      `, []);
    }
    res.json({ rows });

  } catch (error) {
    query.sendError(error, res);
  }
}



