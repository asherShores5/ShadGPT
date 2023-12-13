/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // Keep as is for server-side use only
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // Prefix with NEXT_PUBLIC_ for client-side exposure
    NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME
  }
}

module.exports = nextConfig;

