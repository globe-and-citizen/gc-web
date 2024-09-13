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
