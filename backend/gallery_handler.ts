import { Request, Response } from "express";
import fs = require('fs');

const serveGallery = async (req: Request, res: Response, galleryPath: string) => {
    let data: any = [];
    
    const fullPath = `uploads/${galleryPath}`;
    
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
        message: `Your images from ${galleryPath} are ready!`,
        data: data
    });
};

export const serveGalleryOne = (req: Request, res: Response) => serveGallery(req, res, "gallery-one");

export const serveGalleryTwo = (req: Request, res: Response) => serveGallery(req, res, "gallery-two");
