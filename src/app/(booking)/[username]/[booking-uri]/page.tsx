import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
  };
};

export default async function BookingPage({ params }: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI!);

  const profileDoc = await ProfileModel.findOne({
    username: params.username,
  });
  if (!profileDoc) {
    return <div>404 - Profile Not Found</div>;
  }

  const etDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: params["booking-uri"],
  });
  if (!etDoc) {
    return <div>404 - Event Type Not Found</div>;
  }

  return (
    <TimePicker
      username={params.username}
      meetingUri={etDoc.uri}
      length={etDoc.length}
      bookingTimes={JSON.parse(JSON.stringify(etDoc.bookingTimes))}
    />
  );
}
