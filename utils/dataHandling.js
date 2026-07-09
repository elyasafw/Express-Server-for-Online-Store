import fs from "fs/promises";
import env from "dotenv";
import { futimes } from "fs";

env.config();
const BASE_PATH = process.env.DB_BASE_PATH;

export async function readData(fileName) {
    const fullPath = `${BASE_PATH}/${fileName}`;
    const data = await fs.readFile(fullPath, "utf8");
    return JSON.parse(data);
}

export async function writeData(fileName, data) {
    const fullPath = `${BASE_PATH}/${fileName}`;
    await fs.writeFile(fullPath, data, "utf8");
}
