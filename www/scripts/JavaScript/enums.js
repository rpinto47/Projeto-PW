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
    addValue() {
        const newValue = prompt('Enter a new value to add:');
        if (newValue && !this.isValid(newValue)) {
            this.enumeration = Object.freeze({ ...this.enumeration, [newValue]: newValue });
        } else if (this.isValid(newValue)) {
            alert('Value already exists in the enumeration.');
        } else {
            alert('Invalid input. Please enter a non-empty value.');
        }
    }

    /**
     * Delete a value from the enumeration.
     */
    deleteValue() {
        const valueToDelete = prompt('Enter a value to delete:');
        if (valueToDelete && this.isValid(valueToDelete)) {
            const updatedEnumeration = { ...this.enumeration };
            delete updatedEnumeration[valueToDelete];
            this.enumeration = Object.freeze(updatedEnumeration);
        } else if (!valueToDelete) {
            alert('Invalid input. Please enter a non-empty value.');
        } else {
            alert('Value does not exist in the enumeration.');
        }
    }
}

/**
 * An instance of Enumerate for product types.
 * @const {Enumerate}
 */
const ProductTypes = new Enumerate('Entrada', 'Prato', 'Sobremesa', 'Bebida');

/**
 * Add a new value to the product types enumeration and refresh the product types table.
 */
function addValue() {
    ProductTypes.addValue();
    refreshProductTypesTable();
}

/**
 * Delete a value from the product types enumeration and refresh the product types table.
 */
function deleteValue() {
    ProductTypes.deleteValue();
    refreshProductTypesTable();
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
