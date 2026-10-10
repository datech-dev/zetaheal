/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@zetaheal/shared-types', '@zetaheal/validation', '@zetaheal/ui-tokens'],
};

module.exports = nextConfig;
