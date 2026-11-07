// server/router/api.router.ts
import crypto4 from "node:crypto";

// src/services/variant-stock.service.ts
var VariantStockService = {
  buildVariantKey(colorId, sizeLabel) {
    return `${colorId}__${sizeLabel}`;
  },
  getInventoryMode(product) {
    return product.inventoryMode ?? "by_color_and_size";
  },
  /**
   * Returns the exact available unit count for a specific (color, size) pair.
   */
  getVariantStock(product, colorId, sizeLabel) {
    const mode = this.getInventoryMode(product);
    if (mode === "by_color_and_size" && product.variantStockMatrix) {
      const key = this.buildVariantKey(colorId, sizeLabel);
      if (typeof product.variantStockMatrix[key] === "number") {
        return Math.max(0, product.variantStockMatrix[key]);
      }
    }
    if (mode === "by_color") {
      const color = product.colors.find((c) => c.id === colorId);
      if (typeof color?.stock === "number") {
        return Math.max(0, color.stock);
      }
      return color?.inStock === false ? 0 : 5;
    }
    if (mode === "by_size") {
      const size2 = product.sizes.find((s) => s.label === sizeLabel);
      if (typeof size2?.stock === "number") {
        return Math.max(0, size2.stock);
      }
      return size2?.inStock ? 5 : 0;
    }
    const size = product.sizes.find((s) => s.label === sizeLabel);
    if (typeof size?.stock === "number") {
      return Math.max(0, size.stock);
    }
    return size?.inStock ? 5 : 0;
  },
  /**
   * Checks if a specific (colorId, sizeLabel) combination has available stock (> 0).
   */
  isVariantInStock(product, colorId, sizeLabel) {
    return this.getVariantStock(product, colorId, sizeLabel) > 0;
  },
  /**
   * Returns total available units for a given color/shade across all sizes.
   */
  getColorTotalStock(product, colorId) {
    const mode = this.getInventoryMode(product);
    if (mode === "by_color") {
      const color = product.colors.find((c) => c.id === colorId);
      return typeof color?.stock === "number" ? Math.max(0, color.stock) : color?.inStock === false ? 0 : 5;
    }
    return product.sizes.reduce(
      (sum, s) => sum + this.getVariantStock(product, colorId, s.label),
      0
    );
  },
  /**
   * Checks if a given color/shade has at least 1 unit available.
   */
  isColorInStock(product, colorId) {
    return this.getColorTotalStock(product, colorId) > 0;
  },
  /**
   * Returns total available units across the entire product.
   */
  getProductTotalStock(product) {
    const mode = this.getInventoryMode(product);
    if (mode === "by_size") {
      return product.sizes.reduce(
        (sum, s) => sum + (typeof s.stock === "number" ? Math.max(0, s.stock) : s.inStock ? 5 : 0),
        0
      );
    }
    if (mode === "by_color") {
      return product.colors.reduce(
        (sum, c) => sum + (typeof c.stock === "number" ? Math.max(0, c.stock) : c.inStock === false ? 0 : 5),
        0
      );
    }
    return product.colors.reduce(
      (sum, c) => sum + this.getColorTotalStock(product, c.id),
      0
    );
  },
  /**
   * Returns true if the entire product is completely sold out (0 units across all variants).
   */
  isProductSoldOut(product) {
    return this.getProductTotalStock(product) <= 0;
  },
  /**
   * Returns the sizes array contextualized for a currently selected colorId,
   * so SizeSelector automatically displays which sizes are inStock or AGOTADO for that color.
   */
  getSizesForSelectedColor(product, selectedColorId) {
    return product.sizes.map((size) => {
      const stock = this.getVariantStock(product, selectedColorId, size.label);
      return {
        ...size,
        stock,
        inStock: stock > 0
      };
    });
  },
  /**
   * Returns the colors array with computed `inStock` and `stock` flags.
   */
  getColorsWithStockStatus(product) {
    return product.colors.map((color) => {
      const totalForColor = this.getColorTotalStock(product, color.id);
      return {
        ...color,
        stock: this.getInventoryMode(product) === "by_color" ? color.stock ?? totalForColor : totalForColor,
        inStock: totalForColor > 0
      };
    });
  },
  /**
   * Normalizes a Product record so `variantStockMatrix`, `sizes[].stock/inStock`,
   * `colors[].stock/inStock`, and COP price fields are always consistent.
   */
  normalizeProductInventory(product) {
    const mode = product.inventoryMode ?? "by_color_and_size";
    const normalizedPrice = product.price < 1e3 ? product.price * 1e3 : product.price;
    const normalizedCompareAt = product.compareAtPrice && product.compareAtPrice < 1e3 ? product.compareAtPrice * 1e3 : product.compareAtPrice;
    const matrix = {
      ...product.variantStockMatrix ?? {}
    };
    for (const color of product.colors) {
      for (const size of product.sizes) {
        const key = this.buildVariantKey(color.id, size.label);
        if (typeof matrix[key] !== "number") {
          if (mode === "by_color") {
            matrix[key] = typeof color.stock === "number" ? color.stock : color.inStock === false ? 0 : 6;
          } else {
            matrix[key] = typeof size.stock === "number" ? size.stock : size.inStock ? 6 : 0;
          }
        }
      }
    }
    const draft = {
      ...product,
      price: normalizedPrice,
      compareAtPrice: normalizedCompareAt,
      costPriceCop: product.costPriceCop ?? Math.round(normalizedPrice * 0.42),
      taxRatePct: product.taxRatePct ?? 19,
      isVisible: product.isVisible !== false,
      inventoryMode: mode,
      variantStockMatrix: matrix
    };
    const normalizedSizes = draft.sizes.map((size) => {
      if (mode === "by_size") {
        const stockVal = typeof size.stock === "number" ? Math.max(0, size.stock) : size.inStock ? 6 : 0;
        for (const color of draft.colors) {
          matrix[this.buildVariantKey(color.id, size.label)] = stockVal;
        }
        return {
          ...size,
          stock: stockVal,
          inStock: stockVal > 0
        };
      }
      const totalForSize = draft.colors.reduce((sum, color) => {
        const key = this.buildVariantKey(color.id, size.label);
        return sum + Math.max(0, matrix[key] ?? 0);
      }, 0);
      return {
        ...size,
        stock: totalForSize,
        inStock: totalForSize > 0
      };
    });
    const normalizedColors = draft.colors.map(
      (color) => {
        if (mode === "by_color") {
          const stockVal = typeof color.stock === "number" ? Math.max(0, color.stock) : color.inStock === false ? 0 : 8;
          for (const size of draft.sizes) {
            matrix[this.buildVariantKey(color.id, size.label)] = stockVal;
          }
          return {
            ...color,
            stock: stockVal,
            inStock: stockVal > 0
          };
        }
        const totalForColor = draft.sizes.reduce((sum, size) => {
          const key = this.buildVariantKey(color.id, size.label);
          return sum + Math.max(0, matrix[key] ?? 0);
        }, 0);
        return {
          ...color,
          stock: totalForColor,
          inStock: totalForColor > 0
        };
      }
    );
    return {
      ...draft,
      colors: normalizedColors,
      sizes: normalizedSizes,
      variantStockMatrix: matrix
    };
  }
};

