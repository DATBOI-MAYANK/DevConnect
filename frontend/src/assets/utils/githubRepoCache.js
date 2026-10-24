import axios from "axios";

const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export const fetchGithubRepos = async (baseUrl, username, repoNames) => {
  const names = [...new Set(repoNames.filter(Boolean))].sort();
  if (!username || names.length === 0) return [];

  const key = `${baseUrl}${username}/${names.join(",")}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const request = Promise.all(
    names.map((name) => axios.get(`${baseUrl}${username}/${name}`)),
  )
    .then((responses) => {
      const data = responses.map((response) => response.data);
      cache.set(key, { data, timestamp: Date.now() });
      return data;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, request);
  return request;
};
