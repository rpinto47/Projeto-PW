import { fetchJson } from "./fetchJson.js";
import { refreshProductTypesTable } from "./functions.js";
import { ProductType, Product, menu } from "./classes.js";

class ProductTypeManager {
    constructor() {
        this.productTypes = [];
        this.getAllProductTypes();
    }

    async addProductType() {
        try {
            const name = prompt("Enter the product type name:") || "New Product";

            if (isNaN(name.trim())) {
                const id = await this.getIdByName(name);

                if (!id) {
                    const highestId = Math.max(...this.productTypes.map(type => type.id), 0);
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
                    const updatedProductType = new ProductType(idToUpdate, newName);

                    let body = {
                        id: updatedProductType._id,
                        name: updatedProductType._name
                    };

                    const response = await fetchJson(`/product-types/${idToUpdate}`, "PUT", body);

                    if (response && response.rows) {
                        this.productTypes = this.productTypes.map(type =>
                            type._id === idToUpdate ? updatedProductType : type
                        );
                        this.getAllProductTypes();
                        refreshProductTypesTable();
                        console.log(`Product type "${nameToUpdate}" updated successfully.`);
                        return updatedProductType;
                    } else {
                        console.error('Error updating product type in the database:', response.error);
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



class ProductManager {
    constructor() {
        this.products = [];
        this.getAllProducts();
    }

    async addProduct() {
        try {
            const name = prompt("Enter the product name:") || "New Product";
            const quantity = 1;
            const price = parseFloat(prompt("Enter the product price:") || 0.0);
            const productType = prompt("Enter the product type:") || "";

            if (isNaN(name.trim()) && !isNaN(quantity) && !isNaN(price)) {
                const id = await this.getIdByName(name);

                if (!id) {
                    const highestId = Math.max(...this.products.map(product => product.id), 0);
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
                alert('Invalid input. Name must not be a number, and quantity/price must be valid numbers.');
                return null;
            }
        } catch (error) {
            console.error('Error adding product:', error.message);
            return null;
        }
    }


    
    async deleteProduct(nameToDelete) {
        console.log("Product name to delete:", nameToDelete);
    
        try {
            if (!nameToDelete || !nameToDelete.trim()) {
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


export { ProductTypeManager, ProductManager };
