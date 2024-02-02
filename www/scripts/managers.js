import { fetchJson } from "./fetchJson.js";
import { refreshProductTypesTable } from "./functions.js";
import { ProductType, Product, menu, Table } from "./classes.js";

/**
 * Class representing a manager for handling product types.
 * @class
 */
class ProductTypeManager {
    /**
     * Creates an instance of ProductTypeManager.
     * @constructor
     */
    constructor() {
        /**
         * An array containing product type objects.
         * @type {Array<Object>}
         * @private
         */
        this.productTypes = [];
        this.getAllProductTypes();
    }
    
     /**
     * Asynchronously adds a new product type.
     * @async
     * @returns {Promise<ProductType|null>} A promise that resolves to the newly added ProductType object, or null if the operation fails.
     */
    async addProductType() {
        try {
            const name = prompt("Enter the product type name:") || "New Product";
            const isNameUnique = this.productTypes.every(type => type._name !== name);
    
            if (!isNameUnique) {
                alert('Another product type with the same name already exists. Please choose a unique name.');
                return null;
            }
    
            if (isNaN(name.trim())) {
                const id = await this.getIdByName(name);
    
                if (!id) {
                    const highestId = Math.max(...this.productTypes.map(type => type._id), 0);
                    const newId = highestId + 1;
    
                    const newProductType = new ProductType(newId, name);
    
                    let body = {
                        id: newProductType._id,
                        name: newProductType._name
                    };
    
                    const response = await fetchJson("/product-types/", "POST", body);
    
                    if (response && response.rows) {
                        this.productTypes.push(newProductType);
                        this.getAllProductTypes();
                        refreshProductTypesTable();
                        return newProductType;
                    } else {
                        console.error('Error adding product type to the database:', response.error);
                        return null;
                    }
                } else {
                    console.error('Product type with the provided name already exists.');
                    return null;
                }
            } else {
                alert('Invalid input. Name must not be a number.');
                return null;
            }
        } catch (error) {
            console.error('Error adding product type:', error.message);
            return null;
        }
    }
    
    /**
     * Asynchronously deletes a product type by name.
     * @async
     * @returns {Promise<null>} A promise that resolves to null if the operation is successful, or an error message if it fails.
     */
    async deleteProductType() {
        try {
            const nameToDelete = prompt("Enter the product type name to delete:");

            if (!nameToDelete.trim()) {
                alert('Invalid input. Name must be a non-empty string.');
                return null;
            }

            const idToDelete = await this.getIdByName(nameToDelete);

            if (idToDelete) {
                const response = await fetchJson(`/product-types/${idToDelete}`, "DELETE");

                if (response && response.rows) {
                    this.productTypes = this.productTypes.filter(type => type._id !== idToDelete);
                    this.getAllProductTypes();
                    refreshProductTypesTable();
                    console.log(`Product type "${nameToDelete}" deleted successfully.`);
                } else {
                    console.error('Error deleting product type from the database:', response.error);
                    return null;
                }
            } else {
                console.error('Product type with the provided name not found.');
                return null;
            }
        } catch (error) {
            console.error('Error deleting product type:', error.message);
            return null;
        }
    }
    
