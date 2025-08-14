import React, { useContext, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { DoctorContext } from "../../Context/DoctorContext";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const DoctorCalendar = () => {
  const { appointments, handleCancel, updateAppointmentStatus } =
    useContext(DoctorContext);
  const [events, setEvents] = useState([]);

  // Convert string to Date object
  const parseCustomDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return null;
    const [datePart, timePart] = dateString.split(" at ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/");
    let hour, minute;

    if (
      timePart.toLowerCase().includes("am") ||
      timePart.toLowerCase().includes("pm")
    ) {
      let [time, meridian] = timePart.split(" ");
      [hour, minute] = time.split(":").map(Number);
      meridian = meridian.toLowerCase();
      if (meridian === "pm" && hour !== 12) hour += 12;
      if (meridian === "am" && hour === 12) hour = 0;
    } else {
      [hour, minute] = timePart.split(":").map(Number);
    }

    return new Date(year, month - 1, day, hour, minute);
  };

  // Convert Date object back to string
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

  // Sync events from context
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
          title: a.patientName || "Unknown Patient",
          start: parsedDate,
          end: new Date(parsedDate.getTime() + 30 * 60000),
          resource: a,
        };
      })
      .filter(Boolean);
    setEvents(parsedEvents);
  }, [appointments]);

  const handleEventDrop = ({ event, start }) => {
    const newDate = formatDateTimeToCustom(start);
    const updatedEvent = {
      ...event.resource,
      datetime: newDate,
      appstatus: "Rescheduled",
    };
    updateAppointmentStatus(event.id, updatedEvent);
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [events]);

  const EventComponent = ({ event }) => {
    const status = event.resource?.appstatus || "Pending";

    const bgColor =
      status === "Confirmed"
        ? "bg-green-500 text-white"
        : status === "Cancelled"
        ? "bg-red-500 text-white"
        : status === "Rescheduled"
        ? "bg-yellow-400 text-black"
        : "bg-blue-500 text-white";

    // Tooltip content
    const tooltipText = `
      <b>Patient:</b> ${event.resource?.patientName || "Unknown"}<br/>
      <b>Age:</b> ${event.resource?.patientAge || "-"}<br/>
      <b>Gender:</b> ${event.resource?.patientGender || "-"}<br/>
      <b>Phone:</b> ${event.resource?.patientPhone || "-"}<br/>
      <b>Email:</b> ${event.resource?.patientEmail || "-"}<br/>
      <b>Time:</b> ${event.resource?.datetime || "-"}<br/>
      <b>Status:</b> ${status}
    `;

    return (
      <div
        className={`p-1 px-2 rounded shadow-sm ${bgColor} flex justify-between items-center cursor-pointer hover:shadow-md transition`}
        data-tip={tooltipText}
        data-html={true}
      >
        <span className="font-medium text-xs truncate">
          {event.resource?.patientName || "Unknown"} ({status})
        </span>
        {status !== "Cancelled" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel(event.id);
            }}
            className="ml-2 text-[10px] bg-white text-red-600 px-1 rounded hover:bg-red-100"
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
      <ReactTooltip place="top" type="dark" effect="solid" html={true} multiline={true} />
    </div>
  );
};

export default DoctorCalendar;
