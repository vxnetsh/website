export type GitHubStats = {
  repos: number;
  followers: number;
  contributions: number;
  stars: number;
  avatar_url: string;
  bio: string | null;
} | null;

export const fetchGitHub = async (
  usernames: string[],
): Promise<GitHubStats[]> => {
  try {
    const res = await fetch("/g", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });
    return res.json();
  } catch {
    return Array(usernames.length).fill(null);
  }
};
