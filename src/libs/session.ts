import nextAppSession from "next-app-session";

type SessionData = {
  email?: string;
  grantId?: string;
};

export const session = nextAppSession<SessionData>({
  name: "calendazzle_session",
  secret: process.env.SECRET!,
  cookie: {
    secure: true,
    sameSite: "lax",
    path: "/",
  },
});
