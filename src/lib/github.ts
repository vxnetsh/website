import { Octokit } from "@octokit/rest";
import type { components } from "@octokit/openapi-types";

const octokit = new Octokit();

type GitHubEvent = components["schemas"]["event"];

export const fetchGitHubStats = async (username: string) => {
  try {
    const [{ data: user }, { data: events }] = await Promise.all([
      octokit.rest.users.getByUsername({ username }),
      octokit.rest.activity.listPublicEventsForUser({
        username,
        per_page: 100,
      }),
    ]);

    const cutoff = new Date(Date.now() - 2592e3);
    const recentEvents = (events as GitHubEvent[]).filter(
      (e) => e.created_at && new Date(e.created_at) > cutoff,
    );

    return {
      repos: user.public_repos,
      followers: user.followers,
      contributions: recentEvents.length,
      avatar_url: user.avatar_url,
      bio: user.bio || null,
    };
  } catch {
    return null;
  }
};
