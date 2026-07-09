import express from "express";
import {
    getCustomerCart,
    getCustomerBalance,
    addProductToCart,
    deleteProductFromCart,
} from "../../services/storeService.js";
import { getProductById } from "../../utils/dataHandling.js";
import { checkCartBody } from "../../utils/validator.js";
import e from "express";

export const customersRoute = express.Router();

customersRoute.get("/cart", async (req, res) => {
    try {
        const customerCart = await getCustomerCart(req.query);
        res.status(200).json({ success: true, data: customerCart });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});

customersRoute.get("/account/balance", async (req, res) => {
    try {
        const customerBalance = await getCustomerBalance(req.query);
        res.status(200).json({
            success: true,
            data: `Customer balance: ${customerBalance}`,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
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
                message: "The quantity amount most be bigger then 0.",
            });
        }
        await addProductToCart(req.body);
        res.status(201).json({
            success: true,
            data: `Product ID: ${product.productId} added to cart.`,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});

customersRoute.delete("/cart/items/:productId", handleCartDelete);
customersRoute.delete("/cart/items", handleCartDelete);
async function handleCartDelete(req, res) {
    try {
        const isBodyMissing =
            !req.body ||
            Object.keys(req.body).length === 0 ||
            !req.body.customerId;
        if (isBodyMissing || !req.params.productId) {
            return res.status(400).json({
                success: false,
                message:
                    "The request body must contain a customer ID & the path parameter must contain a product ID.",
            });
        }
        await deleteProductFromCart(req.body, req.params);
        res.status(200).json({
            success: true,
            data: `Item ID: ${req.params.productId} was removed from the cart.`,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
}
