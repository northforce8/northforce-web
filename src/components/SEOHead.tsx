import React from 'react';

interface SEOHeadProps {
  title: string;
  titleSv?: string;
  description: string;
  descriptionSv?: string;
  keywords?: string;
  keywordsSv?: string;
  canonicalUrl: string;
  structuredData?: object;
  breadcrumbs?: Array<{name: string, url: string}>;
  ogImage?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  titleSv,
  description,
  descriptionSv,
  keywords,
  keywordsSv,
  canonicalUrl,
  structuredData,
  breadcrumbs,
  ogImage = "https://northforce.io/og-image.jpg"
}) => {
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update Swedish meta description
    const metaDescriptionSv = document.querySelector('meta[name="description"][lang="sv"]');
    if (metaDescriptionSv && descriptionSv) {
      metaDescriptionSv.setAttribute('content', descriptionSv);
    }
    
    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update Swedish keywords
    const metaKeywordsSv = document.querySelector('meta[name="keywords"][lang="sv"]');
    if (metaKeywordsSv && keywordsSv) {
      metaKeywordsSv.setAttribute('content', keywordsSv);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }
    
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute('content', ogImage);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', canonicalUrl);
    }
    
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    }
    
    // Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }
    
    // Remove existing page-specific structured data scripts
    const existingPageScripts = document.querySelectorAll('script[type="application/ld+json"][data-page-specific]');
    existingPageScripts.forEach(script => script.remove());
    
    // Add page-specific structured data if provided
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-specific', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
    // Add breadcrumb structured data if provided
    if (breadcrumbs && breadcrumbs.length > 1) {
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-page-specific', 'true');
      breadcrumbScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      });
      document.head.appendChild(breadcrumbScript);
    }
  }, [title, titleSv, description, descriptionSv, keywords, keywordsSv, canonicalUrl, structuredData, breadcrumbs, ogImage]);

  return null;
};

export default SEOHead;