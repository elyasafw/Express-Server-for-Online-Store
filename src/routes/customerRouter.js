import express from "express";
import { getCustomerCart } from "../../services/storeService.js";

export const customersRoute = express.Router();

customersRoute.get("/cart", async (req, res) => {
    try {
        const customerCart = await getCustomerCart(req.query);
        res.status(200).json({success: customerCart});
    } catch (error) {
        res.status(error.status || 500).send(
            error.status ? error.message : "Server Internal Error",
        );
    }
});
