"use strict";
const query = require("../../scripts/query");


/**
 * Adds OrderItems to a specific table.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the OrderItems are successfully added.
 */
const postOrderItems = async function(req, res) {
  try {
    let table = req.params.table;
    const { productId, quantity } = req.body;

    if (table) {
      let rows = await query(`
        INSERT INTO OrderProduct (OrderID, ProductID, Quantity)
        VALUES (
          (SELECT OrderID FROM TableOrder WHERE MesaID = ?),
          ?,
          ?
        );
      `, [table, productId, quantity]);

      res.json({ rows });
    }
  } catch (error) {
    query.sendError(error, res);
  }
};

module.exports = postOrderItems;

