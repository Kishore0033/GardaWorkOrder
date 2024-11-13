import * as ZOHOCRMSDK from "@zohocrm/nodejs-sdk-5.0"
import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.ENVIRONMENT;
const CLIENT_ID = ENV === 'PRODUCTION' ? process.env.CLIENT_ID : process.env.CLIENT_ID_SANDBOX;
const CLIENT_SECRET =  ENV === 'PRODUCTION' ? process.env.CLIENT_SECRET : process.env.CLIENT_SECRET_SANDBOX;
const REFRESH_TOKEN = ENV === 'PRODUCTION' ? process.env.REFRESH_TOKEN : process.env.REFRESH_TOKEN_SANDBOX;

export const initialCrmSdk = async () => {
    try {
        const environment = ZOHOCRMSDK.USDataCenter.PRODUCTION();
        let token = (new ZOHOCRMSDK.OAuthBuilder())
            .clientId(CLIENT_ID)
            .clientSecret(CLIENT_SECRET)
            .refreshToken(REFRESH_TOKEN)
            .build();

        await (await new ZOHOCRMSDK.InitializeBuilder())
            .environment(environment)
            .token(token)
            .initialize();

    } catch (error) {
        throw new Error("Error initializing CRM NODEJS SDK: " + error);
    }
}