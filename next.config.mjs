/** @type {import('next').NextConfig} */
const nextConfig = {
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
