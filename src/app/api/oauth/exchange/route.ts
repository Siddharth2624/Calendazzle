import {nylas, nylasConfig} from "@/libs/nylas";
import {session} from "@/libs/session";
import {ProfileModel} from "@/models/Profile";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Received callback from Nylas");
    const url = new URL(req.url as string);
    const code = url.searchParams.get('code');

    if (!code) {
      console.error("No authorization code returned from Nylas");
      return NextResponse.redirect(new URL('/?error=no_code', req.url));
    }

    const codeExchangePayload = {
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId as string,
      redirectUri: nylasConfig.callbackUri,
      code,
    };

    console.log("Exchanging code for token with payload:", {
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.callbackUri,
      code
    });

    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    
    if (!response?.email) {
      console.error("No email received from Nylas token exchange");
      return NextResponse.redirect(new URL('/?error=no_email', req.url));
    }

    const { grantId, email } = response;
    console.log("Received response from Nylas:", { email, grantId });

    await mongoose.connect(process.env.MONGODB_URI as string);

    const profileDoc = await ProfileModel.findOne({email});
    if (profileDoc) {
      profileDoc.grantId = grantId;
      await profileDoc.save();
    } else {
      await ProfileModel.create({email, grantId});
    }

    const sess = await session();
    await sess.set('email', email);
    
    console.log("Session set with email:", email);

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error("Error in OAuth exchange:", error);
    return NextResponse.redirect(new URL('/?error=oauth_error', req.url));
  }
}
