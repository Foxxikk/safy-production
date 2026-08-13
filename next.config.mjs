/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    // Obrázky jsou předpřipravené webp ve správné velikosti — servírujeme je
    // přímo ze /public bez Vercel image optimizeru (rychlejší, bez limitů/cold-startu).
    unoptimized: true,
  },

  async rewrites() {
    return {
      // Na doméně safy-bx.vercel.app slouží kořen rovnou landing page ŠAFY BX.
      // Přepisujeme ZÁMĚRNĚ jen kořen — jakékoli obecnější pravidlo (např. /:slug)
      // chytá i /safy-bx/<slug> a přepíše ho podruhé na /safy-bx/safy-bx/... → 404.
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "safy-bx.vercel.app" }],
          destination: "/safy-bx",
        },
      ],
    };
  },
};

export default nextConfig;
