import { MetadataRoute } from "next";

export default async function sitemap() : Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  return[
    {
      url: "https://triploro.com/",
      lastModified: currentDate,
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/en/",
      lastModified: currentDate,
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/es/",
      lastModified: currentDate,
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/pt/",
      lastModified: currentDate,
      changeFrequency: "hourly",
    },
    {
      url: "https://triploro.com/es/itineraries",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/en/itineraries",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/itineraries",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/en/destinations",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/destinations",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/destinations",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/destinations/country/spain",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/en/destinations/country/spain",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/destinations/country/spain",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/destinations/country/portugal",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/en/destinations/country/portugal",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/destinations/country/portugal",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/en/help",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/help",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/help",
      lastModified: currentDate,
      changeFrequency: "daily",
    },
  ]
}