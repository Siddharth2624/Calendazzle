import nextAppSession from "next-app-session";

type MySessionData = {
  email?: string;
  grantId?: string;
};

export const session = nextAppSession<MySessionData>({
  name: "calendazzle_session",
  secret: process.env.SECRET!,
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true, // make sure it's true for production
  },
});
