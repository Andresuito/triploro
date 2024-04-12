import { MetadataRoute } from "next";

export default async function sitemap() : Promise<MetadataRoute.Sitemap> {
  return[
    {
      url: "https://triploro.com/en/",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/es/",
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: "https://triploro.com/pt/",
      lastModified: new Date(),
      changeFrequency: "daily",
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
      url: "https://triploro.com/pt/itineraries",
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