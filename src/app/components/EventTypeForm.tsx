/* eslint-disable react/jsx-key */
'use client';
import { BookingTimes, WeekDayName } from "@/libs/type";
import TimeSelect from "./TimeSelect";
import React, { FormEvent, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IEventType } from "@/models/EventType";
import EventTypeDelete from "./EventTypeDelete";

const weekdaysNames: WeekDayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] ;

export default function EventTypeForm({doc,username=''}:{doc?:IEventType,username?:string}) {
    const [title, setTitle] = useState(doc?.title || '');
    const [description, setDescription] = useState(doc?.description || '');
    const [length, setLength] = useState(doc?.length || 30);
    const [bookingTimes, setBookingTimes] = useState<BookingTimes>(doc?.bookingTimes || {});
    const router = useRouter();


    function handleBookingTimesChange(day: WeekDayName, val: string | boolean, fromOrTo: 'from' | 'to' | 'active') {
        setBookingTimes((oldBookingTimes) => ({
            ...oldBookingTimes,
            [day]: {
                ...(oldBookingTimes[day] || { from: "00:00", to: "00:00", active: false }),
                [fromOrTo]: val,
            },
        }));
    }

    async function handleSubmit(e: FormEvent){
        e.preventDefault();
        const id = doc?._id;
        const request = id ? axios.put : axios.post;
        const data = { 
           title, description, length, bookingTimes 
        }
        const response = await request('/api/event-types',{...data,id} );

        if(response.data){
            router.push('/dashboard/event-types');
            router.refresh();
        }
    }

    return (
        <form className="p-2 bg-gray-200 rounded-lg mt-4" onSubmit={handleSubmit}>
            {doc && (
                <p className="my-2 text-sm text-gray-500">{process.env.NEXT_PUBLIC_URL}/{username}/{doc.uri}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>
                        <span className="block font-semibold mb-1">Title</span>
                        <input 
                            type="text" 
                            placeholder="Title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                        />
                    </label>
                    <label>
                        <span className="block font-semibold mb-1">Description</span>
                        <textarea 
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input"
                        ></textarea>
                    </label>
                    <label>
                        <span className="block font-semibold mb-1">Event Length (minutes)</span>
                        <input 
                            type="number" 
                            placeholder="30"
                            value={length}
                            min={0}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="input"
                        />
                    </label>
                </div>
                
                <div>
                    <span className="block font-semibold mb-2">Availability</span>
                    <div className="grid gap-2">
                        {weekdaysNames.map((day) => {
                            const active = bookingTimes?.[day]?.active;
                            return (
                                <div
                                className="grid grid-cols-2 gap-2 items-center"
                                key={day}>
                                    <label className="flex gap-1 !mb-0 !p-0">
                                        <input 
                                        type="checkbox"
                                        value={1}
                                        checked={bookingTimes?.[day]?.active || false}
                                        onChange={e => handleBookingTimesChange(day,e.target.checked, 'active')}
                                        />
                                        <span className="capitalize text-sm">{day}</span>
                                    </label>
                                <div className={clsx("inline-flex gap-2 items-center ml-2", active ? " " : 'opacity-40')}>
                                    <TimeSelect 
                                        value={bookingTimes[day]?.from || "00:00"}
                                        onChange={(val) => handleBookingTimesChange(day, val, 'from')}
                                        step={30}
                                    />
                                    <span>-</span>
                                    <TimeSelect 
                                        value={bookingTimes[day]?.to || "00:00"}
                                        onChange={(val) => handleBookingTimesChange(day, val, 'to')}
                                        step={30}
                                    />
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div> 
            </div>
            <div className="flex gap-4 justify-center mt-4">
                {doc && (
                    <EventTypeDelete id={doc._id as string}/>
                )}
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700">
                    Save
                </button>
            </div>
        </form>
    );
}
