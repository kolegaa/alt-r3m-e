function levenshteinDistance(s1, s2) {
    const matrix = [];

    for (let i = 0; i <= s1.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= s2.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,    // Deletion
                matrix[i][j - 1] + 1,    // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }
    return matrix[s1.length][s2.length];
}


function KMP(text, pattern) {
    const lps = buildLPS(pattern);
    const results = [];
    let i = 0;  // index for text
    let j = 0;  // index for pattern

    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }
        if (j === pattern.length) {
            results.push(i - j);  // Pattern found, store the index
            j = lps[j - 1];
        } else if (i < text.length && text[i] !== pattern[j]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return results;
}

function buildLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}


function fuzzySearch(text, pattern, allowedDistance) {
    const results = [];
    const textLength = text.length;
    const patternLength = pattern.length;

    for (let i = 0; i <= textLength - patternLength; i++) {
        const substring = text.slice(i, i + patternLength);
        const distance = levenshteinDistance(substring, pattern);
        if (distance <= allowedDistance) {
            results.push({ index: i, substring: substring, distance: distance });
        }
    }

    return results;
}

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
        const searchable = (event.description + " " + event.title).toLowerCase();
        const result = fuzzySearch(searchable, searchLower, 1);
        if (result.length === 0) {
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
