import express from "express";
import {
    getCustomerCart,
    getCustomerBalance,
    addProductToCart,
} from "../../services/storeService.js";
import { getProductById } from "../../utils/dataHandling.js";
import { checkCartBody } from "../../utils/validator.js";
import HttpError from "../../utils/httpError.js";
import e from "express";

export const customersRoute = express.Router();

customersRoute.get("/cart", async (req, res) => {
    try {
        const customerCart = await getCustomerCart(req.query);
        res.status(200).json({ success: true, data: customerCart });
    } catch (error) {
        res.status(error.status || 500).send(
            error.status ? error.message : "Server Internal Error",
        );
    }
});

customersRoute.get("/account/balance", async (req, res) => {
    try {
        const customerBalance = await getCustomerBalance(req.query);
        res.status(200).json({ success: customerBalance });
    } catch (error) {
        res.status(error.status || 500).send(
            error.status ? error.message : "Server Internal Error",
        );
    }
});

customersRoute.post("/cart/items", async (req, res) => {
    try {
        if (!checkCartBody(req.body)) {
            return res.status(400).send({
                success: false,
                message:
                    "The request body must contain the fields 'customerId', 'productId', and 'quantity'.",
            });
        }
        const product = await getProductById(req.body.productId);
        if (!product.stock) {
            return res.status(404).json({
                success: false,
                message: `Product ID: ${product.id} is out of stock.`,
            });
        }
        if (Number(req.body.quantity) <= 0) {
            return res.status(400).send({
                success: false,
                message:
                    "The quantity amount most be bigger then 0.",
            });
        }
        await addProductToCart(req.body);
        res.status(201).json({
            success: true,
            message: `Product ID: ${product.productId} added to cart.`,
        });
    } catch (error) {
        res.status(error.status || 500).send(
            error.status ? error.message : error.message,
        );
    }
});
