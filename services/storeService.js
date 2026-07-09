import { readData, writeData } from "../utils/dataHandling.js";
import HttpError from "../utils/httpError.js";

const PRODUCTS = "products.json";
const ORDERS = "orders.json";
const CUSTOMERS = "customers.json";

export async function getFilteredProducts(query) {
    const { inStock, maxPrice, search } = query;
    const allProducts = await readData(PRODUCTS);
    const filtered = allProducts.filter((product) => {
        const searchLower = search ? search.toLowerCase() : "";
        return [
            !inStock ||
                (inStock === "true" ? product.stock > 0 : product.stock == 0),
            !maxPrice || product.price <= Number(maxPrice),
            !search || product.name?.toLowerCase().includes(searchLower),
        ].every((condition) => condition === true);
    });
    return filtered;
}

export async function getCustomerCart(query) {
    const customerId = query.customerId;
    const allCustomers = await readData(CUSTOMERS);
    const customer = allCustomers.find((cust) => cust.customerId == customerId);
    if (!customer) {
        throw new HttpError(`Customer ID: ${customerId} Not Found`, 404);
    }
    return customer;
}
