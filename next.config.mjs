/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.spoonacular.com", "api.spoonacular.com"],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "api.spoonacular.com",
      port: "",
      pathname: "/**", // All paths
    },
  ],
};

export default nextConfig;
