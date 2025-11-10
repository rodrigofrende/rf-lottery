# RF Lottery

Aplicación web enfocada en sorteos en vivo para comunidades y creadores de contenido. Permite cargar participantes, asignarles chances personalizadas, elegir múltiples ganadores al instante y anunciar resultados con una experiencia visual pensada para streaming o activaciones de marca.

## Características clave

- Gestión completa de participantes con validaciones, edición y eliminación sin recargar la página.
- Asignación de chances ponderadas y sorteo configurable para seleccionar uno o varios ganadores.
- Persistencia local automática para reanudar sorteos interrumpidos.
- Overlay de resultados, animaciones y confetti para momentos de anuncio en vivo.
- Espacio de anuncios adaptable (`AdBanner`) listo para integrar AdSense u otras redes publicitarias cuando estén disponibles.
- Diseño responsive mobile-first con una estética oscura orientada a pantallas grandes.

## Stack y arquitectura

- **Framework:** React 19 + Vite.
- **Lenguaje:** TypeScript con tipado estricto.
- **Estilos:** Tailwind CSS 4 (modo `@tailwindcss/vite`) y clases utilitarias personalizadas.
- **Estado:** Hooks de React (`useState`, `useMemo`, `useEffect`) y almacenamiento `localStorage`.
- **Utilidades:** Funciones puras en `src/utils/raffle.ts` para el algoritmo de sorteos ponderados.
- **Infraestructura:** Optimizada para despliegues en Vercel.

## Requisitos previos

- Node.js 18 o superior.
- npm (o el gestor de paquetes de tu preferencia compatible con Vite).

## Puesta en marcha

```bash
npm install
npm run dev
```

El servidor de desarrollo arrancará en `http://localhost:5173` (puerto configurable por Vite).

### Scripts disponibles

- `npm run dev`: inicia Vite en modo desarrollo con recarga en caliente.
- `npm run build`: ejecuta `tsc` para comprobar tipos y construye la versión optimizada.
- `npm run preview`: sirve la build resultante para validación previa al despliegue.

## Variables de entorno

Todas las variables se definen en un archivo `.env` o `.env.local`.

| Variable                     | Descripción                                                                 | Default                          |
| --------------------------- | --------------------------------------------------------------------------- | -------------------------------- |
| `VITE_ADSENSE_CLIENT_ID`    | Identificador del cliente AdSense. Si falta, el banner muestra un placeholder. | `ca-pub-XXXXXXXXXXXXXXXX`        |
| `VITE_ADSENSE_SLOT_ID`      | Slot asociado al bloque de anuncios configurado en AdSense.                 | `0000000000`                     |

Ambas variables son opcionales: la aplicación funciona sin anuncios, mostrando contenido de relleno en la UI.

## Despliegue

1. Ejecutá `npm run build` para generar la carpeta `dist`.
2. Publicá la build en Vercel (o cualquier hosting compatible con aplicaciones Vite).
3. Si utilizás AdSense, recordá añadir el script recomendado por Google en `index.html` y configurar las variables `VITE_*` en el panel de tu proveedor.

## Estructura del proyecto

```
src/
  components/    # UI principal: formularios, listas, overlays, banner de anuncios
  hooks/         # Hooks personalizados (ej. tamaño de ventana)
  utils/         # Lógica del sorteo y helpers
  App.tsx        # Orquestación del flujo de sorteos
  main.tsx       # Entrada de React
```

## Próximos pasos sugeridos

- Integrar métricas o un panel de analytics para medir conversiones por sorteo.
- Permitir exportar e importar participantes en formato CSV/JSON.
- Añadir soporte para múltiples bloques publicitarios o formatos patrocinados.

---

RF Lottery está diseñada para reducir la fricción al momento de organizar giveaways. Ideal para equipos que buscan dinamizar sus eventos en cuestión de minutos.

