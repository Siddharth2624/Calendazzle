import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profile";
import { Clock, Info } from "lucide-react";
import mongoose from "mongoose";
import { ReactNode, Suspense } from "react";

type LayoutProps = {
  children: ReactNode;
  params: {
    username: string;
    "booking-uri": string;
  };
};

// The layout component must be an async Server Component
export default function BookingBoxLayout(props: LayoutProps) {
  return (
    <Suspense fallback={<LoadingCard />}>
      <BookingContent {...props} />
    </Suspense>
  );
}

async function BookingContent({ children, params }: LayoutProps) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const profileDoc = await ProfileModel.findOne({
      username: params.username,
    });

    if (!profileDoc) {
      return <ErrorCard title="404" message="Profile Not Found" />;
    }

    const etDoc = await EventTypeModel.findOne({
      email: profileDoc.email,
      uri: params["booking-uri"],
    });

    if (!etDoc) {
      return <ErrorCard title="404" message="Event Type Not Found" />;
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
    console.error("Error in BookingContent:", error);
    return (
      <ErrorCard
        title="Error"
        message="Something went wrong. Please try again later."
      />
    );
  }
}

function LoadingCard() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
