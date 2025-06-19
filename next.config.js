const nextConfig = {
  images: {
    domains: ["your-domain.com"], // Add your image domains here
    unoptimized: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  serverActions: {
    allowedOrigins: ["http://localhost:3000"],
  },
};

module.exports = nextConfig;
