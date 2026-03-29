"use client";

import { useState, useActionState } from "react";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { createReserve } from "@/lib/action";
import { DisableDateProps, RoomDetailProps } from "@/type/room";
import clsx from "clsx";

const ReserveForm = ({
    room,
    disableDate,
    initialName = "",
    initialPhone = ""
}: {
    room: RoomDetailProps;
    disableDate: DisableDateProps[];
    initialName?: string;
    initialPhone?: string

}) => {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDatechange = (dates: [Date | null, Date | null]) => {
        const [newStart, newEnd] = dates;
        setStartDate(newStart);
        setEndDate(newEnd);
    };


    const boundAction = startDate && endDate
        ? createReserve.bind(null, room.id, room.price, startDate, endDate)
        : () => ({ messageDate: "Please enter the reservation date" });

    const [state, formAction, isPending] = useActionState(boundAction, null)

    const excluDates = disableDate.map((item) => {
        return {
            start: new Date(item.startdate),
            end: new Date(item.endDate)
        }
    })
    return (
        <div>
            <form action={formAction}>
                <div className="mb-4">
                    <label className="block text-sm text-gray-900 font-medium">Arrival- Departure</label>
                    <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        filterDate={(data) => true}
                        selectsRange={true}
                        excludeDateIntervals={excluDates}
                        onChange={handleDatechange}
                        dateFormat={"dd-MM-yyyy"}
                        wrapperClassName="w-full"
                        className="py-2 px-4 rounded-md border border-gray-300 w-full"
                    />
                    <div aria-live="polite" aria-atomic="true">
                        <p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-900 font-medium">Your Name</label>
                    <input type="text"
                        name="name"
                        defaultValue={initialName}
                        className="py-2 px-4 rounded-md border border-gray-300 w-full"
                        placeholder="Full Name" />
                    <div aria-live="polite" aria-atomic="true">
                        <p className="text-sm text-red-500 mt-2">{state?.error?.name}</p>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-900 font-medium">Phone Number</label>
                    <input type="text"
                        name="phone"
                        defaultValue={initialPhone}
                        className="py-2 px-4 rounded-md border border-gray-300 w-full"
                        placeholder="Phone Number" />
                    <div aria-live="polite" aria-atomic="true">
                        <p className="text-sm text-red-500 mt-2">{state?.error?.phone}</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className={clsx("px-10 py-3 text-center font-semibold w-full text-white bg-orange-400 rounded-sm cursor-pointer hover:bg-orange-500",
                        { "opacity-50 cursor-progress": isPending }
                    )}>
                    {isPending ? "Loading... " : "Reservation"}
                </button>
            </form>
        </div>
    )
}

export default ReserveForm