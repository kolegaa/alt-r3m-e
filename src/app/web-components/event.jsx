
export default function Event({ event,filterData }) {
    let showEvent = true;
    if (!(new Date(filterData.endDate) > new Date(event.date) > new Date(filterData.startDate))) {
        showEvent = false;
    }
    else if (filterData.startDate != null && filterData.endDate != null) {
        showEvent = false;
    } else if (!filterData.activelocations.includes(event.location[0]) && filterData.activelocations.length != 0) { 
        showEvent = true;
    } else if (filterData.searchTerm && filterData.searchTerm != ""&& (!event.description.tolowerCase().includes(filterData.searchTerm.toLowerCase()) || !event.title.toLowerCase().includes(filterData.searchTerm.toLowerCase()))) {
        showEvent = false;
    }
    showEvent = true;
    if (!showEvent) return null;
    return (
    <div key={event.id} tabIndex={0} className="w-auto collapse border-base-300 border-1 p-2 bg-base-200 m-4 rounded-box">
        <div className="collapse-title font-semibold">
            <span className="text-primary-content bg-primary p-2 rounded-selector font-semibold">{event.title}</span>   
            {" "+new Date(event.date).toDateString()} - <div className="badge badge-secondary">{event.location.join(", ")}</div>
        </div>
        <div className="collapse-content text-sm whitespace-pre-wrap">{event.description}</div>
    </div>
    );
};