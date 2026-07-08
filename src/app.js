import express from "express";
import env from "dotenv";

const app = express();
app.use(express.json());
env.config();
const PORT = process.env.PORT;

app.use((req, res, next) => {
    console.log(`${req.method} : ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ...`);
});
