import { Request, Response } from "express";
import fs = require('fs');

const serveChapterAssets = async (req: Request, res: Response, chapterAssetsPath: string) => {
    let data: any = [];
    
    const fullPath = `uploads/${chapterAssetsPath}`;
    
    if (fs.existsSync(fullPath)) {
        data = fs.readdirSync(fullPath).map((file: any, i: any) => {
            return {
                id: i,
                name: file,
                url: `${req.protocol}://${req.get("host")}/media/${file}`
            };
        });
    }

    res.status(200).json({
        message: `Your images from ${chapterAssetsPath} are ready!`,
        data: data
    });
};

export const serveGalleryOne = (req: Request, res: Response) => serveChapterAssets(req, res, "gallery-one");

export const serveGalleryTwo = (req: Request, res: Response) => serveChapterAssets(req, res, "gallery-two");