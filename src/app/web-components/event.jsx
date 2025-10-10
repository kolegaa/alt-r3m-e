export default function Event({ event, filterData }) {
    let showEvent = true;
    
    // Date filtering
    if (filterData.startDate && filterData.endDate) {
        const eventDate = new Date(event.date);
        const startDate = new Date(filterData.startDate);
        const endDate = new Date(filterData.endDate);
        if (!(eventDate >= startDate && eventDate <= endDate)) {
            showEvent = false;
        }
    }
    
    // Location filtering
    if (showEvent && filterData.activeLocations.length > 0) {
        if (!filterData.activeLocations.some(loc => event.location.includes(loc))) {
            showEvent = false;
        }
    }
    
    // Search term filtering
    if (showEvent && filterData.searchTerm && filterData.searchTerm !== "") {
        const searchLower = filterData.searchTerm.toLowerCase();
        if (!(event.description.toLowerCase().includes(searchLower) || 
              event.title.toLowerCase().includes(searchLower))) {
            showEvent = false;
        }
    }
    
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
