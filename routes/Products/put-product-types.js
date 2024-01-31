"use strict";
const query = require("../../scripts/query");

/**
 * Adds or updates a product type in the database.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if any error occurs during the insertion/update process.
 * @returns {Promise<void>} A Promise that resolves when the insertion/update is successful, sending a JSON response with the affected rows.
 */
module.exports = async function putProductTypes(req, res){
  try {
    let name = req.body.name;
    if(name){
      let rows = await query(`INSERT INTO ProductType (TypeName)
      VALUES (?);
    `,[name])
    res.json({rows});
    }
  } catch (error) {
    query.sendError(error, res);
  }
}

