/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["*"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
