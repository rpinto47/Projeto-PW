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

    /**
     * Converts the product to a table row element.
     * @returns {HTMLTableRowElement} - The table row element representing the product.
     */
    toTr() {
        const trElement = document.createElement("tr");
        trElement.classList.add("selectable");

        const tdName = document.createElement("td");
        tdName.textContent = this.name;
        trElement.appendChild(tdName);

        const tdQuantity = document.createElement("td");
        tdQuantity.textContent = this.quantity;
        trElement.appendChild(tdQuantity);

        const tdPrice = document.createElement("td");
        tdPrice.textContent = this.price + " €";
        trElement.appendChild(tdPrice);

        return trElement;
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

        // Create a navigation element
        const navElement = document.createElement("nav");

        // Button for adding a product
        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.addEventListener("click", () => this.addProduct());
        navElement.appendChild(addButton);

        // Button for removing a product
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => this.removeProduct());
        navElement.appendChild(removeButton);

        const productsDiv = document.createElement("div");
        productsDiv.id = "products";

        tableOrderDiv.appendChild(navElement);
        tableOrderDiv.appendChild(productsDiv);

        // Append tableOrderDiv to the DOM
        document.querySelector('.tableOrder').appendChild(tableOrderDiv);

        return tableOrderDiv;
    }




    /**
     * Creates a navigation link.
     * @param {string} text - The text content of the link.
     * @param {Table} table - The associated table.
     * @param {string} functionName - The name of the function to be called on link click.
     * @returns {HTMLAnchorElement} - The navigation link element.
     */
    createNavLink(text, table, functionName) {
        const link = document.createElement("a");
        link.classList.add("link");
        link.href = `javascript: ${table}.${functionName}();`;
        link.textContent = text;
        return link;
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
        // Remove 'selected' class from all table elements
        document.querySelectorAll('.table').forEach(tableElement => {
            tableElement.classList.remove('selected');
        });

        // Add 'selected' class to the current table element
        this.tableElement.classList.add('selected');

        // Select the tableOrder div
        const tableOrderDiv = document.querySelector('.tableOrder');

        // Clear existing content in the tableOrder div
        tableOrderDiv.innerHTML = '';

        if (this.tableOrder) {
            // Create heading for table details
            const heading = document.createElement('h3');
            heading.textContent = `Table ${this.number} Details`;
            tableOrderDiv.appendChild(heading);

            // Create table element and header row
            const table = document.createElement('table');
            const headerRow = document.createElement('tr');

            // Create and append each table header cell
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

            // Iterate over products and create table rows
            this.products.forEach(product => {
                // Create a table row
                const row = document.createElement('tr');

                // Create and append the table data cells
                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = product.quantity;
                row.appendChild(quantityCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = `${product.price} €`;
                row.appendChild(priceCell);

                // Append the row to the table
                table.appendChild(row);
            });

            // Create row for buttons
            const buttonsRow = document.createElement('tr');
            const addButtonCell = document.createElement('td');
            const removeButtonCell = document.createElement('td');
            const createButtonCell = document.createElement('td');
            const closeButtonCell = document.createElement('td');

            // Button for adding a product
            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.addEventListener("click", () => this.addProduct());
            addButtonCell.appendChild(addButton);

            // Button for removing a product
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => this.removeProduct());
            removeButtonCell.appendChild(removeButton);

            // Button for creatin(?) a product
            const createButton = document.createElement("button");
            createButton.textContent = "Create";
            createButton.addEventListener("click", () => this.removeProduct());
            createButtonCell.appendChild(createButton);

            // Button for creatin(?) a product
            const closeButton = document.createElement("button");
            closeButton.textContent = "Close";
            closeButton.addEventListener("click", () => this.removeProduct());
            closeButtonCell.appendChild(closeButton);


            buttonsRow.appendChild(addButtonCell);
            buttonsRow.appendChild(removeButtonCell);
            buttonsRow.appendChild(createButtonCell);
            buttonsRow.appendChild(closeButtonCell);
            

            // Append buttons to the table
            table.appendChild(buttonsRow);

            // Add classes for styling
            addButton.className = "tableOrderButton";
            removeButton.className = "tableOrderButton";
            createButton.className = "tableOrderButton";
            closeButton.className = "tableOrderButton";
            addButtonCell.className = "buttonCell";
            removeButtonCell.className = "buttonCell";
            createButtonCell.className = "buttonCell";
            closeButtonCell.className = "buttonCell";

            // Append the table to the tableOrder div
            tableOrderDiv.appendChild(table);

            // Create and append total paragraph
            const total = this.getTotal();
            const totalParagraph = document.createElement('p');
            totalParagraph.textContent = `Total: ${total} €`;
            tableOrderDiv.appendChild(totalParagraph);

            // Display the tableOrder and orders
            tableOrderDiv.style.display = 'block';
            document.querySelector('.orders').style.display = 'block';
        } else {
            // Hide the tableOrderDiv and orders div when no table is selected
            tableOrderDiv.style.display = 'none';
            document.querySelector('.orders').style.display = 'none';
        }
    }

    /**
     * Adds a product to the table.
     */
    add() {
        const productName = prompt("Enter the product name:");
        const quantity = parseInt(prompt("Enter the quantity:"));
        const price = parseFloat(prompt("Enter the price:"));

        if (productName && !isNaN(quantity) && !isNaN(price)) {
            const newProduct = new Products(productName, quantity, price);
            this.products.push(newProduct);
            this.showDetails();
            this.tableOrder.addProduct(newProduct);
        } else {
            alert("Invalid input. Please enter valid values.");
        }
    }

    /**
     * Removes a product from the table.
     */
    remove() {
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
}




const addButton = document.createElement('button');
addButton.textContent = 'Add Tables';
addButton.addEventListener('click', addTables);
addButton.classList.add('add-tables-button');
document.querySelector('.tables').appendChild(addButton);

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
        } else {
            alert("Invalid input. Please enter a positive integer.");
        }
    }
}
