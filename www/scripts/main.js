import { createProductTypesTable, ProductTypes } from "./JavaScript/enums.js";
import { addTables, showTables, showMenu, showProductTypesTable } from "./JavaScript/functions.js";

const tablesDiv = document.querySelector(".tables");
const addButton = document.createElement("button");

addButton.textContent = "Add Tables";
addButton.addEventListener("click", addTables);
addButton.classList.add("add-tables-button");
tablesDiv.appendChild(addButton);

document.querySelector(".tableOrder").style.display = "none";
document.querySelector(".menu").style.display = "none";
document.querySelector(".productTypes").style.display = "none";

const productTypesTable = createProductTypesTable(ProductTypes);
const productTypesContainer = document.querySelector(".productTypes");
productTypesContainer.appendChild(productTypesTable);

document.getElementById("tablesButton").addEventListener("click", showTables);
document.getElementById("menuButton").addEventListener("click", showMenu);
document.getElementById("productTypesButton").addEventListener("click", showProductTypesTable);
