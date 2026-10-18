/**
 * Optimiza las imágenes del portafolio: las redimensiona a un ancho
 * máximo y las convierte a WebP. Lee los nombres de archivo desde
 * src/db/data/proyectos.ts y busca cada imagen en una carpeta de origen.
 *
 * Uso:
 *   node scripts/optimizar-imagenes.mjs <carpeta-con-las-fotos-originales>
 *
 * La carpeta de origen es la carpeta Public/ del prototipo (o donde
 * hayas guardado las fotos reales de los proyectos). No se incluye en
 * el repositorio por su peso; cada quien la aporta localmente.
 *
 * Salida: public/imagenes/proyectos/<slug-del-proyecto>/<n>.webp
 * Esas imágenes sí se suben al repositorio y a Vercel: al pesar pocos
 * MB en total, no hace falta gastar la cuota de Vercel Blob en ellas.
 * Vercel Blob se reserva para las fotos que el panel de administración
 * suba más adelante (Paso 7).
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { proyectosSeed } from "../src/db/data/proyectos.ts";

const ANCHO_MAXIMO = 1600;
const CALIDAD_WEBP = 78;
const CARPETA_SALIDA = path.resolve("public/imagenes/proyectos");

async function buscarArchivo(carpetaOrigen, nombre) {
  const directo = path.join(carpetaOrigen, nombre);
  if (existsSync(directo)) return directo;
  // Búsqueda sin distinguir mayúsculas, por si el nombre no calza exacto
  const archivos = await readdir(carpetaOrigen);
  const encontrado = archivos.find(
    (a) => a.toLowerCase() === nombre.toLowerCase()
  );
  return encontrado ? path.join(carpetaOrigen, encontrado) : null;
}

async function main() {
  const carpetaOrigen = process.argv[2];
  if (!carpetaOrigen || !existsSync(carpetaOrigen)) {
    console.error(
      "Uso: node scripts/optimizar-imagenes.mjs <carpeta-con-las-fotos-originales>"
    );
    process.exit(1);
  }

  mkdirSync(CARPETA_SALIDA, { recursive: true });

  let pesoOriginal = 0;
  let pesoOptimizado = 0;
  let procesadas = 0;
  const noEncontradas = [];

  for (const proyecto of proyectosSeed) {
    const carpetaProyecto = path.join(CARPETA_SALIDA, proyecto.slug);
    mkdirSync(carpetaProyecto, { recursive: true });

    for (let i = 0; i < proyecto.imagenes.length; i++) {
      const nombreOriginal = proyecto.imagenes[i];
      const rutaOrigen = await buscarArchivo(carpetaOrigen, nombreOriginal);
      if (!rutaOrigen) {
        noEncontradas.push(`${proyecto.slug}: ${nombreOriginal}`);
        continue;
      }

      const rutaSalida = path.join(carpetaProyecto, `${i + 1}.webp`);
      pesoOriginal += statSync(rutaOrigen).size;

      await sharp(rutaOrigen)
        .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
        .webp({ quality: CALIDAD_WEBP })
        .toFile(rutaSalida);

      pesoOptimizado += statSync(rutaSalida).size;
      procesadas++;
    }
  }

  const mb = (bytes) => (bytes / 1e6).toFixed(1);
  console.log(`Imágenes procesadas: ${procesadas}`);
  console.log(`Peso original:    ${mb(pesoOriginal)} MB`);
  console.log(`Peso optimizado:  ${mb(pesoOptimizado)} MB`);
  console.log(
    `Reducción:        ${(100 - (pesoOptimizado / pesoOriginal) * 100).toFixed(0)}%`
  );
  if (noEncontradas.length) {
    console.log(`\nNo se encontraron ${noEncontradas.length} imágenes:`);
    noEncontradas.forEach((n) => console.log(`  - ${n}`));
  }
}

main();
