/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force full rebuild - cache bust 2026-02-26
  reactStrictMode: false,
}

export default nextConfig
