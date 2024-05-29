import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["triploro.es", "localhost"],
    minimumCacheTTL: 0,
  },
};

export default withNextIntl(nextConfig);
