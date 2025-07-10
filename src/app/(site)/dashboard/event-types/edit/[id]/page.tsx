import EventTypeForm from "@/app/components/EventTypeForm";
import { session } from "@/libs/session";
import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";

type PageProps = {
  params:{
    id: string;
  };
};

export default async function EditEventTypePage({ params }: PageProps) {
  await mongoose.connect(process.env.MONGODB_URI!);

  const eventTypeDoc = await EventTypeModel.findById(params.id);
  const email = await session().get("email");
  const profileDoc = await ProfileModel.findOne({ email });

  if (!eventTypeDoc) {
    return <div>404 - Event Type Not Found</div>;
  }

  return (
    <div>
      <EventTypeForm
        username={profileDoc?.username || ""}
        doc={JSON.parse(JSON.stringify(eventTypeDoc))}
      />
    </div>
  );
}
