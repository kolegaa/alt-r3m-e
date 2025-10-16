"use client";
import "cally";
import { useState } from "react";

function toIso(date) {
  const s1 = date.split("T")[0].split("-");
  return `${s1[0]}-${s1[1]}-${parseInt(s1[2])+1}`
}

export default function Calendar({onChange,minDate,maxDate}) {
  const [value, setValue] = useState(toIso(minDate)+"/"+toIso(maxDate));
  const handleDateChange = (value) => {
    setValue(value);
    
    onChange(value.split("/").map(date=> new Date(toIso(date).split("."))));
  }
  return (
    <>
      <calendar-range min={toIso(minDate)} max={toIso(maxDate)} value={value}  onchange={(event) => handleDateChange(event.target.value)} class="cally bg-base-200 border border-base-300 rounded-box">
        <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
        <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
        <calendar-month style={{ '--color-text-on-accent': 'var(--color-primary-content)' }}></calendar-month>
      </calendar-range>
    </>
  );
}
