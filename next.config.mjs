import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["triploro.es"],
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
