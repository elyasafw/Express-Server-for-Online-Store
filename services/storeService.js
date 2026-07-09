import { readData, writeData } from "../utils/dataHandling.js";

const PRODUCTS = "products.json";
const ORDERS = "orders.json";
const CUSTOMERS = "customers.json";

export async function getFilteredProducts(query) {
    console.log(query);
    try {
        const { inStock, maxPrice, search } = query;
        const allProducts = await readData(PRODUCTS);
        const filtered = allProducts.filter((product) => {
            const searchLower = search ? search.toLowerCase() : "";
            return [
                !inStock ||
                    (inStock === "true"
                        ? product.stock > 0
                        : product.stock == 0),
                !maxPrice || product.price <= Number(maxPrice),
                !search || product.name?.toLowerCase().includes(searchLower),
            ].every((condition) => condition === true);
        });
        return filtered;
    } catch (error) {
        return error.message;
    }
}
