import {
    readData,
    writeData,
    getCustomerById,
    getProductById,
    PRODUCTS,
    CUSTOMERS,
    ORDERS,
} from "../utils/dataHandling.js";
import HttpError from "../utils/httpError.js";

export async function getFilteredProducts(query) {
    const allProducts = await readData(PRODUCTS);
    if (!query) {
        return allProducts;
    }
    const { inStock, maxPrice, search } = query;
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
    const customer = getCustomerById(customerId);
    return customer.cart;
}

export async function getCustomerBalance(query) {
    const customerId = query.customerId;
    const customer = getCustomerById(customerId);
    return customer.balance;
}

export async function getOrdHistory(query) {
    const customerId = query.customerId;
    const customer = getCustomerById(customerId);
    const allOrders = await readData(ORDERS);
    const custOrders = allOrders.find(
        (order) => order.customerId === customerId,
    );
    return custOrders;
}

export async function addProductToCart(body) {
    const customer = await getCustomerById(body.customerId);
    const allCustomers = await readData(CUSTOMERS);
    for (const cust of allCustomers) {
        if (cust.customerId === customer.customerId) {
            cust.cart.push({
                productId: body.productId,
                quantity: body.quantity,
            });
            await writeData(CUSTOMERS, JSON.stringify(allCustomers, null, 4));
            break;
        }
    }
}
