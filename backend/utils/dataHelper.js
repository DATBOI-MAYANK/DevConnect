
const  parseDate = async (rawDate) => {
  const dateStr = String(rawDate);

    // If the string length indicates two concatenated 13-digit millisecond timestamps
    if (dateStr.length >= 26) {
      const startEpoch = Number(dateStr.slice(0, 13));
      const endEpoch = Number(dateStr.slice(13, 26));
      return {
        startDate: new Date(startEpoch),
        endDate: new Date(endEpoch)
      };
    }

    // If it's a single 13-digit epoch timestamp
    if (dateStr.length >= 13) {
      const epoch = Number(dateStr.slice(0, 13));
      return {
        startDate: new Date(epoch),
        endDate: null
      };
    }


    return {
      startDate: new Date(rawDate),
      endDate: null
    };
}

export default parseDate;
