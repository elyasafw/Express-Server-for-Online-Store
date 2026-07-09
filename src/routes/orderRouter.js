import express from "express";
import { getOrdHistory } from "../../services/storeService.js";

export const ordersRoute = express.Router();

ordersRoute.get("/", async(req, res) => {
    try {
        const orders = await getOrdHistory(req.query);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(error.status || 500).send(
            error.status ? error.message : "Server Internal Error",
        );
    }
});
