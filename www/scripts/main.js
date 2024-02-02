/**
 * Module containing functions and managers related to tables, menu, product types, and data population.
 * @module main
 */

import { showTables, showMenu, showProductTypesTable, populateMenu } from "./functions.js";
import { ProductManager, ProductTypeManager, TableManager } from "./managers.js";
import { createProductTypesTable } from "./functions.js";

/**
 * Manager for handling product types.
 * @type {ProductTypeManager}
 */
const ptmanager = new ProductTypeManager();

/**
 * Manager for handling products.
 * @type {ProductManager}
 */
const pmanager = new ProductManager();

/**
 * Manager for handling tables.
 * @type {TableManager}
 */
const tmanager = new TableManager();

setTimeout(() => {
    populateMenu();
}, 500);

document.querySelector(".tableOrder").style.display = "none";
document.querySelector(".menu").style.display = "none";
document.querySelector(".productTypes").style.display = "none";

setTimeout(() => {
    const productTypesTable = createProductTypesTable(ptmanager.productTypes);
    const productTypesContainer = document.querySelector(".productTypes");
    productTypesContainer.appendChild(productTypesTable);
}, 500);

document.getElementById("tablesButton").addEventListener("click", showTables);
document.getElementById("menuButton").addEventListener("click", showMenu);
document.getElementById("productTypesButton").addEventListener("click", showProductTypesTable);

/**
 * Exports the product type manager, product manager, and table manager for external use.
 * @type {Object}
 * @property {ProductTypeManager} ptmanager - The product type manager.
 * @property {ProductManager} pmanager - The product manager.
 * @property {TableManager} tmanager - The table manager.
 */
export { ptmanager, pmanager, tmanager };
