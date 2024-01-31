"use strict";
const mysql = require("mysql2/promise");
const connectionOptions = require("./connection-options");

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

function sendError(error, response) {
    response.status(500).end(typeof error === "string" ? error : "");
}

module.exports = query;
module.exports.sendError = sendError;
