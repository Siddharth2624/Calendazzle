/* eslint-disable @typescript-eslint/no-unused-vars */
import { nylas, nylasConfig } from "@/libs/nylas";
import { session } from "@/libs/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest){
    console.log("Receive callback from Nylas");

    const url = new URL(req.url as string);
    const code = url.searchParams.get("code");

    if (!code) {
        return Response.json({ error: "Missing code" }, { status: 400 });
    }

    const codeExchangePayload = {
        code: code,
        clientId: nylasConfig.clientId,
        clientSecret: nylasConfig.apiKey,
        redirectUri: nylasConfig.callbackUri,
    };

    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    const {grantId,email} = response;

    await mongoose.connect(process.env.MONGODB_URI!);

    const profileDoc = await ProfileModel.findOne({email}); 
    if(profileDoc){
        profileDoc.grantId = grantId;
        await profileDoc.save();
    }else{
        await ProfileModel.create({email,grantId});
    }

    await session().set('email', email);

    // Redirect to the home page
    return new Response(null, {
        status: 302,
        headers: { Location: "/" },
    });
} 
