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
  eslint: {
    ignoreDuringBuilds: true,
  },

  rules: {
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    "@next/next/no-img-element": "off",
  },
};

export default nextConfig;
