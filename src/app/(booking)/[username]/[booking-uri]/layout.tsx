import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profile";
import { Clock, Info } from "lucide-react";
import mongoose from "mongoose";
import { ReactNode } from "react";

interface PageParams {
  username: string;
  "booking-uri": string;
}

type LayoutProps = {
  children: ReactNode;
  params: PageParams;
};

export default async function BookingBoxLayout({
  children,
  params,
}: LayoutProps) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const profileDoc = await ProfileModel.findOne({
      username: params.username,
    });

    if (!profileDoc) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">404</h2>
            <p className="text-gray-600">Profile Not Found</p>
          </div>
        </div>
      );
    }

    const etDoc = await EventTypeModel.findOne({
      email: profileDoc.email,
      uri: params["booking-uri"],
    });

    if (!etDoc) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">404</h2>
            <p className="text-gray-600">Event Type Not Found</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex items-center h-screen bg-cover"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="w-full text-center">
          <div className="inline-flex mx-auto shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-100/50 p-8 w-80 text-sm text-gray-800">
              <h1 className="text-left text-2xl font-bold mb-4 pb-2 border-b border-black/10">
                {etDoc.title}
              </h1>
              <div className="grid gap-y-4 grid-cols-[40px_1fr] text-left">
                <div>
                  <Clock />
                </div>
                <div>{etDoc.length}min</div>
                <div>
                  <Info />
                </div>
                <div>{etDoc.description}</div>
              </div>
            </div>
            <div className="bg-white p-8 w-96">{children}</div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in BookingBoxLayout:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
