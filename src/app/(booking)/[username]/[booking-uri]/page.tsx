import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";

type PageProps={
    params:Promise<{
        username:string,
        "booking-uri":string
    }>;
};
export default async function BookingPage({params}:PageProps){
    mongoose.connect(process.env.MONGODB_URI!);
    const resolvedParams = await params; // Await params here

    const profileDoc = await ProfileModel.findOne({
        username: resolvedParams.username,
    });
    if(!profileDoc){
        return '404';
    }
    const etDoc = await EventTypeModel.findOne({
        email: profileDoc.email,
        uri: resolvedParams?.["booking-uri"]
    });
    if(!etDoc){
        return '404';
    }
    return(
            <TimePicker
            username = {resolvedParams.username}
            meetingUri = {etDoc.uri}                        
            length = {etDoc.length}
            bookingTimes = {JSON.parse(JSON.stringify(etDoc.bookingTimes))}/>         
      )
}