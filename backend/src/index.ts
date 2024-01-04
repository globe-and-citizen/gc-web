// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
    createIPX,
    ipxFSStorage,
    ipxHttpStorage,
    createIPXNodeServer,
} from "ipx";

const ipx = createIPX({
    storage: ipxFSStorage({ dir: "./public" }),
    httpStorage: ipxHttpStorage({ domains: ["picsum.photos"] }),
});

dotenv.config();

const app: Express = express().use("/", createIPXNodeServer(ipx));
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});