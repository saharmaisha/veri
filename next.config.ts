import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['playwright-core'],
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

export default nextConfig;
