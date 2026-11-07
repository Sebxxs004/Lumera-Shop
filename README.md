# LUMÉRA — Architectural Boutique & Beauty

Plataforma web frontend de comercio electrónico para **LUMÉRA**, diseñada bajo el sistema visual de `Skills/DESIGN2.md` (*"editorial spec sheet on warm charcoal"*), con arquitectura modular en **React + TypeScript + Vite**, principio de **Single Responsibility (SRP)** y preparación lista para despliegue en **Vercel**.

---

## ✨ Sistema de Diseño (`Skills/DESIGN2.md`)

- **Paleta Monocromática Arquitectónica + Acento Puntual**:
  - **Warm Charcoal (`#24170f`)**: Botones de acción primaria rellenos, franjas de contraste oscuro (*Category Split Banner*, barra superior) y bordes estructurales.
  - **Soft Black (`#151515`)**: Tipografía estructural, enlaces, precios y especificaciones sobre fondo claro.
  - **Pure White (`#ffffff`)**: Lienzo principal de galería donde las fotografías de prendas y maquillaje son las protagonistas.
  - **Ash Gray (`#ececec`)**: Superficie secundaria para secciones alternadas (*Lookbook Network*, paneles de filtro).
  - **Signal Blue (`#0073ff`)**: Reservado exclusivamente para bordes y texto de insignias de novedad (`NEW IN` / `LIMITED EDITION`).
- **Disciplina Tipográfica Dual**:
  - **Display (`--font-nimbus-sans-extended`)**: *Barlow Condensed / Oswald / Bebas Neue* en mayúsculas con *letter-spacing* amplio (`4px–8px`) para titulares de carácter arquitectónico.
  - **Cuerpo y Especificaciones (`--font-gt-america-mono`)**: *JetBrains Mono / IBM Plex Mono* para toda la interfaz funcional, navegación, nombres de producto, precios, tallas, tonos y botones.
- **Geometría `0px` (Sharp Edges)**:
  - `0px border-radius` en tarjetas, fotografías *full-bleed*, botones, selectores de talla, *swatches* e inputs.

---

## 🏛️ Arquitectura Modular (Single Responsibility)

```text
├── assets/                   # Activos originales de marca en tono oscuro (LUMERA-PNG.png, lumera_favicon.svg)
├── public/assets/            # Activos públicos servidos estáticamente por Vite
├── Skills/
│   ├── DESIGN.md             # Especificación de diseño v1
│   └── DESIGN2.md            # Especificación activa: Editorial Spec Sheet on Warm Charcoal
├── src/
│   ├── styles/
│   │   ├── tokens.css        # Variables CSS de DESIGN2.md (colores, escalas tipográficas, radios 0px)
│   │   └── global.css        # Reglas base, botones rectangulares y grids responsive
│   ├── types/
│   │   ├── product.types.ts  # Contratos TypeScript de productos, variantes y filtros
│   │   └── cart.types.ts     # Contratos TypeScript de la bolsa de compras
│   ├── data/
│   │   ├── categories.data.ts# Definición de categorías del catálogo
│   │   └── products.data.ts  # Catálogo detallado de prendas boutique y maquillaje
│   ├── services/
│   │   ├── product.service.ts# Lógica de dominio: filtrado, búsqueda, ordenamiento y cross-sell
│   │   ├── storage.service.ts# Abstracción segura de localStorage
│   │   └── currency.service.ts# Formateo de divisas
│   ├── hooks/
│   │   ├── useProductFilters.ts # Estado reactivo de filtros y navegación
│   │   ├── useCart.ts           # Gestión de bolsa de compras y totales
│   │   └── useWishlist.ts       # Gestión de guardados (Saved)
│   └── components/
│       ├── ui/               # Primitivas reutilizables (PillDropdown 0px, SizeSelector, ColorSwatchSelector)
│       ├── layout/           # AnnouncementBar, HeaderNavigation (Logo izq + Nav mono der), Footer 3 columnas
│       ├── home/             # HeroBanner centrado con botón Ghost, DepartmentShowcase (#24170f), EditorialLookbook
│       ├── catalog/          # CategoryFilterBar, ProductCard (bare-white con '+' quick-add), ProductGrid
│       ├── product-detail/   # ProductDetailView (Spec Sheet), QuickViewModal, SizeAndShadeGuideModal
│       └── cart/             # CartDrawer
└── vercel.json               # Configuración lista para despliegue SPA en Vercel
```

---

## 🚀 Desarrollo Local y Despliegue

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Compilar para producción
npm run build
```
