import { MetadataRoute } from "next";

export default async function sitemap() : Promise<MetadataRoute.Sitemap> {
  return[
    {
      url: "https://triploro.com/",
      lastModified: new Date(),
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/en/",
      lastModified: new Date(),
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/es/",
      lastModified: new Date(),
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/pt/",
      lastModified: new Date(),
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/en/destinations",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/destinations",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/destinations",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://www.triploro.com/es/destinations/country/spain",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://www.triploro.com/en/destinations/country/spain",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://www.triploro.com/pt/destinations/country/spain",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://www.triploro.com/es/destinations/country/portugal",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://www.triploro.com/en/destinations/country/portugal",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://www.triploro.com/pt/destinations/country/portugal",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/en/help",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/help",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/help",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
  ]
}