# LUMÉRA — Boutique Fashion & Beauty

Plataforma web frontend de comercio electrónico para **LUMÉRA**, diseñada con una estética editorial de galería que fusiona el rosa insignia de la marca con una paleta rosa pastel, arquitectura modular en **React + TypeScript + Vite**, principio de **Single Responsibility (SRP)** y preparación lista para despliegue en **Vercel**.

---

## ✨ Características Principales

- **Catálogo Dual (Moda Boutique & Maquillaje)**:
  - **Ropa Femenina Boutique**: Vestidos midi en satén, conjuntos sastre en lino, corsets esculturales, blusas en organza, cárdigans de cashmere y pantalones palazzo.
  - **Luméra Beauty (Maquillaje)**: Aceites labiales con péptidos, labiales mate terciopelo, rubores líquidos segunda piel, bases sérum SPF 30, paletas de sombras editoriales y máscaras de pestañas.
- **Variantes Interactivas en Tiempo Real**:
  - Selección de **Color / Tono** con vista previa cromática hexadecimal, etiqueta de acabado (*Satén de Seda*, *Brillo Espejo Cristal*, *Mate Terciopelo*) y cambio de galería fotográfica.
  - Selección de **Talla (`XS`–`XL`) / Formato (`Full Size`, `Travel Size`, `Recarga Eco`)** con medidas corporales exactas en centímetros o volumen neto.
- **Experiencia de Usuario (UI/UX) Editorial**:
  - Basada en `Skills/DESIGN.md` con paleta **Rosa Boutique (`#b81f62`) + Rosa Pastel (`#f7d6e6` / `#fdf2f7`)**.
  - Menú desplegable personalizado (`PillDropdown`), modal de **Vista Rápida** (`QuickViewModal`), vista de **Ficha Completa** (`ProductDetailView`) y **Guía de Tallas, Medidas y Tonos** (`SizeAndShadeGuideModal`).
  - **Bolsa de Compras interactiva** (`CartDrawer`) con cálculo automático de umbral de envío gratis y persistencia en `localStorage`.
  - **100% Responsive** para teléfonos móviles, tablets y escritorio.

---

## 🏛️ Arquitectura Modular (Single Responsibility)

```text
├── assets/                   # Activos originales de marca (LUMERA-PNG.png, lumera_favicon.svg)
├── public/assets/            # Activos públicos servidos estáticamente por Vite
├── Skills/DESIGN.md          # Especificación del sistema de diseño editorial
├── src/
│   ├── styles/
│   │   ├── tokens.css        # Variables CSS: paleta rosa/pastel, tipografía, espaciados y radios
│   │   └── global.css        # Reglas base, sistema de botones pill y grids responsive
│   ├── types/
│   │   ├── product.types.ts  # Contratos TypeScript de productos, variantes y filtros
│   │   └── cart.types.ts     # Contratos TypeScript de la bolsa de compras
│   ├── data/
│   │   ├── categories.data.ts# Definición de categorías del catálogo
│   │   └── products.data.ts  # Catálogo detallado de prendas y maquillaje
│   ├── services/
│   │   ├── product.service.ts# Lógica de dominio: filtrado, búsqueda, ordenamiento y cross-sell
│   │   ├── storage.service.ts# Abstracción segura de localStorage
│   │   └── currency.service.ts# Formateo de divisas
│   ├── hooks/
│   │   ├── useProductFilters.ts # Estado reactivo de filtros y navegación
│   │   ├── useCart.ts           # Gestión de bolsa de compras y totales
│   │   └── useWishlist.ts       # Gestión de lista de deseos (favoritos)
│   └── components/
│       ├── ui/               # Primitivas reutilizables (PillDropdown, SizeSelector, ColorSwatchSelector)
│       ├── layout/           # AnnouncementBar, HeaderNavigation (Desktop + Mobile Drawer), Footer
│       ├── home/             # HeroBanner, DepartmentShowcase, EditorialLookbook
│       ├── catalog/          # CategoryFilterBar, ProductCard, ProductGrid
│       ├── product-detail/   # ProductDetailView, QuickViewModal, SizeAndShadeGuideModal
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

### Despliegue en Vercel
El proyecto cuenta con `vercel.json` preconfigurado. Puedes desplegarlo conectando el repositorio en Vercel o ejecutando:
```bash
npx vercel
```

