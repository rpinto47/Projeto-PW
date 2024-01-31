"use strict";
const query = require("../../scripts/query");

/**
 * Adds a new product type to the database.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the insertion process.
 * @returns {Promise<void>} A Promise that resolves when the insertion is successful, sending a JSON response with a success message and the inserted rows.
 */
module.exports = async function postProductTypes(req, res) {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(400).json({ error: 'Product type name is required.' });
    }

    const rows = await query(`
      INSERT INTO ProductType (TypeName)
      VALUES (?);
    `, [name]);

    res.json({ message: 'Product type added successfully.', rows });

  } catch (error) {
    console.error("Error occurred:", error);
    query.sendError(error, res);
  }
};
