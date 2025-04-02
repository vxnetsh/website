import { NextResponse } from "next/server";
import { members } from "@/lib/config";
import type { Member } from "@/types/member";

const GITHUB_API_URL = "https://api.github.com";
const CACHE_DURATION = 360 * 1000;
interface GitHubStats {
  repos: number;
  followers: number;
  contributions: number;
  stars: number;
  avatar_url: string;
  bio: string | null;
}

interface CacheEntry {
  data: GitHubStats | null;
  timestamp: number;
}

const statsCache: Map<string, CacheEntry> = new Map();

const getUser = async (username: string) =>
  fetch(`${GITHUB_API_URL}/users/${username}`, {
    next: { revalidate: 360 },
  }).then((r) => r.json());

const getEvents = async (username: string) =>
  fetch(`${GITHUB_API_URL}/users/${username}/events/public?per_page=100`, {
    next: { revalidate: 360 },
  }).then((r) => r.json());

const getRepos = async (username: string) =>
  fetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=pushed`, {
    next: { revalidate: 360 },
  }).then((r) => r.json());

async function fetchStats(username: string): Promise<GitHubStats | null> {
  const cached = statsCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const [user, events, repos] = await Promise.all([
      getUser(username),
      getEvents(username),
      getRepos(username),
    ]);

    if (user.message) return null;

    const cutoff = new Date(Date.now() - 2592e3);
    const recentEvents = events.filter(
      (e: any) => e.created_at && new Date(e.created_at) > cutoff,
    );

    const totalStars = repos.reduce(
      (acc: number, repo: any) => acc + (repo.stargazers_count ?? 0),
      0,
    );

    const stats = {
      repos: user.public_repos,
      followers: user.followers,
      contributions: recentEvents.length,
      stars: totalStars,
      avatar_url: user.avatar_url,
      bio: user.bio || null,
    };

    statsCache.set(username, {
      data: stats,
      timestamp: Date.now(),
    });

    return stats;
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    const users = members
      .filter((m: Member) => m.github)
      .map((m: Member) => m.github!);

    const results = await Promise.all(users.map(fetchStats));
    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ status: 403 });
  }
}
