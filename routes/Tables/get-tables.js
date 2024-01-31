"use strict";
const query = require("../../scripts/query");

/**
 * Retrieves table information from the database.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the retrieval process.
 * @returns {Promise<void>} A Promise that resolves when the retrieval is successful, sending a JSON response with the retrieved table information.
 */
module.exports = async function getTables(req, res) {
  try {
    let rows = await query(`
      SELECT Mesa.MesaID, Mesa.TableNumber
      FROM Mesa;
    `, [])
    res.json({ rows });
  } catch (error) {
    query.sendError(error, res);
  }
}


