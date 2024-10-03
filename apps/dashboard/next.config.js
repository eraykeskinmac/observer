/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
    CLICKHOUSE_USERNAME: process.env.CLICKHOUSE_USERNAME,
    CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD,
    CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE,
  },
  transpilePackages: ['ui'],
};