import express from "express";
import { getOrdHistory, checkoutCart } from "../../services/storeService.js";

export const ordersRoute = express.Router();

ordersRoute.get("/", async (req, res) => {
    try {
        const orders = await getOrdHistory(req.query);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});

ordersRoute.post("/checkout", async (req, res) => {
    try {
        if (
            !req.body ||
            Object.keys(req.body).length === 0 ||
            !req.body.customerId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "The request body must contain a valid customerId.",
            });
        }
        const completedOrder = await checkoutCart(req.body);
        return res.status(200).json({
            success: true,
            data: completedOrder,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});
