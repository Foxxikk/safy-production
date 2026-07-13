/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Obrázky jsou předpřipravené webp ve správné velikosti — servírujeme je
    // přímo ze /public bez Vercel image optimizeru (rychlejší, bez limitů/cold-startu).
    unoptimized: true,
  },
};

export default nextConfig;
