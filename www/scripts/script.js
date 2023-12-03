/**
 * Represents a product.
 * @class
 */
class Products {
    /**
     * @constructor
     * @param {string} [name=""] - The name of the product.
     * @param {number} [quantity=0] - The quantity of the product.
     * @param {number} [price=0.0] - The price of the product.
     */
    constructor(name = "", quantity = 0, price = 0.0) {
        this.name = String(name);
        this.quantity = parseInt(quantity);
        this.price = parseFloat(price);
    }
}

/**
 * Represents a table order.
 * @class
 */
class TableOrder {
    /**
     * @constructor
     * @param {Table} table - The table associated with the order.
     */
    constructor(table) {
        this.table = table;
        this.tableOrderElement = this.createTableOrderElement();
    }

    /**
     * Creates the table order element.
     * @returns {HTMLDivElement} - The table order element.
     */
    createTableOrderElement() {
        const tableOrderDiv = document.createElement("div");
        tableOrderDiv.classList.add("tableOrder");
        tableOrderDiv.id = "tableOrder";

        const navElement = document.createElement("nav");

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.addEventListener("click", () => this.addProduct());
        navElement.appendChild(addButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => this.removeProduct());
        navElement.appendChild(removeButton);

        const productsDiv = document.createElement("div");
        productsDiv.id = "products";

        tableOrderDiv.appendChild(navElement);
        tableOrderDiv.appendChild(productsDiv);

        document.querySelector('.tableOrder').appendChild(tableOrderDiv);

        return tableOrderDiv;
    }

    /**
     * Adds a product to the table order.
     * @param {Products} product - The product to be added.
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
     * Closes the table order.
     */
    close() {
        console.log('Closing table order');
        const tableOrderDiv = document.getElementById('tableOrder');
        if (tableOrderDiv) {
            tableOrderDiv.style.display = 'none';
        }
    }
}

/**
 * Represents a menu.
 * @class
 */
class Menu {
    constructor() {
        this.products = [];
    }

    /**
     * Adds a product to the menu.
     * @param {Products} product - The product to be added.
     */
    addProduct(product) {
        this.products.push(product);
    }

    /**
     * Removes a product from the menu.
     * @param {Products} product - The product to be removed.
     */
    removeProduct(product) {
        this.products.splice(this.products.indexOf(product), 1);
    }

    /**
     * Displays the menu.
     */
    displayMenu() {
        const menuDiv = document.querySelector('.menu');
        const menuTable = document.createElement("table");
        menuTable.classList.add("menu-table");

        const menuTableHead = document.createElement("thead");
        const menuTableBody = document.createElement("tbody");

        const headerRow = document.createElement("tr");
        headerRow.classList.add("header-row");

        const productNameHeader = document.createElement("th");
        productNameHeader.textContent = "Product";
        headerRow.appendChild(productNameHeader);

        const productDescriptionHeader = document.createElement("th");
        productDescriptionHeader.textContent = "Description";
        headerRow.appendChild(productDescriptionHeader);

        const productPriceHeader = document.createElement("th");
        productPriceHeader.textContent = "Price";
        headerRow.appendChild(productPriceHeader);

        menuTableHead.appendChild(headerRow);

        this.products.forEach(product => {
            const productRow = document.createElement("tr");
            productRow.classList.add("product-row", "selectable");

            const tdName = document.createElement("td");
            tdName.textContent = product.name;
            productRow.appendChild(tdName);

            const tdCategory = document.createElement("td");
            tdCategory.textContent = product.category;
            productRow.appendChild(tdCategory);

            const tdPrice = document.createElement("td");
            tdPrice.textContent = product.price + " €";
            productRow.appendChild(tdPrice);

            menuTableBody.appendChild(productRow);

            tdName.className = "tdMenu";
            tdCategory.className = "tdMenu";
            tdPrice.className = "tdMenu";
        });

        productNameHeader.className = "menu-header";
        productDescriptionHeader.className = "menu-header";
        productPriceHeader.className = "menu-header";

        menuTable.appendChild(menuTableHead);
        menuTable.appendChild(menuTableBody);

        menuDiv.appendChild(menuTable);
    }
}

/**
 * Represents a table.
 * @class
 */
class Table {
    /**
     * @constructor
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
     * Hides the table order initially.
     */
    hideTableOrder() {
        if (this.tableOrder && this.tableOrder.tableOrderElement) {
            this.tableOrder.tableOrderElement.style.display = 'none';
        }
    }

    /**
     * Creates the table element.
     * @returns {HTMLDivElement} - The table element.
     */
    createTableElement() {
        const tableElement = document.createElement('div');
        tableElement.className = 'table';
        tableElement.textContent = 'Table ' + this.number;
        tableElement.addEventListener('click', () => this.showDetails());
        document.querySelector('.tables').appendChild(tableElement);

        return tableElement;
    }

