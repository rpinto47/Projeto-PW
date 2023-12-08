/**
 * Enumerate class for creating enums.
 */
class Enumerate {
    /**
     * Creates an enumeration with the provided values.
     * @param {...string} values - The values to include in the enumeration.
     */
    constructor(...values) {
        // Use Object.fromEntries for a more concise code
        this.enumeration = Object.freeze(Object.fromEntries(values.map(value => [value, value])));
    }

    /**
     * Gets an array of all values in the enumeration.
     * @returns {string[]} An array of enumeration values.
     */
    get values() {
        return Object.values(this.enumeration);
    }

    /**
     * Checks if a given value is valid within the enumeration.
     * @param {string} value - The value to check for validity.
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    isValid(value) {
        return this.values.includes(value);
    }
}
const ProductTypes = new Enumerate('Entradas', 'Prato Principal', 'Sobremesa', 'Bebida');


/**
 * Represents a product with name, quantity, price, and product type.
 */
class Products {
    /**
     * Creates a new Products instance.
     * @param {string} name - The name of the product.
     * @param {number} quantity - The quantity of the product.
     * @param {number} price - The price of the product.
     * @param {string} productType - The type of the product.
     */
    constructor(name = "", quantity = 0, price = 0.0, productType = "") {
        this.name = String(name);
        this.quantity = parseInt(quantity);
        this.price = parseFloat(price);

        // Validate and set the product type
        if (!ProductTypes.isValid(productType)) {
            throw new Error(`Invalid product type: ${productType}`);
        } else {
            this.productType = productType;
        }
    }
}


/**
 * Represents a Table Order associated with a specific table.
 */
class TableOrder {
    /**
     * Creates a new TableOrder instance.
     * @param {Table} table - The table associated with the order.
     */
    constructor(table) {
        this.table = table;
        this.tableOrderElement = this.createTableOrderElement();
    }

    /**
     * Creates the HTML element for the table order.
     * @returns {HTMLDivElement} The created table order element.
     */
    createTableOrderElement() {
        const tableOrderDiv = document.createElement('div');
        tableOrderDiv.classList.add('tableOrder');
        tableOrderDiv.id = 'tableOrder';

        const navElement = this.createNavElement();
        const productsDiv = document.createElement('div');
        productsDiv.id = 'products';

        tableOrderDiv.appendChild(navElement);
        tableOrderDiv.appendChild(productsDiv);

        document.querySelector('.tableOrder').appendChild(tableOrderDiv);

        return tableOrderDiv;
    }

    /**
     * Creates the navigation element containing buttons.
     * @returns {HTMLElement} The created navigation element.
     */
    createNavElement() {
        const navElement = document.createElement('nav');

        const createButton = this.createButton('Create', () => this.addProduct());
        const removeButton = this.createButton('Remove', () => this.removeProduct());

        navElement.appendChild(createButton);
        navElement.appendChild(removeButton);

        return navElement;
    }

    /**
     * Creates a button element.
     * @param {string} text - The text content of the button.
     * @param {Function} clickHandler - The function to be executed on button click.
     * @returns {HTMLButtonElement} The created button element.
     */
    createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        return button;
    }

    /**
     * Adds a product to the table order.
     * @param {Product} product - The product to be added.
     */
    addProduct(product) {
        const productsDiv = this.tableOrderElement.querySelector('#products');
        productsDiv.appendChild(product.toTr());
    }

    /**
     * Removes a product from the table order.
     * @param {string} productName - The name of the product to be removed.
     */
    removeProduct(productName) {
        const productsDiv = this.tableOrderElement.querySelector('#products');
        const productToRemove = productsDiv.querySelector(`td:first-child:contains(${productName})`);

        if (productToRemove) {
            productToRemove.parentNode.remove();
        }
    }

    /**
     * Checks if the table order is currently displayed.
     * @returns {boolean} True if the table order is displayed; otherwise, false.
     */
    isDisplayed() {
        const tableOrderDiv = document.querySelector('.tableOrder');
        return tableOrderDiv.style.display !== 'none';
    }

    /**
     * Closes the details view of the table order.
     */
    closeTableOrderDetails() {
        const tableOrderDiv = document.querySelector('.tableOrder');

        if (tableOrderDiv) {
            tableOrderDiv.style.display = 'none';
        }
    }
}

/**
 * Represents a menu with product-related functionalities.
 */
