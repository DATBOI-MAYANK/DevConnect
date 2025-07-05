import { useState, useEffect } from "react";
import axios from "axios";

function useFetchRepos(username) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!username) return;
    const fetchRepos = async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );

        setRepos(res.data);
      } catch (error) {
        console.error("GitHub API error:", error);
      }
    };
    fetchRepos();
  }, [username]);

  return repos;
}

export default useFetchRepos;