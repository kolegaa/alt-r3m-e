'use server';

const cliProgress = require('cli-progress');
import * as cheerio from "cheerio";
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

async function fetchWithRetry(url, options = {}, retries = 8, backoff = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        } catch (error) {
            console.log(`Fetch attempt ${i + 1} failed: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, backoff));
        }
    }
    console.log('All fetch attempts failed for url:', url);
}

async function getDescription(link) {
    try {
        const data = await fetchWithRetry(link);
        const $ = cheerio.load(data);
        const description = $('.entry-content').text().trim();
        return description;
    } catch (error) {
        return 'No description available';
    }
}

async function fetchevents(previousData,forceRefetch) {
    
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    try {
        const lastfetch = new Date().toISOString();
        const timeSinceLastFetch = new Date()-new Date(previousData.meta.lastfetch)
        
        if (previousData && previousData.meta && !forceRefetch&&timeSinceLastFetch/1000/60/60 < 6){console.log("Data is " + timeSinceLastFetch/1000/60/60 + " hours old, Retruning old data"); return previousData};

        const data = await fetchWithRetry('https://www.rock3miasto.pl/wydarzenie/');
        const $ = cheerio.load(data);
        const events = $('.eme_events_list').html().split('<br>').filter(Boolean);
        const hash = require('crypto').createHash('md5').update(events.join()).digest('hex');
        
        if (previousData && previousData.meta && !forceRefetch&&previousData.meta.hash === hash) {console.log("Data is the same, Retruning old data"); return previousData};
        
        console.log("Data is " + timeSinceLastFetch/1000/60/60 + " hours old, Fetching new data")
        const parsedEvents = [];
        progressBar.start(events.length, 0);
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const parts = event.split('strong>');
            if (parts.length < 3) {
                console.warn('Unexpected event format:', event);
                parsedEvents.push(null);
                continue;
            }
            
            const datelist = parts[0].slice(0, -2).trim().split('.');
            const date = new Date(datelist[2], datelist[1] - 1, datelist[0]);
            const titleMatch = parts[1].match(/>(.*?)<\/a>/);
            const location = parts[2].trim().slice(1, -1).split(", ");
            const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';
            const linkMatch = parts[1].match(/href="(.*?)"/);
            const link = linkMatch ? linkMatch[1] : 'No Link';
            const description = await getDescription(link);
            parsedEvents.push({ title, link, date, location, description, id: i });
            progressBar.increment();
        }
        progressBar.stop();

        const locations = {};
        parsedEvents.forEach(event => {
            if (event && event.location[0]) {
                if (!locations[event.location[0]]) {
                    locations[event.location[0]] = [];
                }
                if (!locations[event.location[0]].includes(event.location[1])) {
                    locations[event.location[0]].push(event.location[1]);
                }
            }
        });

        const result = {
            meta: {
                locations,
                lastfetch,
                hash
            },
            events: parsedEvents.filter(event => event !== null)
        };

        // Save to public/events.json
        const filePath = path.join(process.cwd(), 'public', 'events.json');
        await writeFile(filePath, JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error('Error in fetchevents:', error);
        throw error;
    }
}

export default async function scrapeData(forceRefetch=false) {
    const filePath = path.join(process.cwd(), 'public', 'events.json');
    try {
        const data = await readFile(filePath, 'utf-8').then(content => JSON.parse(content)); 
        try {
            return await fetchevents(data,forceRefetch);
        } catch (error) {
            console.error('Error in scrapeData:', error);
            try {
                return data;
            } catch (readError) {
                console.error('Error reading existing data:', readError);
                return { meta: {}, events: [] };
            }
        }
    }
    catch (error) {
        console.error('Error reading existing data:', error);
        const data = await fetchevents({ meta: {hash:""}, events: [] })
        return data
    }
    
}
