import { Request, Response } from "express";
import fs = require('fs');

const serveMusicAsset = async (req: Request, res: Response, musicFilePath: string) => {
    const fullPath = `uploads/${musicFilePath}`;

    if (fs.existsSync(fullPath)) {
        const fileName = fs.readdirSync(fullPath)[0];
        if (fileName) {
            const musicFile = {
                name: fileName,
                url: `${req.protocol}://${req.get("host")}/media/${musicFilePath}/${fileName}`,
            };

            return res.status(200).json({
                message: `Your music file from ${musicFilePath} is ready!`,
                data: musicFile,
            });
        }
    }

    return res.status(404).json({
        message: `No music file found in ${musicFilePath}.`,
    });
};

export const serveMusicOne = (req: Request, res: Response) => serveMusicAsset(req, res, "music-one");
