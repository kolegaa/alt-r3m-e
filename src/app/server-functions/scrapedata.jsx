'use server';

import * as cheerio from "cheerio";
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

async function fetchWithRetry(url, options = {}, retries = 8, backoff = 2000) {
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

async function fetchevents(previousData) {
    try {
        const data = await fetchWithRetry('https://www.rock3miasto.pl/wydarzenie/');
        const $ = cheerio.load(data);
        const events = $('.eme_events_list').html().split('<br>').filter(Boolean);
        const hash = require('crypto').createHash('md5').update(events.join()).digest('hex');
        const lastfetch = new Date().toISOString();

        if (previousData && previousData.meta && ( new Date() -new Date(previousData.lastfetch > 1000 *60*60*2) || previousData.meta.hash === hash)) return previousData;
        
        const parsedEvents = await Promise.all(events.map(async (event, i) => {
            const parts = event.split('strong>');
            if (parts.length < 3) {
                console.warn('Unexpected event format:', event);
                return null;
            }
            
            const datelist = parts[0].slice(0, -2).trim().split('.');
            const date = new Date(datelist[2], datelist[1] - 1, datelist[0]);
            const titleMatch = parts[1].match(/>(.*?)<\/a>/);
            const location = parts[2].trim().slice(1, -1).split(", ");
            const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';
            const linkMatch = parts[1].match(/href="(.*?)"/);
            const link = linkMatch ? linkMatch[1] : 'No Link';
            const description = await getDescription(link);
            return { title, link, date, location, description, id: i };
        }));

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

export default async function scrapeData() {
    const filePath = path.join(process.cwd(), 'public', 'events.json');
    const data = await readFile(filePath, 'utf-8');
    try {
        return await fetchevents(data);
    } catch (error) {
        console.error('Error in scrapeData:', error);
        // Return existing data if fetch fails
        try {
            return JSON.parse(data);
        } catch (readError) {
            console.error('Error reading existing data:', readError);
            return { meta: {}, events: [] };
        }
    }
}
