import { fetchJson } from "../../scripts/fetchJson.js";
import { refreshProductTypesTable } from "./functions.js";
import { ProductType } from "./classes.js";

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



export { ProductTypeManager };
