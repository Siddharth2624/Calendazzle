import nextAppSession from "next-app-session"


//data type
type MySessionData = {
    grantId?: string,
    email?: string
}

export const session = nextAppSession<MySessionData>({
    name: "calendazzle_session",
    secret: process.env.SECRET
});