class Menu {
    /**
     * Creates a new Menu instance.
     */
    constructor() {
        this.products = [];
        this.menuDisplayed = false;
    }

    /**
     * Adds a product to the menu.
     * @param {Product} product - The product to be added.
     */
    addProduct(product) {
        this.products.push(product);
    }

    /**
     * Removes a product from the menu.
     * @param {Product} product - The product to be removed.
     */
    removeProduct(product) {
        const index = this.products.indexOf(product);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }

    /**
    * Checks if the menu is currently displayed.
    * @returns {boolean} True if the menu is displayed; otherwise, false.
    */
    isDisplayed() {
        return this.menuDisplayed;
    }


    /**
     * Closes the menu.
     */
    closeMenu() {
        const menuDiv = document.querySelector('.menu');
        if (menuDiv) {
            menuDiv.style.display = 'none';
            this.menuDisplayed = false;
        } else {
            console.error('Menu div not found.');
        }
    }

    /**
     * Displays the menu with product details.
     */
    displayMenu() {
        const menuDiv = document.querySelector('.menu');

        if (!menuDiv) {
            console.error('Menu div not found.');
            return;
        }

        if (this.menuDisplayed) {
            alert('Menu is already displayed.');
            return;
        }

        const menuContainer = document.createElement('div');
        menuContainer.classList.add('menu-container');
        menuContainer.style.textAlign = 'center';

        const heading = document.createElement('h3');
        heading.textContent = 'Products List';

        const menuTable = this.createMenuTable();
        const buttonsRow = this.createButtonsRow();

        menuContainer.appendChild(heading);
        menuContainer.appendChild(menuTable);
        menuContainer.appendChild(buttonsRow);

        menuDiv.textContent = '';
        menuDiv.appendChild(menuContainer);

        menuDiv.style.display = 'block';
        this.menuDisplayed = true;
    }

    /**
     * Creates the table element for the menu.
     * @returns {HTMLTableElement} The created table element.
     */
    createMenuTable() {
        const menuTable = document.createElement('table');
        menuTable.style.width = '100%';

        menuTable.appendChild(this.createSelectProductRow());
        menuTable.appendChild(this.createQuantityRow());

        return menuTable;
    }

    /**
     * Creates a row for selecting a product in the menu.
     * @returns {HTMLTableRowElement} The created table row element.
     */
    createSelectProductRow() {
        const selectProductRow = this.createMenuRow();

        const productTextCell = this.createMenuCell('Product');
        const productSelectCell = this.createMenuCell();

        const menuSelect = this.createMenuSelect();

        productSelectCell.appendChild(menuSelect);
        selectProductRow.appendChild(productTextCell);
        selectProductRow.appendChild(productSelectCell);

        return selectProductRow;
    }

    /**
     * Creates a generic menu row.
     * @returns {HTMLTableRowElement} The created table row element.
     */
    createMenuRow() {
        const menuRow = document.createElement('tr');
        menuRow.classList.add('menu-row');
        return menuRow;
    }

    /**
     * Creates a cell for the menu with optional text content.
     * @param {string} text - The text content for the cell.
     * @returns {HTMLTableCellElement} The created table cell element.
     */
    createMenuCell(text) {
        const menuCell = document.createElement('td');
        menuCell.classList.add('menu-cell');
        if (text) {
            menuCell.textContent = text;
        }
        return menuCell;
    }

