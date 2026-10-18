import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes de proyectos que se suben desde el panel de
    // administración (Paso 7) se guardan en Vercel Blob, no en /public,
    // así que next/image necesita permiso explícito para ese dominio.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
