// @ts-check
 
/**
 * @type {import('next').NextConfig}
 *  */

const nextConfig = {
  compress:true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },
  images: {
    loader: 'akamai',
    path:'',
    domains: ['*', 'avatars.githubusercontent.com', 'wmcopusctlylwfirefsm.supabase.co'],
  },
  devIndicators: {
    appIsrStatus: false,
  },
  experimental: {
    serverComponentsHmrCache: true,
    optimizePackageImports: ['icon-library'],
    optimizeCss: true,
    serverSourceMaps: false,
    dynamicIO: false,
    cssChunking:true,
    disableOptimizedLoading:true,
    webpackMemoryOptimizations:true,
    optimisticClientCache:true,
    optimizeServerReact: true, 
    nextScriptWorkers: false,
  },
  webpack(config) {

    if (config.cache) {
      config.cache = {
        type: 'filesystem'
      };

    }

    config.optimization.minimize = true;

    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      module: false,
      util: false,
      tls: false,
      zlib: false,   
      crypto: false,
      events: false,    
      querystring: false,
      stream: false,
      assert: false,
    };

    return config;
  },
  productionBrowserSourceMaps: false,
  bundlePagesRouterDependencies: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
         { key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=59'},
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Vary', value: 'Accept-Encoding, User-Agent' }, 
        ],
      }
    ];
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  async redirects() {
    return [{ source: '/', destination: '/', permanent: true }];
  },
  async rewrites() {
    return [{ source: '/', destination: '/' }];
  },
};

export default nextConfig;
