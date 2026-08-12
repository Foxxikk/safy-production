/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Obrázky jsou předpřipravené webp ve správné velikosti — servírujeme je
    // přímo ze /public bez Vercel image optimizeru (rychlejší, bez limitů/cold-startu).
    unoptimized: true,
  },

  async rewrites() {
    return {
      // Na doméně safy-bx.vercel.app slouží kořen rovnou landing page ŠAFY BX,
      // takže sdílený odkaz je jen https://safy-bx.vercel.app
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "safy-bx.vercel.app" }],
          destination: "/safy-bx",
        },
        {
          source: "/:slug",
          has: [{ type: "host", value: "safy-bx.vercel.app" }],
          destination: "/safy-bx/:slug",
        },
      ],
    };
  },
};

export default nextConfig;
