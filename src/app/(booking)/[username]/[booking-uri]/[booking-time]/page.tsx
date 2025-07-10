'use client';

import axios from "axios";
import { format } from "date-fns";
import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";

export default function BookingFormPage() {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNotes, setGuestNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const params = useParams();

  const username = params?.username as string;
  const bookingUri = params?.['booking-uri'] as string;
  const bookingTimeRaw = params?.['booking-time'] as string;

  if (!username || !bookingUri || !bookingTimeRaw) {
    return <div className="p-8 text-red-500">Invalid booking URL.</div>;
  }

  const bookingTime = new Date(decodeURIComponent(bookingTimeRaw));

  async function handleFormSubmit(ev: FormEvent) {
    ev.preventDefault();
    const data = { guestName, guestEmail, guestNotes, username, bookingUri, bookingTime };
    try {
      await axios.post('/api/bookings', data);
      setConfirmed(true);
    } catch (err) {
      console.error("Booking failed", err);
      alert("Booking failed. Please try again.");
    }
  }

  return (
    <div className="text-left p-8 w-[400px]">
      <h2 className="text-2xl text-gray-500 font-bold mb-4 pb-2 border-b border-black/10">
        {format(bookingTime, "EEEE MMMM d, HH:mm")}
      </h2>

      {confirmed ? (
        <div>Thanks for Booking!</div>
      ) : (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span>Your name</span>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              type="text"
              placeholder="Sydney Sweeney"
              required
            />
          </label>

          <label className="flex flex-col">
            <span>Your email</span>
            <input
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              type="email"
              placeholder="test@example.com"
              required
            />
          </label>

          <label className="flex flex-col">
            <span>Any additional info?</span>
            <textarea
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
              placeholder="Any relevant information (Optional)"
            />
          </label>

          <div className="text-right">
            <button type="submit" className="btn-blue">Confirm</button>
          </div>
        </form>
      )}
    </div>
  );
}
