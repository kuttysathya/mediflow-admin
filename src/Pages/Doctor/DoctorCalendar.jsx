import React, { useContext, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { DoctorContext } from "../../Context/DoctorContext";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const DoctorCalendar = () => {
  const { appointments, handleCancel, updateAppointmentStatus } = useContext(DoctorContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const parsedEvents = appointments
      .map((a) => {
        const parsedDate = parseCustomDate(a.datetime);
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          console.warn("Invalid date format:", a.datetime);
          return null;
        }
        return {
          id: a.id,
          title: `${a.patientName || "Unknown Patient"}`,
          start: parsedDate,
          end: new Date(parsedDate.getTime() + 30 * 60000),
          resource: a,
        };
      })
      .filter(Boolean);
    setEvents(parsedEvents);
  }, [appointments]);

  const parseCustomDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return null;

    const [datePart, timePart] = dateString.split(" at ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/");
    let [time, meridian] = timePart.split(" ");

    if (!time || !meridian) return null; // safeguard against undefined
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);
    minute = parseInt(minute);

    meridian = meridian.toLowerCase(); // safe because of the check above

    if (meridian === "pm" && hour !== 12) hour += 12;
    if (meridian === "am" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute);
  };

  const formatDateTimeToCustom = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    let hour = dateObj.getHours();
    const minute = String(dateObj.getMinutes()).padStart(2, "0");
    const meridian = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${day}/${month}/${year} at ${hour}:${minute} ${meridian}`;
  };

  const handleEventDrop = ({ event, start }) => {
    const newDate = formatDateTimeToCustom(start);
    const updatedEvent = {
      ...event.resource,
      datetime: newDate,
      appstatus: "Rescheduled",
    };

    updateAppointmentStatus(event.id, updatedEvent);
  };

  const EventComponent = ({ event }) => {
    const status = event.resource?.appstatus || "Pending";
    let bgColor = "bg-primary text-white";

    if (status === "Confirmed") bgColor = "bg-green-500 text-white";
    else if (status === "Cancelled") bgColor = "bg-red-500 text-white";
    else if (status === "Rescheduled") bgColor = "bg-yellow-400 text-black";
    else if (status === "Completed") bgColor = "bg-primary text-white";

    return (
      <div
        className={`p-1 px-2 rounded shadow-md ${bgColor} flex justify-between items-center`}
      >
        <span className="font-medium text-sm">
          {event.resource?.patientName || "Unknown"} ({status})
        </span>
        {status !== "Cancelled" && (
          <button
            onClick={() => handleCancel(event.id)}
            className="ml-2 text-xs text-white hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📅 Doctor Appointment Calendar</h2>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={["week", "day", "agenda", "month"]}
        components={{ event: EventComponent }}
        onEventDrop={handleEventDrop}
        resizable
        draggableAccessor={() => true}
        style={{ height: 600 }}
      />
    </div>
  );
};

export default DoctorCalendar;
