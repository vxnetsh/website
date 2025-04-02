"use server";

import { Octokit } from "@octokit/rest";
import type { components } from "@octokit/openapi-types";
import { unstable_cache } from "next/cache";

const octokit = new Octokit();

type GitHubEvent = components["schemas"]["event"];

export type GitHubStats = {
  repos: number;
  followers: number;
  contributions: number;
  stars: number;
  avatar_url: string;
  bio: string | null;
} | null;

async function fetchGitHubStatsInternal(
  usernames: string[],
): Promise<GitHubStats[]> {
  try {
    const results = await Promise.all(
      usernames.map(async (username) => {
        try {
          const [{ data: user }, { data: events }, { data: repos }] =
            await Promise.all([
              octokit.rest.users.getByUsername({ username }),
              octokit.rest.activity.listPublicEventsForUser({
                username,
                per_page: 100,
              }),
              octokit.rest.repos.listForUser({
                username,
                per_page: 100,
                sort: "pushed",
              }),
            ]);

          const cutoff = new Date(Date.now() - 2592e3);
          const recentEvents = (events as GitHubEvent[]).filter(
            (e) => e.created_at && new Date(e.created_at) > cutoff,
          );

          const totalStars = repos.reduce(
            (acc, repo) => acc + (repo.stargazers_count ?? 0),
            0,
          );

          return {
            repos: user.public_repos,
            followers: user.followers,
            contributions: recentEvents.length,
            stars: totalStars,
            avatar_url: user.avatar_url,
            bio: user.bio || null,
          };
        } catch {
          return null;
        }
      }),
    );

    return results;
  } catch {
    return Array(usernames.length).fill(null);
  }
}

export const fetchGitHubStatsBatch = async (usernames: string[]) =>
  unstable_cache(fetchGitHubStatsInternal, ["ghs"], { revalidate: 3600 })(
    usernames,
  );
