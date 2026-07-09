import fs from "fs/promises";
import env from "dotenv";
import { futimes } from "fs";
import HttpError from "../utils/httpError.js";

env.config();
const BASE_PATH = process.env.DB_BASE_PATH;

export const PRODUCTS = "products.json";
export const ORDERS = "orders.json";
export const CUSTOMERS = "customers.json";

export async function readData(fileName) {
    const fullPath = `${BASE_PATH}/${fileName}`;
    const data = await fs.readFile(fullPath, "utf8");
    return JSON.parse(data);
}

export async function writeData(fileName, data) {
    const fullPath = `${BASE_PATH}/${fileName}`;
    await fs.writeFile(fullPath, data, "utf8");
}

export async function getCustomerById(id) {
    const allCustomers = await readData(CUSTOMERS);
    const customer = allCustomers.find((cust) => cust.customerId === id);
    if (customer.length === 0) {
        const message = {
            success: false,
            message: `Customer ID: ${id} Not Found`,
        };
        throw new HttpError(JSON.stringify(message, null, 2), 404);
    }
    return customer;
}

export async function getProductById(id) {
    const allProducts = await readData(PRODUCTS);
    const product = allProducts.find((prod) => prod.id === Number(id));
    if (!product) {
        const message = {
            success: false,
            message: `Product ID: ${id} Not Found`,
        };
        throw new HttpError(JSON.stringify(message, null, 2), 404);
    }
    return product;
}
