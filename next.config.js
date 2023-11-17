/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["media.lmneuquen.com"],
  },
};

module.exports = nextConfig;
