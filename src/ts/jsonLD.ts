import siteData from "../data/siteData.json";
import { createSlug } from "../lib/utils";

interface PostData {
  title: string;
  description: string;
  image: {
    src: string;
  };
  author: string;
  date: string;
}

interface JsonLDGeneratorParams {
  type: string;
  post?: PostData;
  url: string;
}

export default function jsonLDGenerator({ type, post, url }: JsonLDGeneratorParams): string {
  if (type === 'post' && post) {
    return `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${url}"
        },
        "headline": "${post.title}",
        "description": "${post.description}",
        "image": "${post.image.src}",
        "author": {
          "@type": "Person",
          "name": "${post.author}",
          "url": "/author/${createSlug(post.author)}"
        },
        "datePublished": "${post.date}"
      }
    </script>`;
  }
  return `<script type="application/ld+json">
      {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${import.meta.env.SITE}"
      }
    </script>`;
}
