import express from "express";
import env from "dotenv";
import { customersRoute } from "./routes/customerRouter.js";
import e from "express";
import { ordersRoute } from "./routes/orderRouter.js";

const app = express();
app.use(express.json());
env.config();
const PORT = process.env.PORT;

app.use((req, res, next) => {
    console.log(`${req.method} : ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    try {
        res.json({ message: "Welcome to the store server's home page." });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
});

app.get("/health", (req, res) => {
    try {
        const healthReport = {
            status: "UP",
            message: "Shop Server is healthy and running",
            time: new Date().toISOString(),
        };
        res.end(JSON.stringify(healthReport, null, 2));
    } catch (error) {
        return res.status(error.status || 500).json({
            success: "DOWN",
            message: error.message,
        });
    }
});

app.use("/customers", customersRoute);
app.use("/orders", ordersRoute);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ...`);
});
