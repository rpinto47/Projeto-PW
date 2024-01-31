"use strict";
const query = require("../../scripts/query");

/**
 * Deletes OrderProducts related to a TableOrder associated with the specified MesaID.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the deletion process.
 * @returns {Promise<void>} A Promise that resolves when the deletion is successful, sending a JSON response with a success message and the affected rows.
 */
module.exports = async function putTables(req, res) {
  try {
    let mesaId = req.params.id;
    if (mesaId) {
      let rows = await query(`
        DELETE FROM OrderProduct
        WHERE OrderID IN (
          SELECT OrderID
          FROM TableOrder
          WHERE MesaID = ?
        );
      `, [mesaId]);

      res.json({ message: `OrderProducts related to TableOrder with MesaID ${mesaId} have been deleted.`, rows });
    }
  } catch (error) {
    query.sendError(error, res);
  }
};
