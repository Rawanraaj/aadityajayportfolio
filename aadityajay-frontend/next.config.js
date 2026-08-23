/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "www.publickhabar24.com" },
      { protocol: "https", hostname: "publickhabar24.com" },
    ],
  },
};

module.exports = nextConfig;
