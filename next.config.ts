import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // YouTube video thumbnails
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
    qualities: [75, 90], // 90 for video thumbnails, which show text and faces
  },
};

export default nextConfig;
