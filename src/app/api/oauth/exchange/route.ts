import { nylas, nylasConfig } from "@/libs/nylas";
import { session } from "@/libs/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url || "");
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const { grantId, email } = await nylas.auth.exchangeCodeForToken({
      code,
      clientId: nylasConfig.clientId,
      clientSecret: nylasConfig.apiKey,
      redirectUri: nylasConfig.callbackUri,
    });

    await mongoose.connect(process.env.MONGODB_URI!);
    await ProfileModel.findOneAndUpdate(
      { email },
      { grantId },
      { upsert: true, new: true }
    );

    await session().set("email", email);
    console.log("✅ Session email set:", email);

    return new Response(null, {
      status: 302,
      headers: {
        Location: process.env.NEXT_PUBLIC_URL + "/",
      },
    });
  } catch (err) {
    console.error("❌ OAuth exchange failed:", err);
    return Response.json({ error: "OAuth exchange failed" }, { status: 500 });
  }
}
