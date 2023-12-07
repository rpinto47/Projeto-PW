class Enumerate {
    constructor(...values) {
        this.enumeration = Object.freeze(
            values.reduce((acc, value) => {
                acc[value] = value;
                return acc;
            }, {})
        );
    }

    get values() {
        return Object.values(this.enumeration);
    }

    isValid(value) {
        return this.values.includes(value);
    }
}

const ProductTypes = new Enumerate('Entradas', 'Prato Principal', 'Sobremesa', 'Bebida');

class Products {
    constructor(name = "", quantity = 0, price = 0.0, productType = "") {
        this.name = String(name);
        this.quantity = parseInt(quantity);
        this.price = parseFloat(price);

        if (!ProductTypes.isValid(productType)) {
            throw new Error(`Invalid product type: ${productType}`);
        } else {
            this.productType = productType;
        }
    }
}

class TableOrder {
    constructor(table) {
        this.table = table;
        this.tableOrderElement = this.createTableOrderElement();
    }

    createTableOrderElement() {
        const tableOrderDiv = document.createElement("div");
        tableOrderDiv.classList.add("tableOrder");
        tableOrderDiv.id = "tableOrder";

        const navElement = document.createElement("nav");

        const createButton = document.createElement("button");
        createButton.textContent = "Create";
        createButton.addEventListener("click", () => this.addProduct());
        navElement.appendChild(createButton);

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

    addProduct(product) {
        const productsDiv = this.tableOrderElement.querySelector('#products');
        productsDiv.appendChild(product.toTr());
    }

    removeProduct(productName) {
        const productsDiv = this.tableOrderElement.querySelector('#products');
        const productToRemove = productsDiv.querySelector(`td:first-child:contains(${productName})`);

        if (productToRemove) {
            productToRemove.parentNode.remove();
        }
    }

    close() {
        console.log('Closing table order');
        const tableOrderDiv = document.getElementById('tableOrder');
        if (tableOrderDiv) {
            tableOrderDiv.style.display = 'none';
        }
    }
}

class Menu {
    constructor() {
        this.products = [];
        this.menuDisplayed = false; // Added property to track menu display
    }

    addProduct(product) {
        this.products.push(product);
    }

    removeProduct(product) {
        this.products.splice(this.products.indexOf(product), 1);
    }

    displayMenu() {
        const menuDiv = document.querySelector('.menu');

        if (!menuDiv) {
            console.error("Menu div not found.");
            return;
        }

        if (this.menuDisplayed) {
            alert("Menu is already displayed.");
            return;
        } else {
            const menuContainer = document.createElement('div');
            menuContainer.classList.add('menu-container');
            menuContainer.style.textAlign = "center";

            const heading = document.createElement('h3');
            heading.textContent = "Products List";

            const menuTable = document.createElement('table');

            // First row
            const selectProductRow = document.createElement('tr');
            selectProductRow.classList.add('menu-row');

            const productTextCell = document.createElement('td');
            productTextCell.textContent = "Product";
            productTextCell.classList.add('menu-cell');

            const productSelectCell = document.createElement('td');
            productSelectCell.classList.add('menu-cell');

            const menuSelect = document.createElement("select");
            menuSelect.classList.add("menu-select");

            const defaultOption = document.createElement("option");
            defaultOption.text = "Select a product";
            menuSelect.add(defaultOption);

            this.products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.name;
                option.text = `${product.name} - ${product.price} €`;
                menuSelect.add(option);
            });

            menuSelect.addEventListener("change", (event) => {
                const selectedProductName = event.target.value;
                console.log(selectedProductName);
            });

            productSelectCell.appendChild(menuSelect);

            selectProductRow.appendChild(productTextCell);
            selectProductRow.appendChild(productSelectCell);
            menuTable.appendChild(selectProductRow);

            // Second row
            const quantityRow = document.createElement('tr');
            quantityRow.classList.add('menu-row');
            quantityRow.style.display = 'flex';
            quantityRow.style.justifyContent = 'center';

            const quantityTextCell = document.createElement('td');
            quantityTextCell.textContent = "Quantity";
            quantityTextCell.classList.add('menu-cell');

