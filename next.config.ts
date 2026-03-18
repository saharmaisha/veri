import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: false,
  images: {
    remotePatterns: [
      // Unsplash (mock data)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Pinterest
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: '*.pinimg.com' },
      // Google Shopping / SerpAPI thumbnails
      { protocol: 'https', hostname: '*.gstatic.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.ggpht.com' },
      // Common retailer CDNs returned by shopping providers
      { protocol: 'https', hostname: '*.asos-media.com' },
      { protocol: 'https', hostname: '*.zara.com' },
      { protocol: 'https', hostname: '*.hm.com' },
      { protocol: 'https', hostname: '*.gap.com' },
      { protocol: 'https', hostname: '*.nordstrom.com' },
      { protocol: 'https', hostname: '*.target.com' },
      { protocol: 'https', hostname: '*.uniqlo.com' },
      { protocol: 'https', hostname: '*.mango.com' },
    ],
  },
};

// #region agent log
fetch('http://127.0.0.1:7577/ingest/a4e61bef-d74d-4cc1-8652-c2211ce496d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'392286'},body:JSON.stringify({sessionId:'392286',runId:'startup',hypothesisId:'H2',location:'next.config.ts:28',message:'next config evaluated',data:{compressSetting:'compress' in nextConfig ? nextConfig.compress ?? null : 'unset',hasImages:Boolean(nextConfig.images)},timestamp:Date.now()})}).catch(()=>{});
// #endregion

export default nextConfig;
