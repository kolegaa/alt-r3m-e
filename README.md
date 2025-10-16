## What is this?

This is a project which scrapes the events happening in Trójmiasto from the [rock3miasto](https://www.rock3miasto.pl) website and displys them with filters.

## Why?

Because i didn't want to look throught the events one by one.

## How?

[Cheerio](https://github.com/cheeriojs/cheerio) is used to scrape the data, the ui is built with [React](https://react.dev/), [Next.js](https://nextjs.org/), [Tailwindcss](https://tailwindcss.com/) and [Daisyui](https://daisyui.com/). The font used is [Sometype mono](https://github.com/googlefonts/sometype-mono).

## Roadmap

- [x] Better search algorithm
- [ ] Save search index to not reindex the event at each search
- [ ] Add more sources for the events
- [ ] Add a map to display where the event is happening
- [ ] Add a calendar to display all the events happening
- [ ] Use a different method for passing the filter data to the servers
- [ ] Better caching to avoid fetching the same description multiple times
- [ ] Add a price filter

## Getting Started

First, run the development server (bun runtime is reccomended):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.