import dotenv from 'dotenv'; 
dotenv.config();

import express from 'express';
import { tunnel } from 'layer8_middleware';
import { getOAuthURL, submitOAuth, createBlogPost, getBlogPosts, getBlogPost, deleteBlogPost } from './handler';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(tunnel)
// app.use(express.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/api/login/layer8/auth", getOAuthURL)
app.post("/api/login/layer8/auth", submitOAuth)
app.post("/api/blog/create", createBlogPost)
app.get("/api/blog", getBlogPosts)
app.get("/api/blog/:id", getBlogPost)
app.delete("/api/blog/:id", deleteBlogPost)

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})