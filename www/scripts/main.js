import { addTables, showTables, showMenu, showProductTypesTable, populateMenu } from "./functions.js";
import { ProductManager, ProductTypeManager } from "./managers.js";
import { createProductTypesTable } from "./functions.js";
const ptmanager= new ProductTypeManager();
const pmanager = new ProductManager();


setTimeout(() => {populateMenu();
}, 500);

const tablesDiv = document.querySelector(".tables");
const addButton = document.createElement("button");

addButton.textContent = "Add Tables";
addButton.addEventListener("click", addTables);
addButton.classList.add("add-tables-button");
tablesDiv.appendChild(addButton);

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


export { ptmanager, pmanager };