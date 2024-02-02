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
module.exports = async function putProductTypes(req, res) {
  try {
    let oldName = req.body.nameToUpdate;
    let newName = req.body.newName;

    if (oldName && newName) {
        const updateQuery = await query(
        "UPDATE ProductType SET TypeName = ? WHERE TypeName = ?",
        [newName, oldName]
      );

      res.json({ rows: updateQuery });

    } else {
      res.status(400).json({ error: "Old name or new name not provided." });
    }
  } catch (error) {
    query.sendError(error, res);
  }
};
