import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imagen mínima para Cloud Run (ver Dockerfile)
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Assets públicos en Cloud Storage (bucket de assets, Ola 2)
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
