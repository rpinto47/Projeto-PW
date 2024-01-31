"use strict";
const query = require("../../scripts/query");


/**
 * Deletes OrderItems associated with a specific OrderID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the deletion is complete.
 */
const deleteOrderItems = async function(req, res) {
  try {
    let id = req.params.id;

    console.log("Received request to delete OrderItems with OrderID:", id);

    if (id) {
      let rows = await query(`
        DELETE FROM OrderProduct
        WHERE OrderID IN (
          SELECT OrderID
          FROM TableOrder
          WHERE MesaID = ? OR OrderID = ?
        );
      `, [id, id]);

      console.log("Deleted OrderItems with OrderID:", id, ". Rows affected:", rows.affectedRows);

      res.json({ rows });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    query.sendError(error, res);
  }
};

module.exports = deleteOrderItems;
