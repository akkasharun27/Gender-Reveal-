/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // ensure Turbopack uses this folder as the workspace root
    root: './',
  },
};

module.exports = nextConfig;
