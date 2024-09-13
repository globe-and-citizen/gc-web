import {Request, Response} from "express";
import fs = require('fs');

export const serveGalleryOne = async (req: Request, res: Response) => {
    console.log("gallery-one")
    let data: any = [];
    if (fs.existsSync("uploads")){
        data = fs.readdirSync("uploads").map((file: any, i: any) => {
            return {
                id: i,
                name: file,
                url: `${req.protocol}://${req.get("host")}/media/${file}`
            };
        })
    }

    res.status(200).json({
        message: "Your images are ready!", 
        data: data
    })

}