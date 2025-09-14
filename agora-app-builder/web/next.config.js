const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
  webpack: (config) => {
    config.resolve.alias = { ...(config.resolve.alias || {}), '@': path.resolve(__dirname) };
    return config;
  },
  serverExternalPackages: ['ioredis'],
};
