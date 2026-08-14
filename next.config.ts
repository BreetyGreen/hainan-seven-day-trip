import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "1";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "hainan-seven-day-trip";
const basePath = isGithubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: isGithubPages,
  webpack(config, { isServer }) {
    if (process.env.SINGLE_CHUNK_BUILD === "1" && !isServer) {
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = "single";
    }
    return config;
  },
};

export default nextConfig;