    /**
     * Creates a select element for choosing a product.
     * @returns {HTMLSelectElement} The created select element.
     */
    createMenuSelect() {
        const menuSelect = document.createElement('select');
        menuSelect.classList.add('menu-select');

        const defaultOption = document.createElement('option');
        defaultOption.text = 'Select a product';
        menuSelect.add(defaultOption);

        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.text = `${product.name} - ${product.price} €`;
            menuSelect.add(option);
        });

        menuSelect.addEventListener('change', (event) => {
            const selectedProductName = event.target.value;
            console.log(selectedProductName);
        });

        return menuSelect;
    }

    /**
     * Creates a row for inputting product quantity.
     * @returns {HTMLTableRowElement} The created table row element.
     */
    createQuantityRow() {
        const quantityRow = this.createMenuRow();
        quantityRow.style.display = 'flex';
        quantityRow.style.justifyContent = 'center';

        const quantityTextCell = this.createMenuCell('Quantity');
        const quantitySelectCell = this.createMenuCell();

        const quantityInput = this.createQuantityInput();
        quantitySelectCell.appendChild(quantityInput);

        quantityRow.appendChild(quantityTextCell);
        quantityRow.appendChild(quantitySelectCell);

        return quantityRow;
    }

    /**
     * Creates an input element for specifying product quantity.
     * @returns {HTMLInputElement} The created input element.
     */
    createQuantityInput() {
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 1;
        return quantityInput;
    }

    /**
     * Creates a row containing buttons for saving and canceling.
     * @returns {HTMLTableRowElement} The created table row element.
     */
    createButtonsRow() {
        const buttonsRow = this.createMenuRow();

        const saveButton = this.createButton('Save');
        const cancelButton = this.createButton('Cancel', () => this.closeMenu());

        const saveButtonCell = this.createMenuCell();
        saveButtonCell.appendChild(saveButton);

        const cancelButtonCell = this.createMenuCell();
        cancelButtonCell.appendChild(cancelButton);

        buttonsRow.appendChild(saveButtonCell);
        buttonsRow.appendChild(cancelButtonCell);

        return buttonsRow;
    }

    /**
     * Creates a button element.
     * @param {string} text - The text content of the button.
     * @param {Function} clickHandler - The function to be executed on button click.
     * @returns {HTMLButtonElement} The created button element.
     */
    createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        if (clickHandler) {
            button.addEventListener('click', clickHandler);
        }
        button.classList.add('menu-buttons');
        return button;
    }
}

const menu = new Menu();

/**
 * Represents a table with associated products and order details.
 */
class Table {
    /**
     * Creates a new Table instance.
     * @param {number} number - The table number.
     */
    constructor(number) {
        this.number = number;
        this.products = [];
        this.tableOrder = new TableOrder(this);
        this.tableElement = this.createTableElement();
        this.hideTableOrder();
    }

    /**
     * Hides the table order element.
     */
    hideTableOrder() {
        const tableOrderElement = this.tableOrder?.tableOrderElement;
        if (tableOrderElement) {
            tableOrderElement.style.display = 'none';
        }
    }

    /**
     * Creates the HTML element for the table.
     * @returns {HTMLDivElement} The created table element.
     */
    createTableElement() {
        const tableElement = document.createElement('div');
        tableElement.className = 'table';
        tableElement.textContent = `Table ${this.number}`;
        tableElement.addEventListener('click', () => this.showDetails());
        document.querySelector('.tables').appendChild(tableElement);
        return tableElement;
    }

    /**
     * Creates the header row for the product table.
     * @returns {HTMLTableRowElement} The created table header row.
     */
    createTableHeader() {
        const headers = ['Product', 'Quantity', 'Price'];
        const headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        return headerRow;
    }

    /**
     * Creates a table row for a product.
     * @param {Product} product - The product to be displayed.
     * @returns {HTMLTableRowElement} The created table row.
     */
    createProductRow(product) {
        const row = document.createElement('tr');
        row.classList.add('product-row', 'selectable');

        ['name', 'quantity', 'price'].forEach(propertyName => {
            const cell = document.createElement('td');
            const cellContent = propertyName === 'price' ? `${product[propertyName]} €` : product[propertyName];
            cell.textContent = cellContent;
            cell.classList.add('product-cell');
            row.appendChild(cell);
        });

        return row;
    }

