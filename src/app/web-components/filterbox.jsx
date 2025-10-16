"use client";
import { useState } from "react";
import Calendar from "./calendar"
import CheckboxTree from "./checkbox-tree"
import Link from "next/link";

export default function FilterBox({basedata, prevFilters}) {
    const minDate=prevFilters.startDate ? prevFilters.startDate : basedata.events[0].date;
    const maxDate=prevFilters.endDate ? prevFilters.endDate : basedata.events[basedata.events.length-1].date;

    const [activeLocations,setActiveLocations] = useState(prevFilters.activeLocations || [] );
    const [dateRange,setDateRange] = useState((minDate.split("T")[0]+"/"+maxDate.split("T")[0]).split("/").map(date=> new Date(date.split("."))))
    const [searchTerm,setSearchTerm] = useState(prevFilters.searchTerm || "")
    const [sortBy,setSortBy] = useState(prevFilters.sortby || "relevance")

    const resetField = () => {
        document.getElementById("search").value = "";
        setSearchTerm("");
    }
    return (
    <div className="flex flex-row flex-wrap m-4 sticky top-2 z-10 w-full gap-y-2 gap-x-4 mr-0">
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn p-4! border-1 border border-base-300 rounded-field">Date</div>
            <div className="dropdown-content p-2 pl-0 rounded-field">
                <Calendar minDate={minDate} maxDate={maxDate} onChange={setDateRange} />
            </div>
        </div>
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn p-4! border-1 border border-base-300 rounded-field">Locations</div>
            <div className="dropdown-content rounded-field p-2 pl-0 max-h-96 w-100 overflow-y-auto">
                <CheckboxTree dict={basedata.meta.locations} prevChecked={prevFilters.activeLocations} onChange={setActiveLocations}  />
            </div>
        </div>
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn w-max p-4! border-1 border border-base-300 rounded-field">Sort by</div>
            <div className="dropdown-content p-2 pl-0">
                <div className="bg-base-200 border border-base-300 rounded-box flex flex-col p-3 w-max gap-4 align-items-center justify-items-center">
                    <label className="label">
                        <input type="radio" value="relevance" name="sortby" className="radio m-1" defaultChecked onChange={e=>setSortBy(e.target.value)} />
                        Relevance
                    </label>
                    <label className="label">
                        <input type="radio" value="dateAsc" name="sortby" className="radio m-1" onChange={e=>setSortBy(e.target.value)}/>
                        Date: Ascending
                    </label>
                    <label className="label">
                        <input type="radio" value="dateDesc" name="sortby" className="radio m-1" onChange={e=>setSortBy(e.target.value)}/>
                        Date: Descending
                    </label>
                </div>
            </div>
        </div>
        <label className="input rounded-field bg-base-200 border border-base-300 shrink w-56 basis-auto">
            <svg className="h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
            </svg>
            <input id="search" value={searchTerm} type="search" className="shrink w-48" placeholder="Search" onChange={(event)=>setSearchTerm(event.target.value)} />
        </label>
        <div className="join rounded-field flex-none ">
            <Link href={{pathname:"/",query:{
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
                activeLocations: activeLocations,
                searchTerm: searchTerm,
                sortBy: sortBy}}} ><button className="btn join-item btn-secondary">Apply</button></Link>
            <Link href={{pathname:"/"}} onClick={resetField}><button className="btn join-item btn-primary">Reset</button></Link>
        </div>
    </div>
    )};