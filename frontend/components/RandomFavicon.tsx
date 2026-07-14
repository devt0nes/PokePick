"use client";

import { useEffect } from "react";

const favicons = [
  "/favicons/4c464565766459.5aff447e6aa48.webp",
  "/favicons/21b4f865766459.5aff447e6c6ef.webp",
  "/favicons/67d00665766459.5aff447e6c10d.webp",
  "/favicons/73fa3b65766459.5aff447e68b52.webp",
  "/favicons/859d8365766459.5aff447e69c25.webp",
  "/favicons/951b5d65766459.5aff447e69704.webp",
  "/favicons/989b0065766459.5aff447e690e0.webp",
  "/favicons/05581e65766459.5aff447e6bb51.webp",
  "/favicons/20186165766459.5aff447e6b01f.webp",
  "/favicons/a13b2165766459.5aff447e6b5bd.webp",
  "/favicons/e9625a65766459.5aff447e6a068.webp",
  "/favicons/f159d665766459.5aff447e6a64f.webp",
];

export default function RandomFavicon() {
  useEffect(() => {
    const icon = favicons[Math.floor(Math.random() * favicons.length)];

    let link = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    // Cache busting so browsers don't keep the old icon
    link.href = `${icon}?v=${Date.now()}`;
  }, []);

  return null;
}