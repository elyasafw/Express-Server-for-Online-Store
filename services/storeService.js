import {
    readData,
    writeData,
    getCustomerById,
    getProductById,
    createNewCustomer,
    PRODUCTS,
    CUSTOMERS,
    ORDERS,
} from "../utils/dataHandling.js";
import { validateCartStock } from "../utils/validator.js";
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

export async function deleteProductFromCart(body, param) {
    const customer = await getCustomerById(body.customerId);
    const allCustomers = await readData(CUSTOMERS);
    for (const cust of allCustomers) {
        if (cust.customerId === customer.customerId) {
            const isProductInCart = cust.cart.some(
                (product) => product.productId === Number(param.productId),
            );
            if (!isProductInCart) {
                throw new HttpError(
                    `Product ID: ${param.productId} Not Found In Cart`,
                    404,
                );
            }
            cust.cart = cust.cart.filter(
                (product) => product.productId !== Number(param.productId),
            );
            console.log(cust);
            break;
        }
    }
    await writeData(CUSTOMERS, JSON.stringify(allCustomers, null, 4));
}

function calculateCartTotal(cart, allProducts) {
    let orderTotal = 0;
    const itemsToBuy = [];

    for (const cartItem of cart) {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        orderTotal += cartItem.quantity * product.price;

        itemsToBuy.push({
            productId: product.id,
            quantity: cartItem.quantity,
            price: product.price,
        });
    }

    return { orderTotal, itemsToBuy };
}

function updateInventoryAndBalance(customer, allProducts, orderTotal) {
    for (const cartItem of customer.cart) {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        product.stock -= cartItem.quantity;
    }
    customer.balance -= orderTotal;
    customer.cart = [];
}

function createOrderObject(customerId, itemsToBuy, orderTotal, allOrders) {
    let nextId = 100;
    if (allOrders.length > 0) {
        const lastOrder = allOrders[allOrders.length - 1];
        nextId = Number(lastOrder.id) + 1;
    }
    return {
        id: nextId,
        customerId: customerId,
        items: itemsToBuy,
        total: orderTotal,
        createdAt: new Date().toISOString(),
    };
}

export async function checkoutCart(body) {
    const { customerId } = body;
    const allCustomers = await readData(CUSTOMERS);
    const allProducts = await readData(PRODUCTS);
    const allOrders = (await readData(ORDERS)) || [];
    let customer = allCustomers.find((c) => c.customerId === customerId);
    let isNewCustomer = false;
    if (!customer) {
        customer = await createNewCustomer(allCustomers, customerId);
        isNewCustomer = true;
    }
    if (!customer.cart || customer.cart.length === 0) {
        if (isNewCustomer) {
            await writeData(CUSTOMERS, JSON.stringify(allCustomers, null, 4));
            throw new HttpError(
                `Customer ID: ${customerId} was successfully created with your initial balance. However, your cart is empty. Please add items to your cart before checking out.`,
                400,
            );
        }
        throw new HttpError("Checkout rejected: Cart is empty.", 400);
    }
    validateCartStock(customer.cart, allProducts);
    const { orderTotal, itemsToBuy } = calculateCartTotal(
        customer.cart,
        allProducts,
    );
    if (customer.balance < orderTotal) {
        throw new HttpError(
            `Insufficient funds. Total: ${orderTotal}, Balance: ${customer.balance}`,
            400,
        );
    }
    updateInventoryAndBalance(customer, allProducts, orderTotal);
    const newOrder = createOrderObject(
        customer.customerId,
        itemsToBuy,
        orderTotal,
        allOrders,
    );
    allOrders.push(newOrder);
    await writeData(CUSTOMERS, JSON.stringify(allCustomers, null, 4));
    await writeData(PRODUCTS, JSON.stringify(allProducts, null, 4));
    await writeData(ORDERS, JSON.stringify(allOrders, null, 4));
    return newOrder;
}
