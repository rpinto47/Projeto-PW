"use strict";
const query = require("../../scripts/query");

/**
 * Retrieves OrderItems associated with a specific table.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves with the retrieved OrderItems.
 */
const getOrderItems = async function(req, res) {
  try {
    let table = req.params.table;

    console.log("Received request for table:", table);

    if (table) {
      let rows = await query(`
        SELECT Product.ProductID, Product.Name, OrderProduct.Quantity, Product.Price, ProductType.TypeName
        FROM Product
        INNER JOIN OrderProduct ON Product.ProductID = OrderProduct.ProductID
        INNER JOIN TableOrder ON OrderProduct.OrderID = TableOrder.OrderID
        INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID
        WHERE TableOrder.MesaID = ?;
      `, [table]);

      console.log("Query executed successfully. Result:", rows);

      res.json({ rows });
    } else {
      console.log("Table parameter is missing. Sending a 400 response.");
      res.status(400).json({ error: "Table parameter is missing" });
    }

  } catch (error) {
    console.error("Error occurred:", error);
    query.sendError(error, res);
  }
};

module.exports = getOrderItems;
