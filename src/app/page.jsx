import scrapeData from "./server-functions/scrapedata";
import "cally"

export default async function Home() {
  const data = await scrapeData();
  const openEvents = []
  return (
    <main>
      <div className="flex flex-row m-4">
        <div className="box p-4 border-2 border-solid border-gray-200 rounded-xl">
          <calendar-range>
            <calendar-month></calendar-month>
          </calendar-range>
        </div>
      </div>
      <div className="events">
      {data.events.map((event) => (
        <div tabIndex={0} className="collapse bg-base-100 border-base-300 border">
          <div className="collapse-title font-semibold">
            <span className="text-primary-content"></span>
          </div>
          <div className="collapse-content text-sm">
            {event.description}
          </div>
        </div>
      ))}
      </div>
    </main>
  );
}
