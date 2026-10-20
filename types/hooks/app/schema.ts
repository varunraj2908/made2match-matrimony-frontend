// JSON-LD Structured Data for Made2Match
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Made2Match",
  "url": "https://made2match.in",
  "logo": "https://made2match.in/golden-hearts.png",
  "description": "Find your perfect life partner with Made2Match — verified profiles, smart matches and a trusted matrimony experience.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressRegion": "Kerala"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXX-XXX-XXXX",
    "contactType": "Customer Service",
    "areaServed": "IN",
    "availableLanguage": ["English", "Malayalam", "Hindi"]
  },
  "sameAs": [
    "https://facebook.com/made2match",
    "https://instagram.com/made2match",
    "https://twitter.com/made2match"
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Made2Match",
  "url": "https://made2match.in",
  "description": "Find your perfect life partner with Made2Match — verified profiles, smart matches and a trusted matrimony experience.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://made2match.in/profiles?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})
