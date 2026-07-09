import express from "express";
import { getFilteredProducts } from "../../services/storeService.js";
import { validateQueryKeys } from "../../utils/validator.js";

export const productsRoute = express.Router();

productsRoute.get("/", async (req, res) => {
    try {
        if (!validateQueryKeys(req.query)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid query parameters. Only inStock, maxPrice, or search are allowed.",
            });
        }
        const filteredProducts = await getFilteredProducts(req.query);
        res.status(200).json({ success: true, data: filteredProducts });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});
