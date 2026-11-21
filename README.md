# @jsm406/medusa-plugin-carrousel

> Plugin de Medusa v2 para gestión de Banners (Hero Slider). Permite administrar slides desde el panel de Medusa Admin y consumirlos desde el storefront en Next.js.

## 📦 Instalación como plugin

### 1. Compilar el plugin

```bash
npm run build
# o
npx medusa plugin:build
```

Esto generará la carpeta `.medusa/server` con el código compilado.

### 2. Publicar en npm

```bash
npm publish
```

### 3. Instalar en una aplicación Medusa

```bash
npm install @jsm406/medusa-plugin-carrousel
```

### 4. Registrar el plugin en `medusa-config.ts`

```ts
import { defineConfig } from "@medusajs/framework/utils"
import medusaPluginCarrousel from "@jsm406/medusa-plugin-carrousel"

export default defineConfig({
  // ... otras configuraciones ...
  plugins: [
    {
      resolve: "@jsm406/medusa-plugin-carrousel",
      options: {},
    },
  ],
  modules: [
    {
      resolve: "@jsm406/medusa-plugin-carrousel/modules/banner",
      // options: { ... }
    },
  ],
])
```

## 🛠️ Estructura del plugin

El plugin incluye:

- **Módulo backend**: `src/modules/banner/` con modelo `Banner` y servicio Medusa
- **Workflows**: `src/workflows/banner/` con `createBannerWorkflow`, `updateBannerWorkflow`, `deleteBannerWorkflow` (con compensación/rollback)
- **API Routes**: Rutas protegidas `/admin/banners` y públicas `/store/banners`
- **Interfaz Admin**: Ruta personalizada `/app/banners` en el panel de Medusa Admin
- **Componentes**: Subida de imágenes vía `POST /admin/uploads`, tabla con miniatura, estado, acciones editar/eliminar

## 📂 Estructura de carpetas

```text
src/
├── admin/
│   └── routes/
│       └── banners/
│           └── page.tsx          # Ruta personalizada: /app/banners
├── api/
│   ├── admin/
│   │   ├── banners/
│   │   │   ├── route.ts          # CRUD admin protegido
│   │   └── banners/
│   │       └── [id]/
│   │           └── route.ts      # PUT / DELETE admin con workflow
│   ├── store/
│   │   └── banners/
│   │       └── route.ts          # GET /store/banners (solo activos)
│   └── middlewares.ts            # Validación Zod para body de requests
├── components/
│   └── examples/
│       └── storefront/
│           └── BannerSlider.tsx  # Componente frontend (copy to Next.js app)
├── modules/
│   ├── banner/
│   │   ├── models/
│   │   │   └── banner.ts         # Definición modelo con model.define
│   │   ├── service.ts            # BannerModuleService extends MedusaService
│   │   └── index.ts              # Definición del módulo con BANNER_MODULE
│   └── index.ts                  # Exportaciones del módulo
└── workflows/
    └── banner/
        ├── types.ts                # Tipos compartidos
        ├── steps/
        │   ├── create-banner.ts
        │   ├── update-banner.ts
        │   └── delete-banner.ts
        ├── create-banner-workflow.ts
        ├── update-banner-workflow.ts
        └── delete-banner-workflow.ts
├── lib/
│   └── sdk.ts                    # Instancia Medusa JS SDK (opcional)
package.json
tsconfig.json
```

## 🚀 Flujo de trabajo

### Workflows incluidos

1. **`createBannerWorkflow`**: Crea un nuevo banner ejecutando el step `create-banner-step` con compensación que elimina el banner si falla.
2. **`updateBannerWorkflow`**: Actualiza un banner existente; si falla, restaura los valores anteriores.
3. **`deleteBannerWorkflow`**: Elimina un banner; si falla, intenta recrearlo con sus datos originales.

### Middlewares Zod

El archivo `src/api/middlewares.ts` exporta middlewares que validan el cuerpo de las peticiones `POST /admin/banners` y `POST /admin/banners/[id]` contra esquemas Zod que exigen `title` y `image_url` como campos obligatorios.

## 📦 Distribución del paquete npm

El paquete publicada en npm incluye solo los archivos compilados en `.medusa/server`:

- `.medusa/server/workflows/index.js` - Workflows exportados
- `.medusa/server/modules/banner/index.js` - Definición del módulo Banner
- `.medusa/server/src/admin/` - Extensiones de admin (ruta `/app/banners`)
- `.medusa/server/api/admin/banners/` - Rutas API administradas

El componente `BannerSlider.tsx` del storefront **no se incluye** en el paquete npm (está en `examples/storefront/`). Los usuarios deben copiarlo a su aplicación Next.js o publicarlo por separado.

## 🛠️ Desarrollo local

```bash
# Compilar y ver cambios en caliente
npm run dev

# O directamente con medusa CLI
npx medusa plugin:develop
```

Esto iniciará un servidor Medusa con el plugin instalado y verá cambios en tiempo real.

## 📄 Licencia

MIT# medusa-plugin-carrousel
