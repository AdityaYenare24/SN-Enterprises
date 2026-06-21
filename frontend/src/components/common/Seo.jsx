import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Seo({ title, description, keywords = [], image, path = '/' }) {
  const siteName = 'S N Enterprises';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Scaffolding Rental & Services`;
  const metaDescription =
    description ||
    'S N Enterprises offers premium scaffolding material rental, installation, and industrial access solutions in Pune and Maharashtra.';
  const canonicalUrl = `https://snenterprises.in${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}