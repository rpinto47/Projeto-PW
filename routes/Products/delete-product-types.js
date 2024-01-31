"use strict";
const query = require("../../scripts/query");

/**
 * Deletes a product type and updates related products to remove the association.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the process.
 * @returns {Promise<void>} A Promise that resolves when the deletion is successful.
 */
module.exports = async function deleteProductTypes(req, res) {
  try {
    let id = req.params.id;
    if (id) {
      await query(`
        UPDATE Product
        SET ProductTypeID = null
        WHERE ProductTypeID = ?;
      `, [id]);
      let rows = await query(`
        DELETE FROM ProductType
        WHERE ProductTypeID = ?;
      `, [id]);
      res.json({ rows });
    }
  } catch (error) {
    query.sendError(error, res);
  }
}