// server/database/database.repository.ts
import crypto2 from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// src/data/products.data.ts
var PRODUCTS_DATA = [
  /* ==========================================================================
     CATEGORÍA 1: VESTIDOS & CONJUNTOS (BOUTIQUE)
     ========================================================================== */
  {
    id: "lum-dress-001",
    sku: "LUM-VC-001",
    name: "VESTIDO MIDI SAT\xC9N \xC9CLAT",
    subtitle: "Corte al bies con espalda descubierta y tirantes ajustables",
    department: "boutique",
    category: "vestidos-conjuntos",
    categoryLabel: "Vestidos & Conjuntos",
    price: 185,
    compareAtPrice: 220,
    badge: "BESTSELLER",
    featured: true,
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Confeccionado en sat\xE9n de alto gramaje con ca\xEDda l\xEDquida que acaricia la silueta. Su corte al bies se adapta de forma org\xE1nica al cuerpo, mientras que el escote drapeado y los tirantes finos cruzados aportan una elegancia atemporal de galer\xEDa.",
    editorialNote: "Comb\xEDnalo con el Aceite Labial Lum\xE9ra Glaze en tono 01 Berry Glass para un look monocrom\xE1tico de noche.",
    colors: [
      {
        id: "rose-lumera",
        name: "Rosa Lum\xE9ra",
        hex: "#c21863",
        finish: "Sat\xE9n de Seda",
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "pearl-ivory",
        name: "Marfil Perla",
        hex: "#f5efe6",
        finish: "Sat\xE9n Luminoso",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "noir-caviar",
        name: "Negro Caviar",
        hex: "#1b1b1b",
        finish: "Sat\xE9n Mate",
        images: [
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Busto 80-84 cm \xB7 Cintura 60-64 cm \xB7 Cadera 88-92 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Busto 84-88 cm \xB7 Cintura 64-68 cm \xB7 Cadera 92-96 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Busto 88-93 cm \xB7 Cintura 68-73 cm \xB7 Cadera 96-101 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Busto 93-99 cm \xB7 Cintura 73-79 cm \xB7 Cadera 101-107 cm", inStock: true },
      { label: "XL", measurementsOrDetail: "Busto 99-105 cm \xB7 Cintura 79-85 cm \xB7 Cadera 107-113 cm", inStock: false }
    ],
    compositionOrIngredients: "92% Seda Morera Certificada, 8% Elastano de recuperaci\xF3n suave. Forro interior 100% viscosa transpirable.",
    careOrHowToUse: "Lavado en seco delicado o lavado a mano en agua fr\xEDa. Planchar del rev\xE9s a vapor suave.",
    specifications: [
      { label: "Calce", value: "Fluido al bies (Fiel a la talla)" },
      { label: "Largo total", value: "126 cm (en talla S)" },
      { label: "Cierre", value: "Cremallera invisible lateral + lazada ajustable" },
      { label: "Origen", value: "Dise\xF1o exclusivo Atelier Lum\xE9ra" }
    ],
    relatedProductIds: ["lum-mk-001", "lum-top-001", "lum-mk-003"]
  },
  {
    id: "lum-dress-002",
    sku: "LUM-VC-002",
    name: "CONJUNTO SASTRE LINO ATELIER",
    subtitle: "Blazer entallado de botonadura oculta y pantal\xF3n recto",
    department: "boutique",
    category: "vestidos-conjuntos",
    categoryLabel: "Vestidos & Conjuntos",
    price: 240,
    badge: "NEW IN",
    featured: true,
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Un conjunto de dos piezas que redefine la sastrer\xEDa femenina contempor\xE1nea. El blazer presenta hombros suavemente estructurados y cintura marcada, acompa\xF1ado de un pantal\xF3n de tiro alto que estiliza la figura con total comodidad.",
    editorialNote: "Ideal para llevar junto o por separado. El tono Blush Peony ilumina la piel al instante.",
    colors: [
      {
        id: "blush-peony",
        name: "Blush Peon\xEDa",
        hex: "#e58ab5",
        finish: "Lino Sastre Peinado",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "sand-stone",
        name: "Arena Crudo",
        hex: "#d8cbb8",
        finish: "Lino Org\xE1nico",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Busto 80-84 cm \xB7 Cintura 60-64 cm \xB7 Tiro 31 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Busto 84-88 cm \xB7 Cintura 64-68 cm \xB7 Tiro 31.5 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Busto 88-93 cm \xB7 Cintura 68-73 cm \xB7 Tiro 32 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Busto 93-99 cm \xB7 Cintura 73-79 cm \xB7 Tiro 33 cm", inStock: true }
    ],
    compositionOrIngredients: "78% Lino Europeo, 22% Lyocell Tencel anti-arrugas.",
    careOrHowToUse: "Limpieza en seco recomendada. Vaporizar en vertical antes de usar.",
    specifications: [
      { label: "Piezas incluidas", value: "2 piezas (Blazer + Pantal\xF3n Sastre)" },
      { label: "Bolsillos", value: "Bolsillos laterales invisibles y bolsillo sastre interno" },
      { label: "Forro", value: "Medio forro transpirable en sat\xE9n" }
    ],
    relatedProductIds: ["lum-top-002", "lum-mk-002", "lum-bot-001"]
  },
  {
    id: "lum-dress-003",
    sku: "LUM-VC-003",
    name: "MINI VESTIDO ESTRUCTURado DAHLIA",
    subtitle: "Escote coraz\xF3n arquitect\xF3nico y falda globo sutil",
    department: "boutique",
    category: "vestidos-conjuntos",
    categoryLabel: "Vestidos & Conjuntos",
    price: 165,
    badge: "LIMITED EDITION",
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Dise\xF1ado para capturar todas las miradas. El corpi\xF1o interno con varillas flexibles brinda soporte sin necesidad de sujetador, mientras su falda con volumen escultural crea una silueta digna de editorial de revista.",
    editorialNote: "Edici\xF3n numerada de temporada.",
    colors: [
      {
        id: "berry-couture",
        name: "Magenta Couture",
        hex: "#a81353",
        finish: "Tafet\xE1n de Seda",
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "white-gallery",
        name: "Blanco Galer\xEDa",
        hex: "#ffffff",
        finish: "Popel\xEDn Estructurado",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Busto 80-84 cm \xB7 Cintura 60-63 cm \xB7 Largo 82 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Busto 84-88 cm \xB7 Cintura 64-67 cm \xB7 Largo 84 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Busto 88-92 cm \xB7 Cintura 68-72 cm \xB7 Largo 86 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Busto 93-98 cm \xB7 Cintura 73-78 cm \xB7 Largo 88 cm", inStock: false }
    ],
    compositionOrIngredients: "85% Tafet\xE1n de Poli\xE9ster Reciclado de Alta Densidad, 15% Seda.",
    careOrHowToUse: "Lavar en seco \xFAnicamente. Guardar colgado con funda protectora.",
    specifications: [
      { label: "Soporte interno", value: "Corseter\xEDa suave integrada con banda antideslizante" },
      { label: "Largo", value: "Mini por encima de la rodilla" }
    ],
    relatedProductIds: ["lum-mk-001", "lum-mk-004"]
  },
  /* ==========================================================================
     CATEGORÍA 2: TOPS & BLUSAS (BOUTIQUE)
     ========================================================================== */
  {
    id: "lum-top-001",
    sku: "LUM-TB-001",
    name: "CORSET ESCULTURAL LUM\xC9RA ARCHIVE",
    subtitle: "Costuras anat\xF3micas y escote cuadrado minimalista",
    department: "boutique",
    category: "tops-blusas",
    categoryLabel: "Tops & Blusas",
    price: 115,
    badge: "EDITORIAL PICK",
    featured: true,
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Nuestra pieza insignia de sastrer\xEDa superior. Elaborado con paneles anat\xF3micos que moldean el torso con total confort gracias a su tejido el\xE1stico de doble punto y varillas flexibles que acompa\xF1an el movimiento.",
    editorialNote: "El contraste perfecto junto al Pantal\xF3n Palazzo C\xE9line de tiro alto.",
    colors: [
      {
        id: "magenta-iconic",
        name: "Rosa Lum\xE9ra",
        hex: "#c21863",
        finish: "Crep\xE9 Estructurado",
        images: [
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "carbon-black",
        name: "Negro Carbono",
        hex: "#000000",
        finish: "Crep\xE9 Mate",
        images: [
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "paper-white",
        name: "Blanco Papel",
        hex: "#ffffff",
        finish: "Crep\xE9 Sastre",
        images: [
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Busto 79-83 cm \xB7 Cintura 59-63 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Busto 84-88 cm \xB7 Cintura 64-68 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Busto 89-94 cm \xB7 Cintura 69-74 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Busto 95-100 cm \xB7 Cintura 75-80 cm", inStock: true }
    ],
    compositionOrIngredients: "68% Viscosa Ecovero, 27% Poliamida, 5% Elastano.",
    careOrHowToUse: "Lavar a mano en agua fr\xEDa. Secar en plano a la sombra.",
    specifications: [
      { label: "Cierre trasero", value: "Corchetes met\xE1licos invisibles con 3 niveles de ajuste" },
      { label: "Nivel de soporte", value: "Alto (estructura interna suave)" }
    ],
    relatedProductIds: ["lum-bot-001", "lum-bot-002", "lum-mk-002"]
  },
  {
    id: "lum-top-002",
    sku: "LUM-TB-002",
    name: "BLUSA DRAPEADA EN ORGANZA DE SEDA",
    subtitle: "Mangas abullonadas transl\xFAcidas y lazada desmontable en cuello",
    department: "boutique",
    category: "tops-blusas",
    categoryLabel: "Tops & Blusas",
    price: 138,
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Una oda a la feminidad et\xE9rea. Esta blusa combina un cuerpo forrado en crep\xE9 suave con mangas de organza transl\xFAcida y pu\xF1os abotonados extra largos. Su lazada permite llevarse anudada al cuello, suelta o como cintur\xF3n.",
    editorialNote: "Ligera como el aire; perfecta del estudio a una cena especial.",
    colors: [
      {
        id: "petal-mist",
        name: "Niebla Rosa",
        hex: "#f3c6dc",
        finish: "Organza de Seda",
        images: [
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "pure-ivory",
        name: "Blanco \xD3ptico",
        hex: "#ffffff",
        finish: "Organza Natural",
        images: [
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Hombros 36 cm \xB7 Busto 84 cm \xB7 Largo 60 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Hombros 37.5 cm \xB7 Busto 88 cm \xB7 Largo 61 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Hombros 39 cm \xB7 Busto 93 cm \xB7 Largo 62 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Hombros 40.5 cm \xB7 Busto 98 cm \xB7 Largo 63.5 cm", inStock: true }
    ],
    compositionOrIngredients: "100% Organza de Seda Natural (exterior) \xB7 100% Modal (top interior incluido).",
    careOrHowToUse: "Limpieza en seco especializada en seda.",
    specifications: [
      { label: "Incluye", value: "Camisola interior a tono y lazada desmontable" },
      { label: "Botones", value: "N\xE1car natural tallado" }
    ],
    relatedProductIds: ["lum-bot-001", "lum-mk-001"]
  },
  {
    id: "lum-top-003",
    sku: "LUM-TB-003",
    name: "CARDIGAN FINO CASHMERE ROSE BUTTON",
    subtitle: "Punto de seda y cashmere con botones joya esmaltados a tono",
    department: "boutique",
    category: "tops-blusas",
    categoryLabel: "Tops & Blusas",
    price: 155,
    badge: "NEW IN",
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Tejido de galga fina ultrasuave dise\xF1ado para llevarse cerrado sobre la piel o abierto sobre vestidos lenceros. Su silueta ligeramente entallada en cintura define la figura con absoluta comodidad.",
    editorialNote: "Una pieza de entretiempo esencial en el armario c\xE1psula Lum\xE9ra.",
    colors: [
      {
        id: "cashmere-rose",
        name: "Rosa Empolvado",
        hex: "#e58ab5",
        finish: "Punto Seda-Cashmere",
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "cashmere-berry",
        name: "Magenta Lum\xE9ra",
        hex: "#c21863",
        finish: "Punto Fino Peinado",
        images: [
          "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Busto 82 cm \xB7 Largo 52 cm \xB7 Manga 60 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Busto 86 cm \xB7 Largo 53 cm \xB7 Manga 61 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Busto 91 cm \xB7 Largo 54.5 cm \xB7 Manga 62 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Busto 97 cm \xB7 Largo 56 cm \xB7 Manga 63 cm", inStock: true }
    ],
    compositionOrIngredients: "70% Lana Merino Extrafina, 20% Seda Morera, 10% Cashmere Certificado.",
    careOrHowToUse: "Lavar a mano en agua fr\xEDa con detergente para prendas delicadas. Secar en horizontal.",
    specifications: [
      { label: "Textura", value: "Tacto segunda piel sin picor" },
      { label: "Cuello", value: "Redondo cl\xE1sico con ribete acanalado" }
    ],
    relatedProductIds: ["lum-bot-002", "lum-mk-003"]
  },
  /* ==========================================================================
     CATEGORÍA 3: FALDAS & PANTALONES (BOUTIQUE)
     ========================================================================== */
  {
    id: "lum-bot-001",
    sku: "LUM-FP-001",
    name: "PANTAL\xD3N PALAZZO C\xC9LINE TIRO ALTO",
    subtitle: "Pinzas dobles frontales y ca\xEDda fluida de pierna ancha",
    department: "boutique",
    category: "faldas-pantalones",
    categoryLabel: "Faldas & Pantalones",
    price: 145,
    badge: "BESTSELLER",
    featured: true,
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "El pantal\xF3n definitivo de silueta alargada. Confeccionado en crep\xE9 pesado de ca\xEDda impecable que no marca y acompa\xF1a cada paso con movimiento fluido. Pretina sastre reforzada con presillas y doble pinza frontal.",
    editorialNote: "Dise\xF1o de pierna ancha que alarga visualmente la silueta.",
    colors: [
      {
        id: "graphite-noir",
        name: "Grafito Profundo",
        hex: "#1b1b1b",
        finish: "Crep\xE9 Sastre Pesado",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "rose-statement",
        name: "Magenta Editorial",
        hex: "#c21863",
        finish: "Crep\xE9 Sastre",
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "chalk-white",
        name: "Blanco Tiza",
        hex: "#f8f8f6",
        finish: "Crep\xE9 Con Forro",
        images: [
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS (34)", measurementsOrDetail: "Cintura 62 cm \xB7 Cadera 90 cm \xB7 Entrepierna 81 cm", inStock: true },
      { label: "S (36)", measurementsOrDetail: "Cintura 66 cm \xB7 Cadera 94 cm \xB7 Entrepierna 81.5 cm", inStock: true },
      { label: "M (38)", measurementsOrDetail: "Cintura 71 cm \xB7 Cadera 99 cm \xB7 Entrepierna 82 cm", inStock: true },
      { label: "L (40)", measurementsOrDetail: "Cintura 77 cm \xB7 Cadera 105 cm \xB7 Entrepierna 82.5 cm", inStock: true },
      { label: "XL (42)", measurementsOrDetail: "Cintura 83 cm \xB7 Cadera 111 cm \xB7 Entrepierna 83 cm", inStock: true }
    ],
    compositionOrIngredients: "74% Triacetato Sostenible, 26% Poli\xE9ster Reciclado.",
    careOrHowToUse: "Lavado delicado a m\xE1quina m\xE1x. 30\xB0C o limpieza en seco.",
    specifications: [
      { label: "Tiro", value: "Alto (32 cm)" },
      { label: "Corte", value: "Wide-leg / Palazzo" },
      { label: "Bolsillos", value: "2 bolsillos diagonales delanteros + 2 ribeteados traseros" }
    ],
    relatedProductIds: ["lum-top-001", "lum-top-002", "lum-mk-002"]
  },
  {
    id: "lum-bot-002",
    sku: "LUM-FP-002",
    name: "FALDA MIDI BIAS-CUT LUMI\xC8RE",
    subtitle: "Sat\xE9n sedoso con cintura el\xE1stica oculta y ca\xEDda asim\xE9trica",
    department: "boutique",
    category: "faldas-pantalones",
    categoryLabel: "Faldas & Pantalones",
    price: 125,
    badge: "NEW IN",
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "Cortada al bies para abrazar suavemente las curvas y abrirse en un vuelo delicado al caminar. Su acabado perlado refleja la luz con sutileza, convirti\xE9ndola en el comod\xEDn m\xE1s vers\xE1til de la colecci\xF3n.",
    editorialNote: "Ll\xE9vala a la cintura con prendas cortas o a la cadera para un aire relajado.",
    colors: [
      {
        id: "rose-quartz",
        name: "Cuarzo Rosa",
        hex: "#e58ab5",
        finish: "Sat\xE9n Perlado",
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "deep-berry",
        name: "Frambuesa Profundo",
        hex: "#9e114e",
        finish: "Sat\xE9n Intenso",
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Cintura 60-65 cm \xB7 Cadera 88-92 cm \xB7 Largo 86 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Cintura 65-70 cm \xB7 Cadera 92-96 cm \xB7 Largo 87 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Cintura 70-76 cm \xB7 Cadera 96-102 cm \xB7 Largo 88 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Cintura 76-82 cm \xB7 Cadera 102-108 cm \xB7 Largo 89 cm", inStock: true }
    ],
    compositionOrIngredients: "100% Viscosa Satinada Certificada FSC.",
    careOrHowToUse: "Lavar a mano en agua fr\xEDa con jab\xF3n neutro. No retorcer.",
    specifications: [
      { label: "Largo", value: "Midi (debajo de la rodilla)" },
      { label: "Cintura", value: "Banda interior limpia sin costuras visibles" }
    ],
    relatedProductIds: ["lum-top-001", "lum-mk-001"]
  },
  {
    id: "lum-bot-003",
    sku: "LUM-FP-003",
    name: "FALDA PANTAL\xD3N SASTRE MARGAUX",
    subtitle: "Dise\xF1o cruzado frontal tipo wrap con short sastre interior invisible",
    department: "boutique",
    category: "faldas-pantalones",
    categoryLabel: "Faldas & Pantalones",
    price: 118,
    badge: "EDITORIAL PICK",
    sizeTypeLabel: "TALLA",
    colorTypeLabel: "COLOR",
    description: "La est\xE9tica pulida de una minifalda sastre asim\xE9trica con la total libertad de movimiento de un short estructurado. Incluye hebilla lateral minimalista ba\xF1ada en tono plata y tejido crep\xE9 con ca\xEDda firme.",
    editorialNote: "Comodidad absoluta para caminar y moverte por la ciudad con elegancia.",
    colors: [
      {
        id: "skort-graphite",
        name: "Negro Grafito",
        hex: "#1b1b1b",
        finish: "Crep\xE9 Sastre",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "skort-lumera-pink",
        name: "Rosa Lum\xE9ra",
        hex: "#c21863",
        finish: "Crep\xE9 Estructurado",
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "XS", measurementsOrDetail: "Cintura 61 cm \xB7 Cadera 89 cm \xB7 Largo 39 cm", inStock: true },
      { label: "S", measurementsOrDetail: "Cintura 65 cm \xB7 Cadera 93 cm \xB7 Largo 40 cm", inStock: true },
      { label: "M", measurementsOrDetail: "Cintura 70 cm \xB7 Cadera 98 cm \xB7 Largo 41 cm", inStock: true },
      { label: "L", measurementsOrDetail: "Cintura 76 cm \xB7 Cadera 104 cm \xB7 Largo 42.5 cm", inStock: true }
    ],
    compositionOrIngredients: "76% Poli\xE9ster Reciclado Sastre, 18% Viscosa, 6% Elastano.",
    careOrHowToUse: "Lavado suave en agua fr\xEDa. Planchado a baja temperatura.",
    specifications: [
      { label: "Interior", value: "Short completo en forro de viscosa transpirable" },
      { label: "Tiro", value: "Medio-Alto anat\xF3mico" }
    ],
    relatedProductIds: ["lum-top-001", "lum-top-003", "lum-mk-002"]
  },
  /* ==========================================================================
     CATEGORÍA 4: MAQUILLAJE — LABIOS & ROSTRO (BEAUTY)
     ========================================================================== */
  {
    id: "lum-mk-001",
    sku: "LUM-MK-001",
    name: "LUM\xC9RA GLAZE PEPTIDE LIP OIL",
    subtitle: "Aceite labial nutritivo con p\xE9ptidos, escualano y brillo espejo 3D",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    categoryLabel: "Maquillaje \u2014 Labios & Rostro",
    price: 34,
    badge: "BESTSELLER",
    featured: true,
    sizeTypeLabel: "FORMATO / PRESENTACI\xD3N",
    colorTypeLabel: "TONO / ACABADO",
    description: "Un h\xEDbrido entre tratamiento labial intensivo y gloss de alto impacto. Formulado con trip\xE9ptidos voluminizadores, aceite de semilla de frambuesa y \xE1cido hialur\xF3nico que rellenan e hidratan los labios durante 12 horas sin sensaci\xF3n pegajosa.",
    editorialNote: "El tono 01 Lum\xE9ra Berry aporta un velo trasl\xFAcido de alto contraste con brillo cristal tridimensional.",
    colors: [
      {
        id: "shade-01-lumera-berry",
        name: "01 Lum\xE9ra Berry (Fucsia Trasl\xFAcido)",
        hex: "#c21863",
        finish: "Brillo Espejo Cristal",
        images: [
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "shade-02-sugar-petal",
        name: "02 Sugar Petal (Rosa Beb\xE9)",
        hex: "#f08db9",
        finish: "Brillo Nacarado Sutil",
        images: [
          "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "shade-03-espresso-rose",
        name: "03 Rosewood Glaze (Malva Tostado)",
        hex: "#914256",
        finish: "Brillo Espejo",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "shade-04-crystal-dew",
        name: "04 Crystal Dew (Transparente Puro)",
        hex: "#f9e6ef",
        finish: "Efecto Cristal H\xFAmedo",
        images: [
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "Full Size (7 ml)", measurementsOrDetail: "0.23 fl. oz. \xB7 Aplicador cushion XXL ergon\xF3mico", inStock: true },
      { label: "Travel Size (3.5 ml)", measurementsOrDetail: "0.12 fl. oz. \xB7 Edici\xF3n de bolsillo para bolso de noche", inStock: true },
      { label: "Duo Set (2 x 7 ml)", measurementsOrDetail: "Incluye estuche coleccionable Lum\xE9ra", inStock: true }
    ],
    compositionOrIngredients: "Polyglyceryl-2 Triisostearate, Escualano Vegetal, Aceite de Jojoba Org\xE1nico, Palmitoyl Tripeptide-1, Esferas de \xC1cido Hialur\xF3nico, Vitamina E. 100% Vegano y Cruelty-Free.",
    careOrHowToUse: "Desliza el aplicador cushion directamente sobre los labios limpios o encima de tu labial mate para un efecto tridimensional.",
    specifications: [
      { label: "Acabado", value: "High-Gloss Espejo sin sensaci\xF3n pegajosa" },
      { label: "F\xF3rmula", value: "Vegana \xB7 Sin parabenos \xB7 Dermatol\xF3gicamente probada" },
      { label: "Aroma", value: "Vainilla blanca y frutos rojos suaves" }
    ],
    relatedProductIds: ["lum-mk-002", "lum-mk-003", "lum-dress-001"]
  },
  {
    id: "lum-mk-002",
    sku: "LUM-MK-002",
    name: "VELVET COUTURE MATTE LIPSTICK",
    subtitle: "Labial en barra de pigmento puro con acabado terciopelo hidratante",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    categoryLabel: "Maquillaje \u2014 Labios & Rostro",
    price: 38,
    badge: "EDITORIAL PICK",
    featured: true,
    sizeTypeLabel: "FORMATO / PRESENTACI\xD3N",
    colorTypeLabel: "TONO / ACABADO",
    description: "Color saturado en una sola pasada con textura nube ultraligera. Enriquecido con extracto de flor de camelia y ceras bot\xE1nicas que difuminan las l\xEDneas de los labios dejando un acabado mate aterciopelado tipo filtro editorial.",
    editorialNote: "Bala biselada de alta precisi\xF3n con grabado LUM\xC9RA y envase recargable magn\xE9tico.",
    colors: [
      {
        id: "velvet-01-lumera-signature",
        name: "101 Lum\xE9ra Signature (Magenta Editorial)",
        hex: "#c21863",
        finish: "Mate Terciopelo",
        images: [
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "velvet-02-nude-cachemire",
        name: "102 Nude Cachemire (Rosa Almendra)",
        hex: "#c6827c",
        finish: "Mate Difuminado",
        images: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "velvet-03-rouge-velours",
        name: "103 Rouge Velours (Frambuesa Oscuro)",
        hex: "#8c123c",
        finish: "Mate Intenso",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "Barra Completa (3.8 g)", measurementsOrDetail: "Envase joya magn\xE9tico recargable", inStock: true },
      { label: "Recarga Eco (3.8 g)", measurementsOrDetail: "Cartucho intercambiable para tu estuche Lum\xE9ra", inStock: true }
    ],
    compositionOrIngredients: "Dimethicone, Aceite de Semilla de Camelia Japonica, Manteca de Karit\xE9 Micronizada, Pigmentos Minerales Tratados.",
    careOrHowToUse: "Aplica desde el centro del labio hacia las comisuras. Para un efecto blurred lip, difumina los bordes con la yema del dedo.",
    specifications: [
      { label: "Duraci\xF3n", value: "Hasta 10 horas sin cuartearse" },
      { label: "Cobertura", value: "Total en una pasada (modulable)" }
    ],
    relatedProductIds: ["lum-mk-001", "lum-mk-003", "lum-top-001"]
  },
  {
    id: "lum-mk-003",
    sku: "LUM-MK-003",
    name: "SILK DEW LIQUID BLUSH & CHEEK TINT",
    subtitle: "Rubor l\xEDquido segunda piel con micro-perlas reflectoras de luz",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    categoryLabel: "Maquillaje \u2014 Labios & Rostro",
    price: 36,
    badge: "NEW IN",
    featured: true,
    sizeTypeLabel: "FORMATO / PRESENTACI\xD3N",
    colorTypeLabel: "TONO / ACABADO",
    description: "Rubor en s\xE9rum de textura sedosa que se funde instant\xE1neamente con la piel sin levantar la base. Su f\xF3rmula con niacinamida y extracto de rosa centifolia aporta un rubor fresco, saludable y luminoso durante todo el d\xEDa.",
    editorialNote: "Un solo punto en cada p\xF3mulo es suficiente para un rubor de pasarela.",
    colors: [
      {
        id: "blush-01-peony-flush",
        name: "Peony Flush (Rosa Fresco)",
        hex: "#e0538c",
        finish: "Luminoso Satinado",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "blush-02-sunset-coral",
        name: "Guava Rose (Rosa Coral C\xE1lido)",
        hex: "#e46c64",
        finish: "Dewy Radiante",
        images: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "blush-03-berry-plum",
        name: "Berry Atelier (Ciruela Rosado)",
        hex: "#9e265a",
        finish: "Satinado Natural",
        images: [
          "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "Full Size (12 ml)", measurementsOrDetail: "0.40 fl. oz. \xB7 Dosificador de precisi\xF3n", inStock: true },
      { label: "Mini Size (5 ml)", measurementsOrDetail: "0.17 fl. oz. \xB7 Ideal para retoques", inStock: true }
    ],
    compositionOrIngredients: "Agua de Rosa Damascena, Niacinamida 2%, Escualano, Mica Mineral \xC9tica, Extracto de Peon\xEDa.",
    careOrHowToUse: "Agitar bien. Aplicar 1-2 peque\xF1os puntos en las mejillas y difuminar con brocha o a toquecitos con los dedos.",
    specifications: [
      { label: "Tipo de piel", value: "Apto para todo tipo de piel, incluso sensible" },
      { label: "Uso dual", value: "Mejillas y labios" }
    ],
    relatedProductIds: ["lum-mk-001", "lum-mk-004"]
  },
  /* ==========================================================================
     CATEGORÍA 5: MAQUILLAJE — OJOS & PALETAS (BEAUTY)
     ========================================================================== */
  {
    id: "lum-mk-004",
    sku: "LUM-MK-004",
    name: "PALETA EDITORIAL ROSE ARCHIVE (9 TONOS)",
    subtitle: "Sombras compactas en texturas terciopelo mate, sat\xE9n de seda y topper cristal",
    department: "makeup",
    category: "maquillaje-ojos-paletas",
    categoryLabel: "Maquillaje \u2014 Ojos & Paletas",
    price: 58,
    badge: "LIMITED EDITION",
    featured: true,
    sizeTypeLabel: "FORMATO / PRESENTACI\xD3N",
    colorTypeLabel: "TONO / ACABADO",
    description: "Una curadur\xEDa de 9 tonos dise\xF1ados para crear desde miradas suaves de d\xEDa hasta ahumados editoriales en tonos rosa empolvado, malva, champagne reflectante y espresso profundo. Pigmentos micronizados de triple molienda que se difuminan sin esfuerzo.",
    editorialNote: "Incluye espejo panor\xE1mico de borde a borde con estuche arquitect\xF3nico en acabado negro obsidiana.",
    colors: [
      {
        id: "palette-01-rose-archive",
        name: "Armon\xEDa 01 \u2014 Rose Archive (Rosas, Malvas & Champagne)",
        hex: "#c21863",
        finish: "Mate + Shimmer + Topper",
        images: [
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "palette-02-nude-gallery",
        name: "Armon\xEDa 02 \u2014 Nude Gallery (Neutros C\xE1lidos & Bronce)",
        hex: "#b58876",
        finish: "Mate + Met\xE1lico Seda",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "Paleta 9 x 1.5 g", measurementsOrDetail: "Peso neto total 13.5 g \xB7 Con espejo integrado", inStock: true },
      { label: "Paleta + Set 2 Brochas Ojos", measurementsOrDetail: "Incluye brocha difuminadora y lengua de gato veganas", inStock: true }
    ],
    compositionOrIngredients: "F\xF3rmula libre de talco con Manteca de Murumuru, Polvo de Seda Vegana y Perlas Reflectoras Multidimensionales.",
    careOrHowToUse: "Usa tonos mate con brocha suave para estructurar la cuenca y aplica los tonos topper con la yema del dedo en el centro del p\xE1rpado m\xF3vil.",
    specifications: [
      { label: "N\xFAmero de sombras", value: "5 mates aterciopelados, 2 satinados, 2 toppers cristal" },
      { label: "F\xF3rmula", value: "Sin ca\xEDda de pigmento (Zero-Fallout Technology)" }
    ],
    relatedProductIds: ["lum-mk-005", "lum-mk-001", "lum-dress-003"]
  },
  {
    id: "lum-mk-005",
    sku: "LUM-MK-005",
    name: "LASH SCULPT PANORAMIC MASCARA",
    subtitle: "M\xE1scara de pesta\xF1as de volumen arquitect\xF3nico y curvatura 24h",
    department: "makeup",
    category: "maquillaje-ojos-paletas",
    categoryLabel: "Maquillaje \u2014 Ojos & Paletas",
    price: 32,
    sizeTypeLabel: "FORMATO / PRESENTACI\xD3N",
    colorTypeLabel: "TONO / ACABADO",
    description: "Define, separa y eleva cada pesta\xF1a desde la ra\xEDz hasta la punta sin grumos. Su cepillo reloj de arena con micro-cerdas captura hasta las pesta\xF1as m\xE1s cortas, mientras su f\xF3rmula con pantenol y biotina las fortalece con cada aplicaci\xF3n.",
    editorialNote: "Resistente a la humedad y al sudor; se retira f\xE1cilmente sin frotar.",
    colors: [
      {
        id: "mascara-01-carbon-noir",
        name: "Carbon Noir (Negro Ultra Intenso)",
        hex: "#000000",
        finish: "Negro Satinado Profundo",
        images: [
          "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "mascara-02-espresso-burgundy",
        name: "Burgundy Noir (Borgo\xF1a Oscuro Editorial)",
        hex: "#4f1228",
        finish: "Subtono Berry Sutil",
        images: [
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "Full Size (9.5 ml)", measurementsOrDetail: "0.32 fl. oz. \xB7 Cepillo escultural de elast\xF3mero", inStock: true },
      { label: "Mini Size (4.5 ml)", measurementsOrDetail: "0.15 fl. oz. \xB7 Formato viaje", inStock: true }
    ],
    compositionOrIngredients: "Cera de Carnauba, Pantenol (Provitamina B5), P\xE9ptidos Fortalecedores de Pesta\xF1as, \xD3xidos de Hierro Ultrapuros.",
    careOrHowToUse: "Coloca el cepillo en la base de las pesta\xF1as y desliza en zigzag hacia arriba. Aplica una segunda capa para volumen dram\xE1tico.",
    specifications: [
      { label: "Oftalmol\xF3gicamente testado", value: "S\xED, apto para ojos sensibles y lentes de contacto" },
      { label: "Efecto", value: "+140% volumen panor\xE1mico y rizo sostenido" }
    ],
    relatedProductIds: ["lum-mk-004", "lum-mk-001"]
  },
  {
    id: "lum-mk-006",
    sku: "LUM-MK-006",
    name: "LUMINOUS SILK SKIN TINT SERUM SPF 30",
    subtitle: "Base s\xE9rum perfeccionadora con \xE1cido hialur\xF3nico y cobertura modulable",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    categoryLabel: "Maquillaje \u2014 Labios & Rostro",
    price: 48,
    badge: "EDITORIAL PICK",
    sizeTypeLabel: "FORMATO / PRESENTACI\xD3N",
    colorTypeLabel: "TONO / ACABADO",
    description: "El secreto de una piel de galer\xEDa. Combina la ligereza de un s\xE9rum bot\xE1nico con pigmentos biomim\xE9ticos que unifican el tono, disimulan poros y dejan un acabado luminoso natural sin efecto m\xE1scara.",
    editorialNote: "Enriquecida con complejo iluminador de peon\xEDa blanca y protecci\xF3n solar mineral SPF 30.",
    colors: [
      {
        id: "skin-10-porcelain",
        name: "10N Porcelain Rose (Claro Subtono Neutro-Rosado)",
        hex: "#f3d9c8",
        finish: "Satinado Segunda Piel",
        images: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "skin-20-sand-nude",
        name: "20W Warm Nude (Medio Claro Subtono C\xE1lido)",
        hex: "#e2ba9b",
        finish: "Satinado Segunda Piel",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "skin-30-golden-honey",
        name: "30N Honey Beige (Medio Bronceado Neutro)",
        hex: "#c79672",
        finish: "Satinado Segunda Piel",
        images: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"
        ]
      },
      {
        id: "skin-40-amber-glow",
        name: "40W Amber Rich (Oscuro Dorado Luminoso)",
        hex: "#986344",
        finish: "Satinado Segunda Piel",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
        ]
      }
    ],
    sizes: [
      { label: "Frasco Gotero (30 ml)", measurementsOrDetail: "1.0 fl. oz. \xB7 Hasta 90 aplicaciones", inStock: true },
      { label: "Travel Size (15 ml)", measurementsOrDetail: "0.5 fl. oz. \xB7 Formato neceser de viaje", inStock: true }
    ],
    compositionOrIngredients: "\xC1cido Hialur\xF3nico Multimolecular, Niacinamida 3%, Extracto de Peon\xEDa Blanca, \xD3xido de Zinc No-Nano SPF 30.",
    careOrHowToUse: "Aplica 3-4 gotas sobre el rostro hidratado y extiende desde el centro hacia afuera con brocha o esponja h\xFAmeda.",
    specifications: [
      { label: "Cobertura", value: "Ligera a media modulable" },
      { label: "No comedog\xE9nico", value: "S\xED, libre de aceites pesados y fragancias sint\xE9ticas" }
    ],
    relatedProductIds: ["lum-mk-003", "lum-mk-001", "lum-dress-002"]
  }
];

// src/data/subcategories.data.ts
var INITIAL_SUBCATEGORIES_SEED = [
  {
    id: "sub-vestidos-saten",
    slug: "vestidos-saten",
    label: "VESTIDOS DE SAT\xC9N & SEDA",
    department: "boutique",
    category: "vestidos-conjuntos",
    searchKeyword: "Sat\xE9n",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 1
  },
  {
    id: "sub-sastreria-lino",
    slug: "sastreria-lino",
    label: "SASTRER\xCDA & CONJUNTOS DE LINO",
    department: "boutique",
    category: "vestidos-conjuntos",
    searchKeyword: "Sastre",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 2
  },
  {
    id: "sub-corseteria",
    slug: "corseteria-escultural",
    label: "CORS\xC9TER\xCDA ESCULTURAL",
    department: "boutique",
    category: "tops-blusas",
    searchKeyword: "Corset",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 3
  },
  {
    id: "sub-blusas-organza",
    slug: "blusas-organza",
    label: "BLUSAS DE ORGANZA & SEDA",
    department: "boutique",
    category: "tops-blusas",
    searchKeyword: "Organza",
    showInNewArrivals: false,
    isVisible: true,
    sortOrder: 4
  },
  {
    id: "sub-pantalones-palazzo",
    slug: "pantalones-palazzo",
    label: "PANTALONES PALAZZO & PINZAS",
    department: "boutique",
    category: "faldas-pantalones",
    searchKeyword: "Pantal\xF3n",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 5
  },
  {
    id: "sub-faldas-midi",
    slug: "faldas-midi",
    label: "FALDAS MIDI PLISADAS",
    department: "boutique",
    category: "faldas-pantalones",
    searchKeyword: "Falda",
    showInNewArrivals: false,
    isVisible: true,
    sortOrder: 6
  },
  {
    id: "sub-lip-oils",
    slug: "aceites-labiales-peptidos",
    label: "ACEITES LABIALES (LIP OILS)",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    searchKeyword: "Lip Oil",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 7
  },
  {
    id: "sub-labiales-mate",
    slug: "labiales-velvet-mate",
    label: "LABIALES VELVET MATE",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    searchKeyword: "Lipstick",
    showInNewArrivals: false,
    isVisible: true,
    sortOrder: 8
  },
  {
    id: "sub-rubores-liquidos",
    slug: "rubores-liquidos-seda",
    label: "RUBORES L\xCDQUIDOS DE SEDA",
    department: "makeup",
    category: "maquillaje-labios-rostro",
    searchKeyword: "Blush",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 9
  },
  {
    id: "sub-paletas-sombras",
    slug: "paletas-sombras-ojos",
    label: "PALETAS DE SOMBRAS (9 TONOS)",
    department: "makeup",
    category: "maquillaje-ojos-paletas",
    searchKeyword: "Paleta",
    showInNewArrivals: true,
    isVisible: true,
    sortOrder: 10
  },
  {
    id: "sub-mascaras-pestanas",
    slug: "mascaras-pestanas",
    label: "M\xC1SCARAS DE PESTA\xD1AS",
    department: "makeup",
    category: "maquillaje-ojos-paletas",
    searchKeyword: "M\xE1scara",
    showInNewArrivals: false,
    isVisible: true,
    sortOrder: 11
  },
  {
    id: "sub-brochas-veganas",
    slug: "brochas-veganas-pro",
    label: "SETS DE BROCHAS VEGANAS",
    department: "makeup",
    category: "maquillaje-ojos-paletas",
    searchKeyword: "Brochas",
    showInNewArrivals: false,
    isVisible: true,
    sortOrder: 12
  }
];

// server/config/security.config.ts
var SecurityConfig = {
  JWT_SECRET: process.env.LUMERA_JWT_SECRET ?? "lumera-atelier-hmac-sha256-signing-secret-2026-v1",
  TOKEN_TTL_SECONDS: 60 * 60 * 12,
  // 12 hours
  DEFAULT_ADMIN_EMAIL: process.env.LUMERA_ADMIN_EMAIL ?? "admin@lumera.co",
  DEFAULT_ADMIN_PASSWORD: process.env.LUMERA_ADMIN_PASSWORD ?? "LumeraAtelier2026!",
  DEFAULT_ADMIN_NAME: "Direcci\xF3n General LUM\xC9RA",
  MAX_UPLOAD_BYTES: 8 * 1024 * 1024
  // 8 MB per uploaded image
};

// server/security/crypto.service.ts
import crypto from "node:crypto";
var CryptoService = {
  hashPassword(plainPassword) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString("hex");
    return `${salt}:${derivedKey}`;
  },
  verifyPassword(plainPassword, storedHash) {
    const [salt, keyHex] = storedHash.split(":");
    if (!salt || !keyHex) return false;
    const derivedBuffer = crypto.scryptSync(plainPassword, salt, 64);
    const keyBuffer = Buffer.from(keyHex, "hex");
    if (derivedBuffer.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(derivedBuffer, keyBuffer);
  },
  signToken(payload) {
    const iat = Math.floor(Date.now() / 1e3);
    const exp = iat + SecurityConfig.TOKEN_TTL_SECONDS;
    const claims = {
      ...payload,
      iat,
      exp
    };
    const headerB64 = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");
    const payloadB64 = Buffer.from(JSON.stringify(claims)).toString(
      "base64url"
    );
    const unsignedToken = `${headerB64}.${payloadB64}`;
    const signature = crypto.createHmac("sha256", SecurityConfig.JWT_SECRET).update(unsignedToken).digest("base64url");
    return {
      token: `${unsignedToken}.${signature}`,
      expiresAt: exp * 1e3
    };
  },
  verifyToken(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const [headerB64, payloadB64, signatureB64] = parts;
      const unsignedToken = `${headerB64}.${payloadB64}`;
      const expectedSignature = crypto.createHmac("sha256", SecurityConfig.JWT_SECRET).update(unsignedToken).digest("base64url");
      const sigBuf = Buffer.from(signatureB64);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return null;
      }
      const claims = JSON.parse(
        Buffer.from(payloadB64, "base64url").toString("utf8")
      );
      const nowSeconds = Math.floor(Date.now() / 1e3);
      if (!claims.exp || claims.exp < nowSeconds) {
        return null;
      }
      return claims;
    } catch {
      return null;
    }
  },
  signPayloadIntegrity(data) {
    return crypto.createHmac("sha256", SecurityConfig.JWT_SECRET).update(JSON.stringify(data)).digest("hex");
  }
};

// server/database/database.repository.ts
var LOCAL_DB_PATH = path.resolve(
  process.cwd(),
  "server",
  "database",
  "lumera-db.json"
);
var TMP_DB_PATH = path.join(os.tmpdir(), "lumera-db.json");
var memoryDbCache = null;
var DatabaseRepository = {
  ensureInitialized() {
    if (fs.existsSync(TMP_DB_PATH)) {
      try {
        const raw = fs.readFileSync(TMP_DB_PATH, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.users)) {
          memoryDbCache = parsed;
          return parsed;
        }
      } catch {
      }
    }
    if (fs.existsSync(LOCAL_DB_PATH)) {
      try {
        const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.users)) {
          memoryDbCache = parsed;
          return parsed;
        }
      } catch {
      }
    }
    if (memoryDbCache) {
      return memoryDbCache;
    }
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const adminUser = {
      id: "usr-admin-001",
      email: SecurityConfig.DEFAULT_ADMIN_EMAIL.toLowerCase(),
      fullName: SecurityConfig.DEFAULT_ADMIN_NAME,
      role: "ADMIN",
      passwordHash: CryptoService.hashPassword(
        SecurityConfig.DEFAULT_ADMIN_PASSWORD
      ),
      createdAt: nowIso
    };
    const seededProducts = PRODUCTS_DATA.map(
      (product) => VariantStockService.normalizeProductInventory({
        ...product,
        inventoryMode: product.inventoryMode ?? "by_color_and_size",
        isVisible: true,
        updatedAt: nowIso
      })
    );
    const initialLedger = seededProducts.map((prod) => {
      const totalStock = VariantStockService.getProductTotalStock(prod);
      const entryCore = {
        productId: prod.id,
        sku: prod.sku,
        productName: prod.name,
        variantKey: "ALL_VARIANTS",
        previousStock: 0,
        newStock: totalStock,
        delta: totalStock,
        unitPriceCop: prod.price,
        unitCostCop: prod.costPriceCop ?? Math.round(prod.price * 0.42),
        reason: "INITIAL_SEED",
        actorEmail: adminUser.email,
        createdAt: nowIso
      };
      return {
        id: `ldg-${crypto2.randomUUID().slice(0, 8)}`,
        ...entryCore,
        signature: CryptoService.signPayloadIntegrity(entryCore)
      };
    });
    const initialDb = {
      users: [adminUser],
      subcategories: [...INITIAL_SUBCATEGORIES_SEED],
      products: seededProducts,
      inventoryLedger: initialLedger,
      updatedAt: nowIso
    };
    this.save(initialDb);
    return initialDb;
  },
  read() {
    return this.ensureInitialized();
  },
  save(data) {
    data.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    memoryDbCache = data;
    const serialized = JSON.stringify(data, null, 2);
    try {
      const dir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_PATH, serialized, "utf8");
    } catch {
      try {
        fs.writeFileSync(TMP_DB_PATH, serialized, "utf8");
      } catch {
      }
    }
  },
  recordLedgerEntry(params) {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const core = {
      productId: params.product.id,
      sku: params.product.sku,
      productName: params.product.name,
      variantKey: params.variantKey,
      previousStock: params.previousStock,
      newStock: params.newStock,
      delta: params.newStock - params.previousStock,
      unitPriceCop: params.product.price,
      unitCostCop: params.product.costPriceCop ?? Math.round(params.product.price * 0.42),
      reason: params.reason,
      actorEmail: params.actorEmail,
      createdAt: nowIso
    };
    const entry = {
      id: `ldg-${crypto2.randomUUID().slice(0, 8)}`,
      ...core,
      signature: CryptoService.signPayloadIntegrity(core)
    };
    params.db.inventoryLedger.unshift(entry);
    if (params.db.inventoryLedger.length > 500) {
      params.db.inventoryLedger = params.db.inventoryLedger.slice(0, 500);
    }
    return entry;
  }
};

// server/middleware/auth.middleware.ts
var AuthMiddleware = {
  extractClaims(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.slice(7).trim();
    if (!token) return null;
    return CryptoService.verifyToken(token);
  },
  requireRole(req, allowedRoles = ["ADMIN"]) {
    const claims = this.extractClaims(req);
    if (!claims) {
      return {
        authorized: false,
        status: 401,
        message: "No autorizado. Se requiere firma JWT v\xE1lida."
      };
    }
    if (!allowedRoles.includes(claims.role)) {
      return {
        authorized: false,
        status: 403,
        message: "Acceso denegado. Privilegios insuficientes para esta operaci\xF3n."
      };
    }
    return {
      authorized: true,
      claims
    };
  }
};

// server/services/upload.service.ts
import crypto3 from "node:crypto";
import fs2 from "node:fs";
import path2 from "node:path";
var ALLOWED_MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg"
};
var UPLOADS_DIR = path2.resolve(process.cwd(), "public", "uploads");
var UploadService = {
  saveBase64Image(dataUrl, originalName = "product-image") {
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      throw new Error(
        "Formato de imagen inv\xE1lido. Debe ser una imagen codificada en Base64."
      );
    }
    const mimeType = match[1].toLowerCase();
    const base64Payload = match[2];
    const ext = ALLOWED_MIME_EXTENSIONS[mimeType];
    if (!ext) {
      throw new Error(
        `Tipo de archivo no permitido (${mimeType}). Usa JPG, PNG, WEBP, AVIF o SVG.`
      );
    }
    const buffer = Buffer.from(base64Payload, "base64");
    if (buffer.byteLength > SecurityConfig.MAX_UPLOAD_BYTES) {
      throw new Error("La imagen supera el l\xEDmite m\xE1ximo permitido de 8 MB.");
    }
    const sanitizedPrefix = originalName.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9-_]/g, "-").slice(0, 32);
    const hash = crypto3.createHash("sha1").update(buffer).digest("hex").slice(0, 10);
    const fileName = `${Date.now()}-${sanitizedPrefix || "lumera"}-${hash}.${ext}`;
    try {
      if (!fs2.existsSync(UPLOADS_DIR)) {
        fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const fullPath = path2.join(UPLOADS_DIR, fileName);
      fs2.writeFileSync(fullPath, buffer);
      return {
        url: `/uploads/${fileName}`,
        fileName,
        sizeBytes: buffer.byteLength
      };
    } catch {
      return {
        url: dataUrl,
        fileName,
        sizeBytes: buffer.byteLength
      };
    }
  }
};

// server/router/api.router.ts
function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}
function readJsonBody(req) {
  const preParsed = req.body;
  if (preParsed !== void 0 && preParsed !== null) {
    if (typeof preParsed === "string") {
      try {
        return Promise.resolve(
          preParsed.trim() ? JSON.parse(preParsed) : {}
        );
      } catch {
        return Promise.reject(
          new Error("JSON inv\xE1lido en el cuerpo de la petici\xF3n.")
        );
      }
    }
    if (typeof preParsed === "object") {
      return Promise.resolve(preParsed);
    }
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;
    const maxBodyBytes = 12 * 1024 * 1024;
    req.on("data", (chunk) => {
      totalBytes += chunk.byteLength;
      if (totalBytes > maxBodyBytes) {
        reject(new Error("Payload demasiado grande."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (!raw.trim()) {
          resolve({});
          return;
        }
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON inv\xE1lido en el cuerpo de la petici\xF3n."));
      }
    });
    req.on("error", (err) => reject(err));
  });
}
var ApiRouter = {
  async handle(req, res) {
    const rawUrl = req.url ?? "";
    const initialUrlObj = new URL(rawUrl || "/", "http://localhost");
    const rewrittenRoute = initialUrlObj.searchParams.get("__route");
    const effectiveUrl = rewrittenRoute ? rewrittenRoute.startsWith("/") ? rewrittenRoute : `/api/v1/${rewrittenRoute}` : rawUrl;
    if (!effectiveUrl.startsWith("/api/v1/")) {
      return false;
    }
    const urlObj = new URL(effectiveUrl, "http://localhost");
    const pathname = urlObj.pathname;
    const method = (req.method ?? "GET").toUpperCase();
    try {
      if (pathname === "/api/v1/auth/login" && method === "POST") {
        const body = await readJsonBody(
          req
        );
        const email = (body.email ?? "").trim().toLowerCase();
        const password = body.password ?? "";
        if (!email || !password) {
          sendJson(res, 400, {
            error: "Debes ingresar correo electr\xF3nico y contrase\xF1a."
          });
          return true;
        }
        const db = DatabaseRepository.read();
        const userRecord = db.users.find(
          (u) => u.email.toLowerCase() === email
        );
        if (!userRecord || !CryptoService.verifyPassword(password, userRecord.passwordHash)) {
          sendJson(res, 401, {
            error: "Credenciales inv\xE1lidas. Verifica tu correo y contrase\xF1a."
          });
          return true;
        }
        const { token, expiresAt } = CryptoService.signToken({
          sub: userRecord.id,
          email: userRecord.email,
          fullName: userRecord.fullName,
          role: userRecord.role
        });
        const response = {
          token,
          expiresAt,
          user: {
            id: userRecord.id,
            email: userRecord.email,
            fullName: userRecord.fullName,
            role: userRecord.role
          }
        };
        sendJson(res, 200, response);
        return true;
      }
      if (pathname === "/api/v1/auth/me" && method === "GET") {
        const auth = AuthMiddleware.requireRole(req, [
          "ADMIN",
          "MANAGER",
          "ACCOUNTING"
        ]);
        if (!auth.authorized) {
          sendJson(res, auth.status, { error: auth.message });
          return true;
        }
        sendJson(res, 200, {
          user: {
            id: auth.claims.sub,
            email: auth.claims.email,
            fullName: auth.claims.fullName,
            role: auth.claims.role
          }
        });
        return true;
      }
      if (pathname === "/api/v1/catalog" && method === "GET") {
        const db = DatabaseRepository.read();
        const publicProducts = db.products.filter((p) => p.isVisible !== false).map((p) => {
          const normalized = VariantStockService.normalizeProductInventory(p);
          const { costPriceCop: _cost, ...publicProduct } = normalized;
          return publicProduct;
        });
        const publicSubcategories = db.subcategories.filter((s) => s.isVisible !== false).sort((a, b) => a.sortOrder - b.sortOrder);
        const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
        const signature = CryptoService.signPayloadIntegrity({
          productsCount: publicProducts.length,
          subcategoriesCount: publicSubcategories.length,
          updatedAt: db.updatedAt
        });
        const payload = {
          products: publicProducts,
          subcategories: publicSubcategories,
          signature,
          generatedAt
        };
        sendJson(res, 200, payload);
        return true;
      }
      if (pathname.startsWith("/api/v1/admin/")) {
        const auth = AuthMiddleware.requireRole(req, ["ADMIN", "MANAGER"]);
        if (!auth.authorized) {
          sendJson(res, auth.status, { error: auth.message });
          return true;
        }
        const actorEmail = auth.claims.email;
        if (pathname === "/api/v1/admin/catalog" && method === "GET") {
          const db = DatabaseRepository.read();
          const normalizedProducts = db.products.map(
            (p) => VariantStockService.normalizeProductInventory(p)
          );
          const sortedSubcategories = [...db.subcategories].sort(
            (a, b) => a.sortOrder - b.sortOrder
          );
          const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
          const signature = CryptoService.signPayloadIntegrity({
            products: normalizedProducts.map((p) => ({
              id: p.id,
              price: p.price,
              stock: VariantStockService.getProductTotalStock(p)
            })),
            updatedAt: db.updatedAt
          });
          const response = {
            products: normalizedProducts,
            subcategories: sortedSubcategories,
            ledger: db.inventoryLedger,
            signature,
            generatedAt
          };
          sendJson(res, 200, response);
          return true;
        }
        if (pathname === "/api/v1/admin/uploads" && method === "POST") {
          const body = await readJsonBody(req);
          if (!body.dataUrl) {
            sendJson(res, 400, {
              error: "No se recibi\xF3 la imagen a cargar."
            });
            return true;
          }
          const uploaded = UploadService.saveBase64Image(
            body.dataUrl,
            body.fileName
          );
          sendJson(res, 201, uploaded);
          return true;
        }
        if (pathname === "/api/v1/admin/products" && method === "POST") {
          const incoming = await readJsonBody(req);
          if (!incoming.name || !incoming.department || !incoming.category) {
            sendJson(res, 400, {
              error: "Nombre, departamento (Ropa o Makeup) y categor\xEDa son obligatorios."
            });
            return true;
          }
          const db = DatabaseRepository.read();
          const newId = incoming.id?.trim() || `lum-${incoming.department === "makeup" ? "mk" : "ropa"}-${crypto4.randomUUID().slice(0, 6)}`;
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const baseProduct = {
            id: newId,
            sku: incoming.sku?.trim().toUpperCase() || newId.toUpperCase(),
            name: incoming.name.trim().toUpperCase(),
            subtitle: incoming.subtitle?.trim() || "",
            department: incoming.department,
            category: incoming.category,
            categoryLabel: incoming.categoryLabel || incoming.category,
            subcategoryId: incoming.subcategoryId,
            price: Number(incoming.price) || 0,
            compareAtPrice: incoming.compareAtPrice ? Number(incoming.compareAtPrice) : void 0,
            costPriceCop: incoming.costPriceCop ? Number(incoming.costPriceCop) : void 0,
            taxRatePct: incoming.taxRatePct ?? 19,
            badge: incoming.badge,
            description: incoming.description || "",
            editorialNote: incoming.editorialNote || "",
            colors: Array.isArray(incoming.colors) && incoming.colors.length > 0 ? incoming.colors : [
              {
                id: "color-default",
                name: "Tono Principal",
                hex: "#151515",
                finish: "Est\xE1ndar",
                images: [
                  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85"
                ],
                stock: 5,
                inStock: true
              }
            ],
            sizes: Array.isArray(incoming.sizes) && incoming.sizes.length > 0 ? incoming.sizes : [
              {
                label: incoming.department === "makeup" ? "Full Size" : "S",
                measurementsOrDetail: "Est\xE1ndar",
                inStock: true,
                stock: 5
              }
            ],
            sizeTypeLabel: incoming.sizeTypeLabel ?? (incoming.department === "makeup" ? "FORMATO / PRESENTACI\xD3N" : "TALLA"),
            colorTypeLabel: incoming.colorTypeLabel ?? (incoming.department === "makeup" ? "TONO / ACABADO" : "COLOR"),
            inventoryMode: incoming.inventoryMode ?? "by_color_and_size",
            variantStockMatrix: incoming.variantStockMatrix ?? {},
            isVisible: incoming.isVisible !== false,
            compositionOrIngredients: incoming.compositionOrIngredients || "",
            careOrHowToUse: incoming.careOrHowToUse || "",
            specifications: incoming.specifications ?? [],
            relatedProductIds: incoming.relatedProductIds ?? [],
            featured: Boolean(incoming.featured),
            updatedAt: nowIso
          };
          const normalized = VariantStockService.normalizeProductInventory(baseProduct);
          db.products.unshift(normalized);
          DatabaseRepository.recordLedgerEntry({
            db,
            product: normalized,
            variantKey: "CREATE_PRODUCT",
            previousStock: 0,
            newStock: VariantStockService.getProductTotalStock(normalized),
            reason: "PRODUCT_UPDATE",
            actorEmail
          });
          DatabaseRepository.save(db);
          sendJson(res, 201, { product: normalized });
          return true;
        }
        const productRouteMatch = /^\/api\/v1\/admin\/products\/([^/]+)(?:\/(visibility|stock))?$/.exec(
          pathname
        );
        if (productRouteMatch) {
          const productId = decodeURIComponent(productRouteMatch[1]);
          const subAction = productRouteMatch[2];
          const db = DatabaseRepository.read();
          const productIndex = db.products.findIndex((p) => p.id === productId);
          if (productIndex === -1) {
            sendJson(res, 404, { error: "Producto no encontrado." });
            return true;
          }
          const existingProduct = VariantStockService.normalizeProductInventory(
            db.products[productIndex]
          );
          if (subAction === "visibility" && method === "PATCH") {
            const body = await readJsonBody(req);
            const nextVisible = typeof body.isVisible === "boolean" ? body.isVisible : !existingProduct.isVisible;
            const updated = {
              ...existingProduct,
              isVisible: nextVisible,
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            db.products[productIndex] = updated;
            DatabaseRepository.save(db);
            sendJson(res, 200, { product: updated });
            return true;
          }
          if (subAction === "stock" && method === "PATCH") {
            const body = await readJsonBody(req);
            const newStock = Math.max(0, Math.floor(Number(body.stock ?? 0)));
            const mode = VariantStockService.getInventoryMode(existingProduct);
            const prevTotal = VariantStockService.getProductTotalStock(existingProduct);
            let variantKeyLabel = "ALL";
            const updatedDraft = {
              ...existingProduct,
              colors: existingProduct.colors.map((c) => ({ ...c })),
              sizes: existingProduct.sizes.map((s) => ({ ...s })),
              variantStockMatrix: {
                ...existingProduct.variantStockMatrix ?? {}
              }
            };
            if (mode === "by_size" && body.sizeLabel) {
              variantKeyLabel = `SIZE:${body.sizeLabel}`;
              updatedDraft.sizes = updatedDraft.sizes.map(
                (s) => s.label === body.sizeLabel ? { ...s, stock: newStock, inStock: newStock > 0 } : s
              );
            } else if (mode === "by_color" && body.colorId) {
              variantKeyLabel = `COLOR:${body.colorId}`;
              updatedDraft.colors = updatedDraft.colors.map(
                (c) => c.id === body.colorId ? { ...c, stock: newStock, inStock: newStock > 0 } : c
              );
            } else if (body.colorId && body.sizeLabel) {
              const key = VariantStockService.buildVariantKey(
                body.colorId,
                body.sizeLabel
              );
              variantKeyLabel = key;
              updatedDraft.variantStockMatrix[key] = newStock;
            }
            const normalized = VariantStockService.normalizeProductInventory(updatedDraft);
            normalized.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
            db.products[productIndex] = normalized;
            const nextTotal = VariantStockService.getProductTotalStock(normalized);
            DatabaseRepository.recordLedgerEntry({
              db,
              product: normalized,
              variantKey: variantKeyLabel,
              previousStock: prevTotal,
              newStock: nextTotal,
              reason: "ADMIN_ADJUSTMENT",
              actorEmail
            });
            DatabaseRepository.save(db);
            sendJson(res, 200, { product: normalized });
            return true;
          }
          if (!subAction && method === "PUT") {
            const incoming = await readJsonBody(req);
            const prevTotal = VariantStockService.getProductTotalStock(existingProduct);
            const merged = {
              ...existingProduct,
              ...incoming,
              id: existingProduct.id,
              name: (incoming.name ?? existingProduct.name).trim().toUpperCase(),
              sku: (incoming.sku ?? existingProduct.sku).trim().toUpperCase(),
              price: Number(incoming.price ?? existingProduct.price),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            const normalized = VariantStockService.normalizeProductInventory(merged);
            db.products[productIndex] = normalized;
            const nextTotal = VariantStockService.getProductTotalStock(normalized);
            DatabaseRepository.recordLedgerEntry({
              db,
              product: normalized,
              variantKey: "FULL_PRODUCT_UPDATE",
              previousStock: prevTotal,
              newStock: nextTotal,
              reason: "PRODUCT_UPDATE",
              actorEmail
            });
            DatabaseRepository.save(db);
            sendJson(res, 200, { product: normalized });
            return true;
          }
          if (!subAction && method === "DELETE") {
            db.products.splice(productIndex, 1);
            DatabaseRepository.save(db);
            sendJson(res, 200, { deletedId: productId });
            return true;
          }
        }
        if (pathname === "/api/v1/admin/subcategories" && method === "POST") {
          const body = await readJsonBody(req);
          if (!body.label || !body.department || !body.category) {
            sendJson(res, 400, {
              error: "Nombre de subcategor\xEDa, departamento y categor\xEDa base son obligatorios."
            });
            return true;
          }
          const db = DatabaseRepository.read();
          const slug = body.slug?.trim().toLowerCase() || body.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const newSub = {
            id: `sub-${crypto4.randomUUID().slice(0, 8)}`,
            slug,
            label: body.label.trim().toUpperCase(),
            department: body.department,
            category: body.category,
            searchKeyword: body.searchKeyword?.trim() || "",
            showInNewArrivals: Boolean(body.showInNewArrivals),
            isVisible: body.isVisible !== false,
            sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : db.subcategories.length + 1
          };
          db.subcategories.push(newSub);
          DatabaseRepository.save(db);
          sendJson(res, 201, { subcategory: newSub });
          return true;
        }
        const subRouteMatch = /^\/api\/v1\/admin\/subcategories\/([^/]+)$/.exec(
          pathname
        );
        if (subRouteMatch) {
          const subId = decodeURIComponent(subRouteMatch[1]);
          const db = DatabaseRepository.read();
          const subIndex = db.subcategories.findIndex((s) => s.id === subId);
          if (subIndex === -1) {
            sendJson(res, 404, { error: "Subcategor\xEDa no encontrada." });
            return true;
          }
          if (method === "PUT") {
            const body = await readJsonBody(
              req
            );
            const existing = db.subcategories[subIndex];
            const updated = {
              ...existing,
              ...body,
              id: existing.id,
              label: (body.label ?? existing.label).trim().toUpperCase()
            };
            db.subcategories[subIndex] = updated;
            DatabaseRepository.save(db);
            sendJson(res, 200, { subcategory: updated });
            return true;
          }
          if (method === "DELETE") {
            db.subcategories.splice(subIndex, 1);
            DatabaseRepository.save(db);
            sendJson(res, 200, { deletedId: subId });
            return true;
          }
        }
      }
      sendJson(res, 404, { error: `Ruta API no encontrada: ${pathname}` });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error interno del servidor.";
      sendJson(res, 500, { error: message });
      return true;
    }
  }
};

// server/vercel-entry.ts
async function handler(req, res) {
  const handled = await ApiRouter.handle(req, res);
  if (!handled) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Endpoint no encontrado." }));
  }
}
export {
  handler as default
};
