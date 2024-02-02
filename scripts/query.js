"use strict";

/**
 * Executes a MySQL query using a connection pool and returns the result.
 *
 * @param {string} sqlCommand - The SQL command to be executed.
 * @param {Array} values - An array of values to be used in the SQL command.
 * @returns {Promise<Array>} A promise that resolves to the result of the query.
 * @throws {Error} Throws an error if the query execution fails.
 */
const mysql = require("mysql2/promise");
const connectionOptions = require("./connection-options");

/**
 * Establishes a connection to the MySQL database, executes the query, and closes the connection.
 *
 * @param {string} sqlCommand - The SQL command to be executed.
 * @param {Array} values - An array of values to be used in the SQL command.
 * @returns {Promise<Array>} A promise that resolves to the result of the query.
 * @throws {Error} Throws an error if the query execution fails.
 */
async function query(sqlCommand, values) {
    let connection;
    try {
        connection = await mysql.createConnection(connectionOptions);
        let [result] = await connection.execute(sqlCommand, values);
        return result;
    } catch (error) {
        throw error;
    } finally {
        connection && connection.end();
    }
}

/**
 * Sends an HTTP 500 Internal Server Error response with the specified error message.
 *
 * @param {Error|string} error - The error object or error message.
 * @param {Object} response - The Express response object.
 */
function sendError(error, response) {
    response.status(500).end(typeof error === "string" ? error : "");
}

module.exports = query;
module.exports.sendError = sendError;
