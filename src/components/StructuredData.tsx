import React from 'react';

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://scalyui.itsrishabh.tech/#website",
        "url": "https://scalyui.itsrishabh.tech",
        "name": "Scaly",
        "description": "Scaly is a blazing fast, secure, and modern SaaS URL shortener, Link-in-Bio, and link management platform.",
        "publisher": {
          "@id": "https://scalyui.itsrishabh.tech/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://scalyui.itsrishabh.tech/#organization",
        "name": "Scaly",
        "url": "https://scalyui.itsrishabh.tech",
        "logo": "https://scalyui.itsrishabh.tech/og-image.png",
        "sameAs": [
          "https://twitter.com/18Rishabh",
          "https://instagram.com/rishabhpandey___",
          "https://github.com/rishabhpandey106"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