    /**
     * Creates a button element.
     * @param {string} text - The text content of the button.
     * @param {Function} clickHandler - The function to be executed on button click.
     * @returns {HTMLButtonElement} The created button element.
     */
    createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        return button;
    }

    /**
 * Displays the details of the table, including products and order information.
 */
    showDetails() {
        const tableOrderDiv = document.querySelector('.tableOrder');
        const isSelected = this.tableElement.classList.contains('selected');

        document.querySelectorAll('.table').forEach(tableElement => {
            tableElement.classList.remove('selected');
        });

        if (!isSelected) {
            this.tableElement.classList.add('selected');
            tableOrderDiv.replaceChildren();

            if (this.tableOrder) {
                const heading = document.createElement('h3');
                heading.textContent = `Table ${this.number} Details`;
                heading.style.textAlign = 'center';
                tableOrderDiv.appendChild(heading);

                const table = document.createElement('table');
                table.appendChild(this.createTableHeader());

                this.products.forEach(product => {
                    table.appendChild(this.createProductRow(product));
                });

                const buttonsRow = document.createElement('tr');
                ['Create', 'Remove', 'Edit', 'Close'].forEach(buttonText => {
                    const buttonCell = document.createElement('td');
                    const clickHandler = buttonText === 'Create' ? () => menu.displayMenu() :
                        buttonText === 'Remove' ? () => this.removeProduct() :
                            buttonText === 'Edit' ? () => this.editProduct() :
                                () => {
                                    tableOrderDiv.replaceChildren();
                                    this.tableElement.classList.remove('selected');
                                    tableOrderDiv.classList.remove('selected');
                                    tableOrderDiv.style.display = 'none';
                                    if (menu.isDisplayed()) {
                                        menu.closeMenu();
                                    }
                                };

                    const button = this.createButton(buttonText, clickHandler);
                    buttonCell.appendChild(button);
                    buttonsRow.appendChild(buttonCell);
                });

                buttonsRow.querySelectorAll('button').forEach(button => {
                    button.className = 'tableOrderButton';
                });

                buttonsRow.querySelectorAll('td').forEach(cell => {
                    cell.className = 'buttonCell';
                });

                table.appendChild(buttonsRow);
                tableOrderDiv.appendChild(table);
                tableOrderDiv.style.display = 'block';
            }
        } else {
            this.tableElement.classList.remove('selected');
            tableOrderDiv.style.display = 'none';
            if (menu.isDisplayed()) {
                menu.closeMenu();
            }
        }
    }

    /**
     * Adds a new product to the table.
     */
    addProduct() {
        const productName = prompt('Enter the product name:');
        const quantity = parseInt(prompt('Enter the quantity:'));
        const price = parseFloat(prompt('Enter the price:'));

        if (productName && !isNaN(quantity) && !isNaN(price)) {
            const newProduct = new Products(productName, quantity, price);
            this.products.push(newProduct);
            this.showDetails();
            this.tableOrder.addProduct(newProduct);
            this.displayProducts();
        } else {
            alert('Invalid input. Please enter valid values.');
        }
    }

    /**
     * Removes a product from the table based on user input.
     */
    removeProduct() {
        const productName = prompt('Enter the product name to remove:');
        const index = this.products.findIndex(product => product.name === productName);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.showDetails();
            this.tableOrder.removeProduct(productName);
        } else {
            alert('Product not found.');
        }
    }

    /**
     * Displays the list of products in a separate view.
     */
    displayProducts() {
        const menuView = document.querySelector('.products');
        menuView.textContent = '';

        const heading = document.createElement('h3');
        heading.textContent = 'Products List';
        menuView.appendChild(heading);

        const productList = document.createElement('ul');

        this.products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.name} - Quantity: ${product.quantity}, Price: ${product.price} €`;
            productList.appendChild(listItem);
        });

        menuView.appendChild(productList);
    }
}




const tablesDiv = document.querySelector('.tables');

const addButton = document.createElement('button');
addButton.textContent = 'Add Tables';
addButton.addEventListener('click', addTables);
addButton.classList.add('add-tables-button');
tablesDiv.appendChild(addButton);

document.querySelector('.tableOrder').style.display = 'none';
document.querySelector('.menu').style.display = 'none';

function addTables() {
    const numberOfTables = prompt("Enter the number of tables you want:", "20");

    if (numberOfTables !== null) {
        const parsedNumber = parseInt(numberOfTables);

        if (!isNaN(parsedNumber) && parsedNumber > 0) {
            document.querySelector('.tables');
            addButton.style.display = 'none';

            for (let i = 1; i <= parsedNumber; i++) {
                new Table(i);
            }
        } else {
            alert("Invalid input. Please enter a positive integer.");
        }
    }
}



const product1 = new Products("Caesar Salad", 1, 8.99, "Entradas");
const product2 = new Products("Margherita Pizza", 1, 12.99, "Prato Principal");
const product3 = new Products("Chocolate Brownie", 1, 5.99, "Sobremesa");
const product4 = new Products("Coca-Cola", 1, 2.49, "Bebida");
const product5 = new Products("Grilled Chicken Sandwich", 1, 9.99, "Prato Principal");
const product6 = new Products("Apple Pie", 1, 6.99, "Sobremesa");

menu.addProduct(product1);
menu.addProduct(product2);
menu.addProduct(product3);
menu.addProduct(product4);
menu.addProduct(product5);
menu.addProduct(product6);