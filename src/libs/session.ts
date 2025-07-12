import nextAppSession from 'next-app-session';

// Your session data type
type MySessionData = {
  grantId?: string;
  email?: string;
}

const isProduction = process.env.NODE_ENV === 'production';
const domain = process.env.NEXT_PUBLIC_URL 
  ? new URL(process.env.NEXT_PUBLIC_URL).hostname
  : undefined;

export const session = nextAppSession<MySessionData>({
  name: 'calendazzle_session',
  secret: process.env.SECRET!,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    domain: isProduction ? domain : undefined,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
});
