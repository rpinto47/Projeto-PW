import { Product, Table, menu } from "./classes.js";

/**
 * Adds tables based on user input.
 */
export function addTables() {
    const input = prompt("Enter the number of tables you want:", "20");
    if (input !== null) {
        const numTables = parseInt(input);
        if (!isNaN(numTables) && numTables > 0) {
            const tablesDiv = document.querySelector(".tables");
            const addButton = document.querySelector(".add-tables-button");

            tablesDiv.style.display = "flex";
            addButton.style.display = "none";

            for (let i = 1; i <= numTables; i++) {
                new Table(i);
            }
        } else {
            alert("Invalid input. Please enter a positive integer.");
        }
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
    const tablesDiv = document.querySelector(".tables");
    const tableOrderDiv = document.querySelector(".tableOrder");

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
 * Populates the menu with predefined product data.
 * @param {Object} menu - The menu object.
 */
export function populateMenu(menu) {
    let productsData = [
        ["Caesar Salad", 1, 8.99, "Entrada"],
        ["Caesar Salad", 1, 8.99, "Entrada"],
        ["Caprese Salad", 1, 9.99, "Entrada"],
        ["Bruschetta", 1, 7.49, "Entrada"],
        ["Margherita Pizza", 1, 12.99, "Prato"],
        ["Penne alla Vodka", 1, 10.99, "Prato"],
        ["Grilled Chicken Sandwich", 1, 9.99, "Prato"],
        ["Chocolate Brownie", 1, 5.99, "Sobremesa"],
        ["Tiramisu", 1, 7.99, "Sobremesa"],
        ["Cheesecake", 1, 8.49, "Sobremesa"],
        ["Coca-Cola", 1, 2.49, "Bebida"],
        ["Orange Juice", 1, 3.29, "Bebida"],
        ["Iced Tea", 1, 2.99, "Bebida"],
        ["Chicken Alfredo", 1, 11.99, "Prato"],
        ["Mango Sorbet", 1, 4.99, "Sobremesa"],
        ["Minestrone Soup", 1, 6.49, "Entrada"],
        ["Salmon Fillet", 1, 15.99, "Prato"],
        ["Tropical Smoothie", 1, 4.49, "Bebida"],
        ["New York Cheesecake", 1, 9.99, "Sobremesa"],
        ["Vegetable Spring Rolls", 1, 8.49, "Entrada"],
        ["BBQ Chicken Pizza", 1, 13.99, "Prato"],
        ["Pineapple Upside-Down Cake", 1, 7.49, "Sobremesa"],
        ["Iced Cappuccino", 1, 3.99, "Bebida"],
        ["Greek Salad", 1, 9.49, "Entrada"],
        ["Shrimp Scampi", 1, 14.99, "Prato"],
        ["Triple Chocolate Mousse", 1, 10.99, "Sobremesa"],
        ["Green Tea", 1, 2.79, "Bebida"]
    ];

    for (let data of productsData) {
        let [name, quantity, price, productType] = data;
        let product = new Product(name, quantity, price, productType);
        menu.addProduct(product);
    }
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

/*---------------------------------------------------------------- Product Types ----------------------------------------------------------------
/**
 * Fetch product data from the JSON database.
 * @param {string|null} id - Optional ID to include in the URL.
 * @returns {Promise<Array>} A promise that resolves with an array of product data.
 */
async function fetchProductTypesData(id = null) {
    try {
        const url = id ? `http://localhost:3000/product-types/${id}` : 'http://localhost:3000/product-types';
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        
        const productData = await response.json();
        return productData;
    } catch (error) {
        console.error('Error fetching product data:', error.message);
        throw error;
    }
}

/**
 * Get product types from the JSON database.
 * @param {string|null} id - Optional ID to include in the URL.
 * @returns {Promise<Enumerate>} A promise that resolves with an Enumerate instance.
 */
async function getProductTypes(id = null) {
    try {
        const productData = await fetchProductTypesData(id);
        const productTypes = new Enumerate(...productData.map(product => product.type));
        return productTypes;
    } catch (error) {
        console.error('Error getting product types:', error.message);
        throw error;
    }
}

/**
 * Add a new product type to the JSON database.
 * @param {string} newType - The new product type to add.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function addProductType(newType) {
    try {
        const response = await fetch('http://localhost:3000/product-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: newType }),
        });

        if (!response.ok) {
            throw new Error('Failed to add product type');
        }
    } catch (error) {
        console.error('Error adding product type:', error.message);
        throw error;
    }
}

/**
 * Delete a product type from the JSON database.
 * @param {string} typeToDelete - The product type to delete.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function deleteProductType(typeToDelete) {
    try {
        const response = await fetch(`http://localhost:3000/product-types?type=${typeToDelete}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete product type');
        }
    } catch (error) {
        console.error('Error deleting product type:', error.message);
        throw error;
    }
}
