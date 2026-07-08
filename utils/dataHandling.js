import fs from "fs/promises";
import env from "dotenv";

const BASE_PATH = process.env.DB_BASE_PATH;

export async function readData(fileName) {
    try {
        const fullPath = BASE_PATH + fileName;
        const data = await fs.readFile(fullPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return error.message;
    }
}
