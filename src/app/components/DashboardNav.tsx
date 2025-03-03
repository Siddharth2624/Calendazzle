'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function DashboardNav({username}:{username?:string}) {
    const pathname = usePathname();
    const isEventTypesPage = pathname.includes('event-types');
    const isBookedEventsPage = pathname.includes('booked-events');
    return (
        <div className="flex gap-4 justify-center">
            <Link 
                className={"rounded-full px-4 py-2 "+ (! (pathname == '/dashboard') ? 'bg-gray-200': "bg-blue-600 text-white")} href={'/dashboard'}>
                Profile
            </Link>
            {username && (
                <>
                    <Link 
                        className={"rounded-full px-4 py-2 "+ (!isBookedEventsPage ? 'bg-gray-200': "bg-blue-600 text-white")} 
                        href={'/dashboard/booked-events'}>
                        Booked events
                    </Link>
                    
                    <Link 
                        className={"rounded-full px-4 py-2 "+(isEventTypesPage ? 'bg-blue-600 text-white': "bg-gray-200")} href={'/dashboard/event-types'}>
                        Event types
                    </Link>
                </>
            )}
            
        </div>
    );
}