    /**
     * Shows the details of the table.
     */
    showDetails() {
        const tableOrderDiv = document.querySelector('.tableOrder');
        const isSelected = this.tableElement.classList.contains('selected');

        document.querySelectorAll('.table').forEach(tableElement => {
            tableElement.classList.remove('selected');
        });

        if (!isSelected) {
            this.tableElement.classList.add('selected');
            while (tableOrderDiv.firstChild) {
                tableOrderDiv.removeChild(tableOrderDiv.firstChild);
            }

            if (this.tableOrder) {
                const heading = document.createElement('h3');
                heading.textContent = `Table ${this.number} Details`;
                tableOrderDiv.appendChild(heading);

                const table = document.createElement('table');
                const headerRow = document.createElement('tr');

                const productHeader = document.createElement('th');
                productHeader.textContent = 'Product';
                headerRow.appendChild(productHeader);

                const quantityHeader = document.createElement('th');
                quantityHeader.textContent = 'Quantity';
                headerRow.appendChild(quantityHeader);

                const priceHeader = document.createElement('th');
                priceHeader.textContent = 'Price';
                headerRow.appendChild(priceHeader);

                table.appendChild(headerRow);

                this.products.forEach(product => {
                    const row = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = product.name;
                    row.appendChild(nameCell);

                    const quantityCell = document.createElement('td');
                    quantityCell.textContent = product.quantity;
                    row.appendChild(quantityCell);

                    const priceCell = document.createElement('td');
                    priceCell.textContent = `${product.price} €`;
                    row.appendChild(priceCell);

                    table.appendChild(row);
                });

                const buttonsRow = document.createElement('tr');
                const addButtonCell = document.createElement('td');
                const removeButtonCell = document.createElement('td');
                const createButtonCell = document.createElement('td');
                const closeButtonCell = document.createElement('td');

                const addButton = document.createElement("button");
                addButton.textContent = "Add";
                addButton.addEventListener("click", () => this.addProduct());
                addButtonCell.appendChild(addButton);

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.addEventListener("click", () => this.removeProduct());
                removeButtonCell.appendChild(removeButton);

                const createButton = document.createElement("button");
                createButton.textContent = "Create";
                createButton.addEventListener("click", () => this.removeProduct());
                createButtonCell.appendChild(createButton);

                const closeButton = document.createElement("button");
                closeButton.textContent = "Close";
                closeButton.addEventListener("click", () => this.close());
                closeButtonCell.appendChild(closeButton);

                buttonsRow.appendChild(addButtonCell);
                buttonsRow.appendChild(removeButtonCell);
                buttonsRow.appendChild(createButtonCell);
                buttonsRow.appendChild(closeButtonCell);

                addButton.className = "tableOrderButton";
                removeButton.className = "tableOrderButton";
                createButton.className = "tableOrderButton";
                closeButton.className = "tableOrderButton";
                addButtonCell.className = "buttonCell";
                removeButtonCell.className = "buttonCell";
                createButtonCell.className = "buttonCell";
                closeButtonCell.className = "buttonCell";

                table.appendChild(buttonsRow);
                tableOrderDiv.appendChild(table);

                const total = this.getTotal();
                const totalParagraph = document.createElement('p');
                totalParagraph.textContent = `Total: ${total} €`;
                tableOrderDiv.appendChild(totalParagraph);

                tableOrderDiv.style.display = 'block';
            } else {
                this.tableElement.classList.remove('selected');
                tableOrderDiv.style.display = 'none';
            }
        }
    }

    /**
     * Adds a product to the table.
     */
    addProduct() {
        const productName = prompt("Enter the product name:");
        const quantity = parseInt(prompt("Enter the quantity:"));
        const price = parseFloat(prompt("Enter the price:"));

        if (productName && !isNaN(quantity) && !isNaN(price)) {
            const newProduct = new Products(productName, quantity, price);
            this.products.push(newProduct);
            this.showDetails();
            this.tableOrder.addProduct(newProduct);
            this.displayProducts();
        } else {
            alert("Invalid input. Please enter valid values.");
        }
    }

    /**
     * Removes a product from the table.
     */
    removeProduct() {
        const productName = prompt("Enter the product name to remove:");
        const index = this.products.findIndex(product => product.name === productName);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.showDetails();
            this.tableOrder.removeProduct(productName);
        } else {
            alert("Product not found.");
        }
    }

    /**
    * Displays the list of products in the .products div.
    */
    displayProducts() {
        const menuView = document.querySelector(".products");
        menuView.textContent = '';

        const heading = document.createElement('h3');
        heading.textContent = "Products List";
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

/**
 * Adds tables to the document based on user input.
 */
function addTables() {
    const numberOfTables = prompt("Enter the number of tables you want:", "20");

    if (numberOfTables !== null) {
        const parsedNumber = parseInt(numberOfTables);

        if (!isNaN(parsedNumber) && parsedNumber > 0) {
            document.querySelector('.tables').innerHTML = '';

            for (let i = 1; i <= parsedNumber; i++) {
                new Table(i);
            }

            document.querySelector('.tableOrder').style.display = 'block';
            document.querySelector('.menu').style.display = 'block';
        } else {
            alert("Invalid input. Please enter a positive integer.");
        }
    }

    const product1 = new Products("Product 1", 10, 5.99);
    const product2 = new Products("Product 2", 8, 7.49);
    const product3 = new Products("Product 3", 15, 3.99);

    const menu = new Menu();

    menu.addProduct(product1);
    menu.addProduct(product2);
    menu.addProduct(product3);

    const product4 = new Products("Product 4", 12, 8.99);
    const product5 = new Products("Product 5", 6, 12.49);
    const product6 = new Products("Product 6", 20, 2.99);

    const product7 = new Products("Product 7", 14, 6.99);
    const product8 = new Products("Product 8", 5, 9.49);
    const product9 = new Products("Product 9", 18, 4.99);

    menu.addProduct(product1);
    menu.addProduct(product2);
    menu.addProduct(product3);
    menu.addProduct(product4);
    menu.addProduct(product5);
    menu.addProduct(product6);
    menu.addProduct(product7);
    menu.addProduct(product8);
    menu.addProduct(product9);

    menu.displayMenu();
}
