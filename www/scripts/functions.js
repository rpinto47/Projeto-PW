import { Table, menu } from "./classes.js";
import { ptmanager, pmanager, tmanager } from "./main.js";

/**
 * Adds tables based on the information in the tmanager.tables array.
 */
export function addTables() {
    const tablesDiv = document.querySelector(".tables");

    if (tmanager && Array.isArray(tmanager.tables) && tmanager.tables.length > 0) {
        tablesDiv.style.display = "flex";
        addButton.style.display = "none";

        tmanager.tables.forEach(tableInfo => {
            new Table(tableInfo.number);
        });
    } else {
        alert("No tables available to add.");
    }
}


/**
 * Shows or hides the tables based on their current display state.
 */
export function showTables() {
    const tablesDiv = document.querySelector(".tables");
    const tableOrderDiv = document.querySelector(".tableOrder");
    const menuElement = document.querySelector(".menu");

    if (tablesDiv.style.display === "none") {
        tablesDiv.style.display = "flex";
        tableOrderDiv.style.display = "none";
        menuElement.style.display = "none";
    } else {
        document.querySelectorAll(".table").forEach(table => {
            table.classList.remove("selected");
        });
        tableOrderDiv.style.display = "none";
        menuElement.style.display = "none";
    }
}

/**
 * Displays the menu or hides it based on its current display state.
 */
export function showMenu() {
    const menuElement = document.querySelector(".menu");

    hideElements();

    if (menuElement.style.display === "none") {
        while (menuElement.firstChild) {
            menuElement.removeChild(menuElement.firstChild);
        }

        hideElements();

        const menuTable = menu.displayMenuTable();
        menuElement.appendChild(menuTable);
        menuElement.style.display = "block";
    } else {
        hideElements();
        for (let child of menuElement.children) {
            menuElement.removeChild(child);
        }

        const menuTable = menu.displayMenuTable();
        menuElement.appendChild(menuTable);
        menuElement.style.display = "block";
    }
}

/**
 * Shows the product types table and hides other elements.
 */
export function showProductTypesTable() {
    const productTypesContainer = document.getElementById("productTypes-container");
    hideElements();
    productTypesContainer.style.display = "block";
}

/**
 * Populates the menu with product data obtained from the ProductManager.
 * @param {Object} menu - The menu object.
 * @param {ProductManager} productManager - The ProductManager instance.
 */
export async function populateMenu() {
    try {
        const products = pmanager.products;
        console.log("Loading products", products);
        if (products && products.length > 0) {
            for (let product of products) {
                menu.addProduct(product);
            }
        } else {
            console.error('No products available.');
        }
    } catch (error) {
        console.error('Error populating menu:', error.message);
    }
}

/**
 * Clears the menu by removing all products.
 * @param {Object} menu - The menu object.
 */
export function clearMenu() {
    menu.products = [];
}





/**
 * Hides various UI elements.
 */
function hideElements() {
    const tablesDiv = document.querySelector(".tables");
    const tableOrderDiv = document.querySelector(".tableOrder");
    const menuElement = document.querySelector(".menu");
    const productTypeDiv = document.querySelector(".productTypes");

    if (tablesDiv.style.display !== "none") {
        tablesDiv.style.display = "none";
    }

    if (tableOrderDiv.style.display !== "none") {
        tableOrderDiv.style.display = "none";
    }

    if (menuElement.style.display !== "none") {
        menuElement.style.display = "none";
    }
    if (productTypeDiv.style.display !== "none") {
        productTypeDiv.style.display = "none";
    }
}

/*---------------------------------------------------------------- Product Types ----------------------------------------------------------------*/

/**
 * Add a new value to the product types enumeration and refresh the product types table.
 */
async function addProductType() {
    await ptmanager.addProductType();
}

/**
 * Delete a value from the product types enumeration and refresh the product types table.
 */
async function deleteProductType() {
    await ptmanager.deleteProductType();
}


/**
 * Delete a value from the product types enumeration and refresh the product types table.
 */
async function updateProductType() {
    await ptmanager.updateProductType();
}


/**
 * Create a table for displaying product types.
 * @param {ProductType[]} productTypes - Array of ProductType objects.
 * @returns {HTMLTableElement} The HTML table element.
 */
export function createProductTypesTable(productTypes) {
    const productTypeNames = productTypes.map(productType => productType._name);
    console.log(productTypeNames);
    const table = document.createElement("table");
    table.classList.add("product-types-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.textContent = "Product Types";
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    productTypeNames.forEach(productTypeName => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = productTypeName;
        row.appendChild(cell);
        tbody.appendChild(row);
    });

    const actionRow = document.createElement("tr");
    const buttonCell = document.createElement("td");

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.addEventListener("click", addProductType);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", deleteProductType);

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", updateProductType);

    buttonCell.appendChild(addButton);
    buttonCell.appendChild(deleteButton);
    buttonCell.appendChild(updateButton);

    actionRow.appendChild(buttonCell);
    tbody.appendChild(actionRow);

    table.appendChild(tbody);

    console.log("Product types table created");
    return table;
}

/**
 * Refresh the product types table in the UI.
 */
export function refreshProductTypesTable() {
    const productTypesContainer = document.querySelector(".productTypes");
    while (productTypesContainer.firstChild) {
        productTypesContainer.removeChild(productTypesContainer.firstChild);
    }

    const productTypesTable = createProductTypesTable(ptmanager.productTypes);
    productTypesContainer.appendChild(productTypesTable);
}

/*---------------------------------------------------------------- Product Types ----------------------------------------------------------------*/
/**
 * Add a new product and refresh the menu table.
 */
export async function addProduct() {
    await pmanager.addProduct();
    menu.refreshTable();
}

/**
 * Add a new product and refresh the menu table.
 */
export async function deleteProduct(name) {
    await pmanager.deleteProduct(name);
    menu.refreshTable();
}

/**
 * Add a new product and refresh the menu table.
 */
export async function editProduct(name) {
    await pmanager.updateProduct(name);
    menu.refreshTable();
}

