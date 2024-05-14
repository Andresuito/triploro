import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "triploro.es",
        port: "",
        pathname: "/uploads/",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