    /**
     * Asynchronously updates a product type by name.
     * @async
     * @returns {Promise<ProductType|null>} A promise that resolves to the updated ProductType object, or null if the operation fails.
     */
    async updateProductType() {
        try {
            const nameToUpdate = prompt("Enter the product type name to update:");
    
            if (!nameToUpdate.trim()) {
                alert('Invalid input. Name must be a non-empty string.');
                return null;
            }
    
            const idToUpdate = await this.getIdByName(nameToUpdate);
    
            if (idToUpdate) {
                const newName = prompt(`Enter the new name for ${nameToUpdate}:`) || nameToUpdate;
    
                if (isNaN(newName.trim())) {
                    const productTypeToUpdate = this.productTypes.find(type => type._id === idToUpdate);
    
                    if (productTypeToUpdate) {
                        productTypeToUpdate._name = newName;
    
                        let body = {
                            nameToUpdate: nameToUpdate,
                            newName: newName
                        };
    
                        const response = await fetchJson(`/product-types/${idToUpdate}`, "PUT", body);
    
                        if (response && response.rows) {
                            refreshProductTypesTable();
                            console.log(`Product type "${nameToUpdate}" updated successfully.`);
                            return productTypeToUpdate;
                        } else {
                            console.error('Error updating product type in the database:', response.error);
                            return null;
                        }
                    } else {
                        console.error('Product type with the provided _id not found.');
                        return null;
                    }
                } else {
                    alert('Invalid input. Name must not be a number.');
                    return null;
                }
            } else {
                console.error('Product type with the provided name not found.');
                return null;
            }
        } catch (error) {
            console.error('Error updating product type:', error.message);
            return null;
        }
    }
    
    
    /**
     * Asynchronously retrieves all product types from the server.
     * @async
     * @returns {Promise<Array<ProductType>|null>} A promise that resolves to an array of ProductType objects if the operation is successful, or null if it fails.
     */
    async getAllProductTypes() {
        try {
            const response = await fetchJson("/product-types/", "GET");
            console.log("resposta", response);
            if (response) {
                if (response.rows) {
                    let aux = [];

                    for (let type of response.rows) {
                        aux.push({
                            id: type.ProductTypeID,
                            name: type.TypeName
                        });
                    }
                    this.productTypes = aux.map(type => new ProductType(type.id, type.name));
                    return this.productTypes;
                } else {
                    console.error('Error: Response does not contain "rows" property:', response);
                    return null;
                }
            } else {
                console.error('Error: No response received from the server.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching product types:', error.message);
            return null;
        }
    }
    
    /**
     * Asynchronously retrieves the unique identifier of a product type by its name.
     * @async
     * @param {string} name - The name of the product type.
     * @returns {Promise<number|null>} A promise that resolves to the unique identifier if the product type is found, or null if it is not found or if an error occurs.
     */
    async getIdByName(name) {
        try {
            const foundType = this.productTypes.find(type => type.name === name);

            if (foundType) {
                return foundType._id;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error searching product types:', error.message);
            return null;
        }
    }
}


/**
 * Class representing a manager for handling products.
 * @class
 */
class ProductManager {
    /**
     * Creates an instance of ProductManager.
     * @constructor
     */
    constructor() {
        /**
         * An array containing product objects.
         * @type {Array<Object>}
         * @private
         */
        this.products = [];
        this.getAllProducts();
    }
    
     /**
     * Asynchronously adds a new product.
     * @async
     * @returns {Promise<Product|null>} A promise that resolves to the newly added Product object, or null if the operation fails.
     */
    async addProduct() {
        try {
            const name = prompt("Enter the product name:") || "New Product";
    
            const isNameUnique = this.products.every(product => product._name !== name);
    
            if (!isNameUnique) {
                alert('Another product with the same name already exists. Please choose a unique name.');
                return null;
            }
    
            const quantity = 1;
            const price = parseFloat(prompt("Enter the product price:") || 0.0);
            const productType = prompt("Enter the product type:") || "";
    
            if (!isNaN(quantity) && !isNaN(price)) {
                const id = await this.getIdByName(name);
    
                if (!id) {
                    const highestId = Math.max(...this.products.map(product => product._id), 0);
                    const newId = highestId + 1;
    
                    const newProduct = new Product(newId, name, quantity, price, productType);
    
                    let body = {
                        id: newProduct._id,
                        name: newProduct._name,
                        quantity: newProduct._quantity,
                        price: newProduct._price,
                        productType: newProduct._productType
                    };
    
                    const response = await fetchJson("/products/", "POST", body);
    
                    console.log("adicionar product", response);
    
                    if (response) {
                        if (response.rows) {
                            this.products.push(newProduct);
                            menu.refreshTable();
                            return newProduct;
                        } else {
                            console.error('Error adding product to the database:', response.error || 'Unknown error');
                            return null;
                        }
                    } else {
                        console.error('Error: No response received from the server.');
                        return null;
                    }
                } else {
                    console.error('Product with the provided name already exists.');
                    return null;
                }
            } else {
                alert('Invalid input. Quantity and price must be valid numbers.');
                return null;
            }
        } catch (error) {
            console.error('Error adding product:', error.message);
            return null;
        }
    }
    
    /**
     * Asynchronously deletes a product by name.
     * @async
     * @param {string} nameToDelete - The name of the product to delete.
     * @returns {Promise<null>} A promise that resolves to null if the operation is successful, or an error message if it fails.
     */
    async deleteProduct(nameToDelete) {
        console.log("Product name to delete:", nameToDelete);
    
        try {
            if (!nameToDelete) {
                alert('Invalid input. Name must be a non-empty string.');
                return null;
            }
    
            const productToDelete = this.products.find(product => product._name === nameToDelete);
            console.log('Product to delete:', productToDelete._id);
            if (productToDelete) {
                const response = await fetchJson(`/products/${productToDelete._id}`, "DELETE");
    
                console.log("Response from the server:", response);
    
                if (response) {
                    this.products = this.products.filter(product => product._id !== productToDelete._id);
                    console.log(`Product "${nameToDelete}" deleted successfully.`);
                    menu.refreshTable();
                    alert('Successfully deleted');
                } else {
                    console.error('Error deleting product from the database:', response.error);
                    return null;
                }
            } else {
                console.error('Product with the provided name not found.');
                return null;
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
            return null;
        }
    }

    /**
     * Asynchronously updates a product by name.
     * @async
     * @param {string} nameToUpdate - The name of the product to update.
     * @returns {Promise<Product|null>} A promise that resolves to the updated Product object, or null if the operation fails.
     */
    async updateProduct(nameToUpdate) {
        console.log("Product name to update:", nameToUpdate);
    
        try {
            if (!nameToUpdate || !nameToUpdate.trim()) {
                alert('Invalid input. Name must be a non-empty string.');
                return null;
            }
    
            const productToUpdate = this.products.find(product => product._name === nameToUpdate);
    
            if (productToUpdate) {
                const updatedName = prompt("Enter the updated product name:") || productToUpdate._name;
    
                const isNameUnique = this.products.every(product => product._name !== updatedName);
    
                if (!isNameUnique) {
                    alert('Another product with the same name already exists. Please choose a unique name.');
                    return null;
                }
    
                const updatedQuantity = parseInt(prompt("Enter the updated quantity:") || productToUpdate._quantity, 10);
                const updatedPrice = parseFloat(prompt("Enter the updated price:") || productToUpdate._price);
                const updatedProductType = prompt("Enter the updated product type:") || productToUpdate._productType;
    
                if (!isNaN(updatedQuantity) && !isNaN(updatedPrice)) {
                    const body = {
                        id: productToUpdate._id,
                        name: updatedName,
                        quantity: updatedQuantity,
                        price: updatedPrice,
                        productType: updatedProductType
                    };
    
                    const response = await fetchJson(`/products/${productToUpdate._id}`, "PUT", body);
    
                    console.log("Response from the server:", response);
    
                    if (response && response.rows) {
                        productToUpdate._name = updatedName;
                        productToUpdate._quantity = updatedQuantity;
                        productToUpdate._price = updatedPrice;
                        productToUpdate._productType = updatedProductType;
    
                        console.log(`Product "${nameToUpdate}" updated successfully.`);
                        menu.refreshTable();
                        alert('Successfully updated');
                        return productToUpdate;
                    } else {
                        console.error('Error updating product in the database:', response.error);
                        return null;
                    }
                } else {
                    alert('Invalid input. Quantity and price must be valid numbers.');
                    return null;
                }
            } else {
                console.error('Product with the provided name not found.');
                return null;
            }
        } catch (error) {
            console.error('Error updating product:', error.message);
            return null;
        }
    }
    
    /**
     * Asynchronously retrieves all products from the server.
     * @async
     * @returns {Promise<Array<Product>|null>} A promise that resolves to an array of Product objects if the operation is successful, or null if it fails.
     */ 
    async getAllProducts() {
        try {
            const response = await fetchJson("/products/", "GET");
            console.log("Response from the database:", response);
    
            if (response) {
                if (response.rows) {
                    let aux = [];
                    for (let product of response.rows) {
                        const newProduct = new Product(
                            product.ProductID,
                            product.Name,
                            product.Quantity,
                            product.Price,
                            product.TypeName
                        );
                        aux.push(newProduct);
                    }
                    console.log("Products from the database:", aux);
                    this.products = aux;
                    console.log("Updated products array:", aux);
                    return this.products;
                } else {
                    console.error('Error: Response does not contain "rows" property:', response);
                    return null;
                }
            } else {
                console.error('Error: No response received from the server.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
            return null;
        }
    }
    
    /**
     * Asynchronously retrieves the unique identifier of a product by its name.
     * @async
     * @param {string} name - The name of the product.
     * @returns {Promise<number|null>} A promise that resolves to the unique identifier if the product is found, or null if it is not found or if an error occurs.
     */
    async getIdByName(name) {
        try {
            const foundProduct = this.products.find(product => product.name === name);

            if (foundProduct) {
                return foundProduct.id;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error searching products:', error.message);
            return null;
        }
    }
}



/**
 * Class representing a manager for handling tables.
 * @class
 */
class TableManager {
    /**
     * Creates an instance of TableManager.
     * @constructor
     */
    constructor() {
        /**
         * An array containing table objects.
         * @type {Array<Object>}
         * @private
         */
        this.tables = [];
        this.getTables();
    }

     /**
     * Retrieves all tables from the server and updates the TableManager.
     * @returns {Table[]|null} An array of tables or null if an error occurs.
     */
     async getTables() {
        try {
            const response = await fetchJson("/tables/", "GET"); // Replace "/tables/" with your actual endpoint

            console.log("Response from the server:", response);

            if (response) {
                if (response.rows) {
                    let aux = [];
                    for (let table of response.rows) {
                        const newTable = new Table(
                            table.MesaID
                        );
                            console.log("New Table:", newTable)

                        aux.push(newTable);
                    }

                    console.log("Tables from the server:", aux);

                    this.tables = aux;
                } else {
                    console.error('Error: Response does not contain "rows" property:', response);
                    return null;
                }
            } else {
                console.error('Error: No response received from the server.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching tables:', error.message);
            return null;
        }
    }
}


export { ProductTypeManager, ProductManager, TableManager };
