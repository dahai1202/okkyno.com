import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEOHead({ 
  title = "Okkyno - Premium Plants & Garden Supplies",
  description = "Discover premium plants, garden tools, and accessories. From indoor plants to outdoor gardens, find everything you need to create your perfect green space.",
  image = "/icon.svg",
  url = "https://okkyno.com",
  type = "website"
}: SEOHeadProps) {
  const fullTitle = title.includes('Okkyno') ? title : `${title} | Okkyno`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Okkyno" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="author" content="Okkyno" />
      <meta name="keywords" content="plants, gardening, indoor plants, outdoor plants, garden tools, plant care, nursery, green thumb" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Okkyno",
          "description": description,
          "url": url,
          "logo": image,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "(800) 555-1234",
            "contactType": "Customer Service"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Garden Way",
            "addressLocality": "Plantville",
            "addressRegion": "CA",
            "postalCode": "94567"
          }
        })}
      </script>
    </Helmet>
  );
}