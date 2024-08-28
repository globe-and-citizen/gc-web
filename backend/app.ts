import dotenv from 'dotenv'; 
dotenv.config();

import express from 'express';
import { tunnel } from 'layer8_middleware';
import { getOAuthURL, submitOAuth } from './handler';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(tunnel)

app.get("/api/login/layer8/auth", getOAuthURL)
app.post("/api/login/layer8/auth", submitOAuth)

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})