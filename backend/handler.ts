import { UserInfoFromOAuth } from './type';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import ClientOAuth2 from 'client-oauth2'

const LAYER8_CLIENT_ID = process.env.LAYER8_CLIENT_ID
const LAYER8_CLIENT_SECRET = process.env.LAYER8_CLIENT_SECRET
const LAYER8_URL = process.env.LAYER8_URL
const OAUTH_JWT_SECRET_KEY = process.env.OAUTH_JWT_SECRET_KEY
const OAUTH2_CALLBACK_URL = process.env.OAUTH2_CALLBACK_URL

let blogPosts: any[] = [];

const oauthClient = new ClientOAuth2({
    clientId: LAYER8_CLIENT_ID,
    clientSecret: LAYER8_CLIENT_SECRET,
    accessTokenUri: `${LAYER8_URL}/api/oauth`,
    authorizationUri: `${LAYER8_URL}/authorize`,
    redirectUri: OAUTH2_CALLBACK_URL,
    scopes: ["read:user"],
});

export const getOAuthURL = async (req: Request, res: Response) => {
    console.log("layer8Auth.code.getUri(): ", oauthClient.code.getUri());
    res.status(200).json({ authURL: oauthClient.code.getUri() });
};

export const submitOAuth = async (req: Request, res: Response) => {
    try {
        const { callback_url } = req.body;

        const user = await oauthClient.code.getToken(callback_url)
        const signedUser = user.sign({
            url: `${LAYER8_URL}/api/user`,
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        })

        const userFromBackendResponse = (await axios.get(signedUser.url, {
            headers: signedUser.headers
        })).data as UserInfoFromOAuth

        const token = jwt.sign(
            {
                isEmailVerified: userFromBackendResponse.is_email_verified,
                displayName: userFromBackendResponse.display_name,
                countryName: userFromBackendResponse.country_name
            },
            OAUTH_JWT_SECRET_KEY as string,
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error fetching user data from backend: ", error)
        res.status(500).json({ message: "Error fetching user data from backend" })
    }
}

export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { title, content, author } = req.body;
        let currentDate = new Date().toISOString();
        currentDate = currentDate.slice(0, 10);
        blogPosts.push({
            id: blogPosts.length + 1,
            title,
            content,
            author,
            date: currentDate,
        })

        res.status(200).json({ message: "Blog post created successfully" });

    } catch (error) {
        console.error("Error creating blog post: ", error)
        res.status(500).json({ message: "Error creating blog post" })
    }
}

export const getBlogPosts = async (req: Request, res: Response) => {
    try {
        res.status(200).json(blogPosts);
    } catch (error) {
        console.error("Error fetching blog posts: ", error)
        res.status(500).json({ message: "Error fetching blog posts" })
    }
}

export const getBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const blogPost = blogPosts.find((post) => post.id === parseInt(id));
        if (!blogPost) {
            res.status(404).json({ message: "Blog post not found" });
            return;
        }

        res.status(200).json(blogPost);
    } catch (error) {
        console.error("Error fetching blog post: ", error)
        res.status(500).json({ message: "Error fetching blog post" })
    }
}

export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const index = blogPosts.findIndex((post) => post.id === parseInt(id));
        if (index === -1) {
            res.status(404).json({ message: "Blog post not found" });
            return;
        }

        blogPosts.splice(index, 1);
        res.status(200).json({ message: "Blog post deleted successfully" });

    } catch (error) {
        console.error("Error deleting blog post: ", error)
        res.status(500).json({ message: "Error deleting blog post" })
    }
}