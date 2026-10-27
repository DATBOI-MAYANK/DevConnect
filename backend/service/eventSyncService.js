import { Events } from "../models/events.model";
import { ApiError } from "../utils/ApiError";
import parseDate from "../utils/dataHelper";


async function syncEvents() {
  try {
    let res = await fetch("https://developers.events/all-events.json")
    let rawData = res.json()
    const currentDate = new Date();

    for (const rawEvent in rawData) {
      const { startDate, endDate } = parseDate(rawEvent.date)

      if (!startDate || startDate < currentDate) {
        continue;
      }

      await Events.updateOne(
        { url: rawEvent.hyperlink },
        {
          title: rawEvent.name,
          url: rawEvent.hyperlink,
          startDate: startDate,
          endDate: endDate,
          location: {
            city: rawEvent.city,
            country: rawEvent.country,
            online: rawEvent.location?.toLowerCase().includes('online') || false
          },
        tags: rawEvent.tags || []
        },
        {upsert : true}
      )
    }
  } catch (err) {
    throw new ApiError(500, "Failed to sync events", err);
 }

}

export default syncEvents;
