import cron from "node-cron";
import { ApiError } from "../utils/ApiError";
import syncEvents from "../service/eventSyncService";


function initCronJob() {
  cron.schedule('0 0 * * 0', async () => {
    try {
      await syncEvents();
    } catch (err) {
      throw new ApiError(500,'❌ [Cron Job] Event sync failed:', err)
    }
  })
}


export default initCronJob;
