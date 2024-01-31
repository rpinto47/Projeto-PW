/**
 * Enumerate class for creating enums.
 * @class
 */
class Enumerate {
    /**
     * Create an instance of Enumerate.
     * @param {...string} values - The values to be included in the enumeration.
     * @throws {Error} Throws an error if duplicate values are provided.
     */
    constructor(...values) {
        const uniqueValues = [...new Set(values)];

        if (uniqueValues.length !== values.length) {
            throw new Error('Duplicate values are not allowed in the enumeration.');
        }

        /**
         * The frozen enumeration object.
         * @type {Object}
         */
        this.enumeration = Object.freeze(Object.fromEntries(uniqueValues.map(value => [value, value])));
    }

    /**
     * Get an array of values in the enumeration.
     * @returns {string[]} Array of values in the enumeration.
     */
    get values() {
        return Object.values(this.enumeration);
    }

    /**
     * Check if a value is valid in the enumeration.
     * @param {string} value - The value to check.
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    isValid(value) {
        return this.values.includes(value);
    }

    /**
     * Add a new value to the enumeration.
     */
    async addValue() {
        // Instead of using prompt, call the addProductType API function
        const newValue = prompt('Enter a new value to add:');
        if (newValue && !this.isValid(newValue)) {
            try {
                await Enumerate.addProductType(newValue);
                refreshProductTypesTable();
            } catch (error) {
                console.error('Error adding product type:', error.message);
            }
        } else if (this.isValid(newValue)) {
            alert('Value already exists in the enumeration.');
        } else {
            alert('Invalid input. Please enter a non-empty value.');
        }
    }

    /**
     * Delete a value from the enumeration.
     */
    async deleteValue() {
        // Instead of using prompt, call the deleteProductType API function
        const valueToDelete = prompt('Enter a value to delete:');
        if (valueToDelete && this.isValid(valueToDelete)) {
            try {
                await Enumerate.deleteProductType(valueToDelete);
                refreshProductTypesTable();
            } catch (error) {
                console.error('Error deleting product type:', error.message);
            }
        } else if (!valueToDelete) {
            alert('Invalid input. Please enter a non-empty value.');
        } else {
            alert('Value does not exist in the enumeration.');
        }
    }

    /**
     * Fetch product data from the JSON database.
     * @param {string|null} id - Optional ID to include in the URL.
     * @returns {Promise<Array>} A promise that resolves with an array of product data.
     */
    static async fetchProductData(id = null) {
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
    static async getProductTypes(id = null) {
        try {
            const productData = await Enumerate.fetchProductData(id);
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
    static async addProductType(newType) {
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
    static async deleteProductType(typeToDelete) {
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
}

// An instance of Enumerate for product types.
const ProductTypes = new Enumerate('Entrada', 'Prato', 'Sobremesa', 'Bebida');

/**
 * Add a new value to the product types enumeration and refresh the product types table.
 */
async function addValue() {
    await ProductTypes.addValue();
}

/**
 * Delete a value from the product types enumeration and refresh the product types table.
 */
async function deleteValue() {
    await ProductTypes.deleteValue();
}

/**
 * Refresh the product types table in the UI.
 */
function refreshProductTypesTable() {
    const productTypesContainer = document.querySelector(".productTypes");
    while (productTypesContainer.firstChild) {
        productTypesContainer.removeChild(productTypesContainer.firstChild);
    }

    const productTypesTable = createProductTypesTable(ProductTypes);
    productTypesContainer.appendChild(productTypesTable);
}

/**
 * Create a table for displaying product types.
 * @param {Enumerate} productsData - The product types enumeration.
 * @returns {HTMLTableElement} The HTML table element.
 */
function createProductTypesTable(productsData) {
    const productValues = productsData.values;
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

    productValues.forEach(productType => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = productType;
        row.appendChild(cell);
        tbody.appendChild(row);
    });

    const actionRow = document.createElement("tr");
    const buttonCell = document.createElement("td");

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.addEventListener("click", addValue);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", deleteValue);

    buttonCell.appendChild(addButton);
    buttonCell.appendChild(deleteButton);

    actionRow.appendChild(buttonCell);
    tbody.appendChild(actionRow);

    table.appendChild(tbody);

    console.log("product types table created");
    return table;
}

export { ProductTypes, createProductTypesTable };
