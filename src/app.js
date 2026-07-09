import express from "express";
import env from "dotenv";
import { customersRoute } from "./routes/customerRouter.js";
import e from "express";

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
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
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
        res.statusCode = 500;
        res.end(JSON.stringify({ status: "DOWN", error: error.message }));
    }
});

app.use("/customers", customersRoute);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ...`);
});
