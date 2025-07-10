/* eslint-disable @typescript-eslint/no-unused-vars */
import { nylas, nylasConfig } from "@/libs/nylas";
import { session } from "@/libs/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("✅ Receive callback from Nylas");

  const url = new URL(req.url || "");
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // 🔁 Step 1: Exchange code for token
    const { grantId, email } = await nylas.auth.exchangeCodeForToken({
      code,
      clientId: nylasConfig.clientId,
      clientSecret: nylasConfig.apiKey,
      redirectUri: nylasConfig.callbackUri,
    });

    // 🧠 Step 2: Store to DB
    await mongoose.connect(process.env.MONGODB_URI!);
    await ProfileModel.findOneAndUpdate(
      { email },
      { grantId },
      { upsert: true, new: true }
    );

    // 🔐 Step 3: Set session email
    await session().set("email", email);
    console.log("✅ Session email set:", email);

    // ✅ Step 4: Redirect to home (not dashboard)
    return new Response(null, {
      status: 302,
      headers: {
        Location: process.env.NEXT_PUBLIC_URL + "/",
      },
    });

  } catch (err) {
    console.error("❌ Error in Nylas OAuth Exchange:", err);
    return Response.json({ error: "OAuth exchange failed" }, { status: 500 });
  }
}
