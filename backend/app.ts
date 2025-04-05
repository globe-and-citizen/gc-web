import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
const http = require('http');
const WebSocket = require('ws');
import fs from 'fs';
import layer8 from 'layer8-middleware-rs';
import { getOAuthURL, submitOAuth, createBlogPost, getBlogPosts, getBlogPost, deleteBlogPost } from './handler';
import { onWsConn } from './tic-tac-toe';

const app = express();
const server = http.createServer(app);

// interface ImageData {
//     id: number;
//     uploadedAt: Date;
// }
// var imagesData: ImageData[] = [];

interface CustomRequest extends Request {
    file?: Express.Multer.File; // Define using Express.Multer.File
}

app.use(express.json({ limit: '100mb' }))
app.enable('trust proxy')

// static calls response.end() making it impossible to add headers after
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(layer8.tunnel);

const upload = layer8.multipart({ dest: "uploads" });
const cameraUploads = layer8.multipart({ dest: "camera_uploads" });

app.use('/media', layer8._static('uploads'));
app.use('/media/ex/', express.static('uploads'));

app.use('/camera', layer8._static('camera_uploads'));
app.use('/camera/ex/', express.static('camera_uploads'));

// app.use('/media/ex/', (req, res, next) => {
//     if (req.url.includes('/camera')) {
//         express.static('camera_uploads')(req, res, next);
//     } else {
//         express.static('uploads')(req, res, next);
//     }
// });

// app.use('/media', (req, res, next) => {
//     if (req.url.includes('/camera')) {
//         layer8.static('camera_uploads')(req, res, next);
//     } else {
//         layer8.static('uploads')(req, res, next);
//     }
// });

app.get("/api/login/layer8/auth", getOAuthURL)
app.post("/api/login/layer8/auth", submitOAuth)
app.post("/api/blog/create", createBlogPost)
app.get("/api/blog", getBlogPosts)
app.get("/api/blog/:id", getBlogPost)
app.delete("/api/blog/:id", deleteBlogPost)

app.post("/api/upload", upload.single('file'), (req: CustomRequest, res: Response) => {
    const uploadedFile = req.file;
    if (!uploadedFile) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    res.status(200).json({
        message: "File uploaded successfully!",
        data: `${req.protocol}://${req.get('host')}/media/${req.file?.filename}`
    });
});

app.get("/api/camera/clear", (req: Request, res: Response) => {
    if (fs.existsSync("camera_uploads")) {
        fs.rmSync("camera_uploads", { recursive: true, force: true });
    }
    res.status(200).json({
        message: "Camera uploads cleared successfully!",
        data: []
    });
});

app.post("/api/camera/upload", cameraUploads.single('file'), (req: CustomRequest, res: Response) => {
    const uploadedFile = req.file;
    if (!uploadedFile) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    res.status(200).json({
        message: "File uploaded successfully!",
        data: `${req.protocol}://${req.get('host')}/camera/${req.file?.filename}`
    });
});

app.get("/api/gallery", (req: Request, res: Response) => {
    const useExpress = req.query.use_express as string;
    let data: Array<{ id: number; name: string; url: string }> = [];

    if (fs.existsSync("uploads")) {
        data = fs.readdirSync("uploads").map((file: string, i: number) => {
            return {
                id: i,
                name: file,
                url: `${req.protocol}://${req.get('host')}/media/${useExpress ? 'ex/' : ''}${file}`
            };
        });
    }
    res.status(200).json({
        message: "Your images are ready!",
        data: data
    });
});

app.get("/api/camera/gallery", (req: Request, res: Response) => {
    const useExpress = req.query.use_express as string;
    let data: Array<{ id: number; name: string; url: string }> = [];

    if (fs.existsSync("camera_uploads")) {
        data = fs.readdirSync("camera_uploads").map((file: string, i: number) => {
            return {
                id: i,
                name: file,
                url: `${req.protocol}://${req.get('host')}/camera/${useExpress ? 'ex/' : ''}${file}`
            };
        });
    }
    res.status(200).json({
        message: "Your images are ready!",
        data: data
    });
});

app.get("/api/gallery/:name", (req: Request, res: Response) => {
    const imageName = req.params.name;
    const useExpress = req.query.use_express as string;
    let data: Array<{ id: number; name: string; url: string }> = [];

    if (fs.existsSync("uploads")) {
        data = fs.readdirSync("uploads").map((file: string, i: number) => {
            return {
                id: i,
                name: file,
                url: `${req.protocol}://${req.get('host')}/media/${useExpress ? 'ex/' : ''}${file}`
            };
        });
    }
    const image = data.find((image) => image.name === imageName);
    if (!image) {
        res.status(404).json({
            message: "Image not found",
            data: []
        });
        return;
    } else {
        res.status(200).json({
            message: "Your image is ready!",
            data: image
        });
    }
});

// Initialize WebSocket server
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request: any, socket: any, head: any) => {
    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws: WebSocket) => {
    onWsConn(ws, wss);
});

// Server setup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
});
