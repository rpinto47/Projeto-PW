"use strict";
const mysql = require("mysql2/promise");
const connectionOptions = require("./connection-options");

export async function query(sqlCommand, values) {
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

async function fetchRows() {
    try {
        let sqlCommand = "SELECT Name, Price FROM product";
        let rows = await query(sqlCommand);
        console.log(rows);
    } catch (error) {
        console.error("Error fetching rows:", error);
    }
}

fetchRows();

function sendError(error, response) {
    response.status(500).end(typeof error === "string" ? error : "");
}

module.exports = query;
module.exports.sendError = sendError;
