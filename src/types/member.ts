import type { GitHubStats } from "@/lib/actions";

export type Project = {
  name: string;
  description: string;
  icon?: string;
  url: string;
  type: "website" | "github";
};

export type Member = {
  name: string;
  link: string;
  github?: string;
  discord_id?: string;
  projects?: Project[];
  stats?: GitHubStats;
};
