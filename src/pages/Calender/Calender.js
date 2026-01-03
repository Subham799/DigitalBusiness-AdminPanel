import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Calender.css";
import useCalender from "../../store/Calender";
import { createEventId } from "../../data/data";
/* eslint-disable no-restricted-globals */

const Calender = () => {
  const { currentEvents, setCurrentEvents } = useCalender();

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const handleDataSelect = (selectInfo) => {
    let title = prompt("Please enter the title for the event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {
    if (confirm("Are you sure you want to delete it ?")) {
      clickInfo.event.remove();
    }
  };

  return (
    <div className="calender-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        allDaySlot={false}
        initialView="timeGridWeek"
        slotDuration="01:00:00"
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        nowIndicator
        initialEvents={currentEvents}
        eventsSet={handleEvents}
        select={handleDataSelect}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default Calender;
