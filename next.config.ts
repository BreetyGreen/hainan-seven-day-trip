import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "1";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "hainan-seven-day-trip";
const basePath = isGithubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: isGithubPages,
};

export default nextConfig;
