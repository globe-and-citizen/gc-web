import dotenv from 'dotenv'; 
dotenv.config();

import express, { json } from 'express';
import { Request, Response } from "express";
import layer8 from 'layer8_middleware';
import { getOAuthURL, submitOAuth } from './oauth_handler';
import { serveGalleryOne, serveGalleryTwo, serveAboutGallery } from './gallery_handler';

const app = express();
const PORT = process.env.PORT || 3000;
const upload = layer8.multipart({ dest: "uploads" });

app.get("/healthcheck", (req: any, resp: any) => {
    console.log("healthcheck");
    resp.send('{"msg": "I am Jason"}')
})
app.use(layer8.tunnel)
app.use('/media', layer8.static('uploads'))

// Testers
app.get("/test", (req: Request, resp: Response )=>{
    console.log("Test route hit");
    resp.status(200).json('{"msg": "myResponse"}');
})

// OAuth
app.get("/api/login/layer8/auth", getOAuthURL)
app.post("/api/login/layer8/auth", submitOAuth)

// Galleries
app.get("/api/gallery-one", serveGalleryOne)
app.get("/api/gallery-two", serveGalleryTwo)
app.get("/api/about-gallery", serveAboutGallery)
    
app.post("/api/upload", upload.single('file'), (req: any, res: Response) => {
    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.status(200).json({
        message: "File uploaded successfully!",
        data: `${req.protocol}://${req.get('host')}/media/${req.file?.name}`
    });
});

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})