            const quantitySelectCell = document.createElement('td');
            quantitySelectCell.classList.add('menu-cell');

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = 1; // Set a minimum value if needed
            quantitySelectCell.appendChild(quantityInput);




            const saveButton = document.createElement("button");
            saveButton.classList.add('menu-buttons');
            saveButton.textContent = "Save";
            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.classList.add('menu-buttons');

            const buttonsRow = document.createElement("tr");

            const cancelButtonCell = document.createElement("td");
            cancelButtonCell.classList.add('menu-cell');
            cancelButtonCell.appendChild(cancelButton);

            const saveButtonCell = document.createElement("td");
            saveButtonCell.classList.add('menu-cell');
            saveButtonCell.appendChild(saveButton);




            quantityRow.appendChild(quantityTextCell);
            quantityRow.appendChild(quantitySelectCell);
            menuTable.appendChild(quantityRow);



            buttonsRow.appendChild(saveButtonCell);
            buttonsRow.appendChild(cancelButtonCell);
            menuTable.appendChild(buttonsRow);

            menuContainer.appendChild(heading);
            menuContainer.appendChild(menuTable);




            menuDiv.textContent = "";
            menuDiv.appendChild(menuContainer);

            // Set the display property of the menuDiv to "block"
            menuDiv.style.display = "block";

            // Display flag
            this.menuDisplayed = true;
        }
    }


}
const menu = new Menu();



class Table {
    constructor(number) {
        this.number = number;
        this.products = [];
        this.tableOrder = new TableOrder(this);
        this.tableElement = this.createTableElement();
        this.hideTableOrder();
    }

    hideTableOrder() {
        if (this.tableOrder && this.tableOrder.tableOrderElement) {
            this.tableOrder.tableOrderElement.style.display = 'none';
        }
    }

    createTableElement() {
        const tableElement = document.createElement('div');
        tableElement.className = 'table';
        tableElement.textContent = 'Table ' + this.number;
        tableElement.addEventListener('click', () => this.showDetails());
        document.querySelector('.tables').appendChild(tableElement);

        return tableElement;
    }

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
                    row.classList.add('product-row', 'selectable');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = product.name;
                    nameCell.classList.add('product-cell');
                    row.appendChild(nameCell);

                    const quantityCell = document.createElement('td');
                    quantityCell.textContent = product.quantity;
                    quantityCell.classList.add('product-cell');
                    row.appendChild(quantityCell);

                    const priceCell = document.createElement('td');
                    priceCell.textContent = `${product.price} €`;
                    priceCell.classList.add('product-cell');
                    row.appendChild(priceCell);

                    table.appendChild(row);
                });

                const buttonsRow = document.createElement('tr');
                const createButtonCell = document.createElement('td');
                const removeButtonCell = document.createElement('td');
                const editButtonCell = document.createElement('td');
                const closeButtonCell = document.createElement('td');

                const createButton = document.createElement("button");
                createButton.textContent = "Create";
                createButton.addEventListener("click", () => menu.displayMenu());
                createButtonCell.appendChild(createButton);

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.addEventListener("click", () => this.removeProduct());
                removeButtonCell.appendChild(removeButton);

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => this.editProduct());
                editButtonCell.appendChild(editButton);

                const closeButton = document.createElement("button");
                closeButton.textContent = "Close";
                closeButton.addEventListener("click", () => this.close());
                closeButtonCell.appendChild(closeButton);

                buttonsRow.appendChild(createButtonCell);
                buttonsRow.appendChild(removeButtonCell);
                buttonsRow.appendChild(editButtonCell);
                buttonsRow.appendChild(closeButtonCell);

                createButton.className = "tableOrderButton";
                removeButton.className = "tableOrderButton";
                editButton.className = "tableOrderButton";
                closeButton.className = "tableOrderButton";
                createButtonCell.className = "buttonCell";
                removeButtonCell.className = "buttonCell";
                editButtonCell.className = "buttonCell";
                closeButtonCell.className = "buttonCell";

                table.appendChild(buttonsRow);
                tableOrderDiv.appendChild(table);


                tableOrderDiv.style.display = 'block';
            }
        } else {
            this.tableElement.classList.remove('selected');
            tableOrderDiv.style.display = 'none';
        }
    }

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