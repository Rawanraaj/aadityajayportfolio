/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "www.publickhabar24.com" },
      { protocol: "https", hostname: "publickhabar24.com" },
      { protocol: "https", hostname: "qbybwgcijfzqioxdmham.supabase.co" },
    ],
  },
};

module.exports = nextConfig;
