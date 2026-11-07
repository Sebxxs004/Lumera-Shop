import { Product } from '../types/product.types';

export const PRODUCTS_DATA: Product[] = [
  /* ==========================================================================
     CATEGORÍA 1: VESTIDOS & CONJUNTOS (BOUTIQUE)
     ========================================================================== */
  {
    id: 'lum-dress-001',
    sku: 'LUM-VC-001',
    name: 'VESTIDO MIDI SATÉN ÉCLAT',
    subtitle: 'Corte al bies con espalda descubierta y tirantes ajustables',
    department: 'boutique',
    category: 'vestidos-conjuntos',
    categoryLabel: 'Vestidos & Conjuntos',
    price: 185,
    compareAtPrice: 220,
    badge: 'BESTSELLER',
    featured: true,
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Confeccionado en satén de alto gramaje con caída líquida que acaricia la silueta. Su corte al bies se adapta de forma orgánica al cuerpo, mientras que el escote drapeado y los tirantes finos cruzados aportan una elegancia atemporal de galería.',
    editorialNote:
      'Combínalo con el Aceite Labial Luméra Glaze en tono 01 Berry Glass para un look monocromático de noche.',
    colors: [
      {
        id: 'rose-lumera',
        name: 'Rosa Luméra',
        hex: '#c21863',
        finish: 'Satén de Seda',
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'pearl-ivory',
        name: 'Marfil Perla',
        hex: '#f5efe6',
        finish: 'Satén Luminoso',
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'noir-caviar',
        name: 'Negro Caviar',
        hex: '#1b1b1b',
        finish: 'Satén Mate',
        images: [
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Busto 80-84 cm · Cintura 60-64 cm · Cadera 88-92 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Busto 84-88 cm · Cintura 64-68 cm · Cadera 92-96 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Busto 88-93 cm · Cintura 68-73 cm · Cadera 96-101 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Busto 93-99 cm · Cintura 73-79 cm · Cadera 101-107 cm', inStock: true },
      { label: 'XL', measurementsOrDetail: 'Busto 99-105 cm · Cintura 79-85 cm · Cadera 107-113 cm', inStock: false },
    ],
    compositionOrIngredients: '92% Seda Morera Certificada, 8% Elastano de recuperación suave. Forro interior 100% viscosa transpirable.',
    careOrHowToUse: 'Lavado en seco delicado o lavado a mano en agua fría. Planchar del revés a vapor suave.',
    specifications: [
      { label: 'Calce', value: 'Fluido al bies (Fiel a la talla)' },
      { label: 'Largo total', value: '126 cm (en talla S)' },
      { label: 'Cierre', value: 'Cremallera invisible lateral + lazada ajustable' },
      { label: 'Origen', value: 'Diseño exclusivo Atelier Luméra' },
    ],
    relatedProductIds: ['lum-mk-001', 'lum-top-001', 'lum-mk-003'],
  },
  {
    id: 'lum-dress-002',
    sku: 'LUM-VC-002',
    name: 'CONJUNTO SASTRE LINO ATELIER',
    subtitle: 'Blazer entallado de botonadura oculta y pantalón recto',
    department: 'boutique',
    category: 'vestidos-conjuntos',
    categoryLabel: 'Vestidos & Conjuntos',
    price: 240,
    badge: 'NEW IN',
    featured: true,
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Un conjunto de dos piezas que redefine la sastrería femenina contemporánea. El blazer presenta hombros suavemente estructurados y cintura marcada, acompañado de un pantalón de tiro alto que estiliza la figura con total comodidad.',
    editorialNote:
      'Ideal para llevar junto o por separado. El tono Blush Peony ilumina la piel al instante.',
    colors: [
      {
        id: 'blush-peony',
        name: 'Blush Peonía',
        hex: '#e58ab5',
        finish: 'Lino Sastre Peinado',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'sand-stone',
        name: 'Arena Crudo',
        hex: '#d8cbb8',
        finish: 'Lino Orgánico',
        images: [
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Busto 80-84 cm · Cintura 60-64 cm · Tiro 31 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Busto 84-88 cm · Cintura 64-68 cm · Tiro 31.5 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Busto 88-93 cm · Cintura 68-73 cm · Tiro 32 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Busto 93-99 cm · Cintura 73-79 cm · Tiro 33 cm', inStock: true },
    ],
    compositionOrIngredients: '78% Lino Europeo, 22% Lyocell Tencel anti-arrugas.',
    careOrHowToUse: 'Limpieza en seco recomendada. Vaporizar en vertical antes de usar.',
    specifications: [
      { label: 'Piezas incluidas', value: '2 piezas (Blazer + Pantalón Sastre)' },
      { label: 'Bolsillos', value: 'Bolsillos laterales invisibles y bolsillo sastre interno' },
      { label: 'Forro', value: 'Medio forro transpirable en satén' },
    ],
    relatedProductIds: ['lum-top-002', 'lum-mk-002', 'lum-bot-001'],
  },
  {
    id: 'lum-dress-003',
    sku: 'LUM-VC-003',
    name: 'MINI VESTIDO ESTRUCTURado DAHLIA',
    subtitle: 'Escote corazón arquitectónico y falda globo sutil',
    department: 'boutique',
    category: 'vestidos-conjuntos',
    categoryLabel: 'Vestidos & Conjuntos',
    price: 165,
    badge: 'LIMITED EDITION',
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Diseñado para capturar todas las miradas. El corpiño interno con varillas flexibles brinda soporte sin necesidad de sujetador, mientras su falda con volumen escultural crea una silueta digna de editorial de revista.',
    editorialNote: 'Edición numerada de temporada.',
    colors: [
      {
        id: 'berry-couture',
        name: 'Magenta Couture',
        hex: '#a81353',
        finish: 'Tafetán de Seda',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'white-gallery',
        name: 'Blanco Galería',
        hex: '#ffffff',
        finish: 'Popelín Estructurado',
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Busto 80-84 cm · Cintura 60-63 cm · Largo 82 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Busto 84-88 cm · Cintura 64-67 cm · Largo 84 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Busto 88-92 cm · Cintura 68-72 cm · Largo 86 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Busto 93-98 cm · Cintura 73-78 cm · Largo 88 cm', inStock: false },
    ],
    compositionOrIngredients: '85% Tafetán de Poliéster Reciclado de Alta Densidad, 15% Seda.',
    careOrHowToUse: 'Lavar en seco únicamente. Guardar colgado con funda protectora.',
    specifications: [
      { label: 'Soporte interno', value: 'Corsetería suave integrada con banda antideslizante' },
      { label: 'Largo', value: 'Mini por encima de la rodilla' },
    ],
    relatedProductIds: ['lum-mk-001', 'lum-mk-004'],
  },

  /* ==========================================================================
     CATEGORÍA 2: TOPS & BLUSAS (BOUTIQUE)
     ========================================================================== */
  {
    id: 'lum-top-001',
    sku: 'LUM-TB-001',
    name: 'CORSET ESCULTURAL LUMÉRA ARCHIVE',
    subtitle: 'Costuras anatómicas y escote cuadrado minimalista',
    department: 'boutique',
    category: 'tops-blusas',
    categoryLabel: 'Tops & Blusas',
    price: 115,
    badge: 'EDITORIAL PICK',
    featured: true,
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Nuestra pieza insignia de sastrería superior. Elaborado con paneles anatómicos que moldean el torso con total confort gracias a su tejido elástico de doble punto y varillas flexibles que acompañan el movimiento.',
    editorialNote:
      'El contraste perfecto junto al Pantalón Palazzo Céline de tiro alto.',
    colors: [
      {
        id: 'magenta-iconic',
        name: 'Rosa Luméra',
        hex: '#c21863',
        finish: 'Crepé Estructurado',
        images: [
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'carbon-black',
        name: 'Negro Carbono',
        hex: '#000000',
        finish: 'Crepé Mate',
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'paper-white',
        name: 'Blanco Papel',
        hex: '#ffffff',
        finish: 'Crepé Sastre',
        images: [
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Busto 79-83 cm · Cintura 59-63 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Busto 84-88 cm · Cintura 64-68 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Busto 89-94 cm · Cintura 69-74 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Busto 95-100 cm · Cintura 75-80 cm', inStock: true },
    ],
    compositionOrIngredients: '68% Viscosa Ecovero, 27% Poliamida, 5% Elastano.',
    careOrHowToUse: 'Lavar a mano en agua fría. Secar en plano a la sombra.',
    specifications: [
      { label: 'Cierre trasero', value: 'Corchetes metálicos invisibles con 3 niveles de ajuste' },
      { label: 'Nivel de soporte', value: 'Alto (estructura interna suave)' },
    ],
    relatedProductIds: ['lum-bot-001', 'lum-bot-002', 'lum-mk-002'],
  },
  {
    id: 'lum-top-002',
    sku: 'LUM-TB-002',
    name: 'BLUSA DRAPEADA EN ORGANZA DE SEDA',
    subtitle: 'Mangas abullonadas translúcidas y lazada desmontable en cuello',
    department: 'boutique',
    category: 'tops-blusas',
    categoryLabel: 'Tops & Blusas',
    price: 138,
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Una oda a la feminidad etérea. Esta blusa combina un cuerpo forrado en crepé suave con mangas de organza translúcida y puños abotonados extra largos. Su lazada permite llevarse anudada al cuello, suelta o como cinturón.',
    editorialNote: 'Ligera como el aire; perfecta del estudio a una cena especial.',
    colors: [
      {
        id: 'petal-mist',
        name: 'Niebla Rosa',
        hex: '#f3c6dc',
        finish: 'Organza de Seda',
        images: [
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'pure-ivory',
        name: 'Blanco Óptico',
        hex: '#ffffff',
        finish: 'Organza Natural',
        images: [
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Hombros 36 cm · Busto 84 cm · Largo 60 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Hombros 37.5 cm · Busto 88 cm · Largo 61 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Hombros 39 cm · Busto 93 cm · Largo 62 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Hombros 40.5 cm · Busto 98 cm · Largo 63.5 cm', inStock: true },
    ],
    compositionOrIngredients: '100% Organza de Seda Natural (exterior) · 100% Modal (top interior incluido).',
    careOrHowToUse: 'Limpieza en seco especializada en seda.',
    specifications: [
      { label: 'Incluye', value: 'Camisola interior a tono y lazada desmontable' },
      { label: 'Botones', value: 'Nácar natural tallado' },
    ],
    relatedProductIds: ['lum-bot-001', 'lum-mk-001'],
  },
  {
    id: 'lum-top-003',
    sku: 'LUM-TB-003',
    name: 'CARDIGAN FINO CASHMERE ROSE BUTTON',
    subtitle: 'Punto de seda y cashmere con botones joya esmaltados a tono',
    department: 'boutique',
    category: 'tops-blusas',
    categoryLabel: 'Tops & Blusas',
    price: 155,
    badge: 'NEW IN',
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Tejido de galga fina ultrasuave diseñado para llevarse cerrado sobre la piel o abierto sobre vestidos lenceros. Su silueta ligeramente entallada en cintura define la figura con absoluta comodidad.',
    editorialNote: 'Una pieza de entretiempo esencial en el armario cápsula Luméra.',
    colors: [
      {
        id: 'cashmere-rose',
        name: 'Rosa Empolvado',
        hex: '#e58ab5',
        finish: 'Punto Seda-Cashmere',
        images: [
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'cashmere-berry',
        name: 'Magenta Luméra',
        hex: '#c21863',
        finish: 'Punto Fino Peinado',
        images: [
          'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Busto 82 cm · Largo 52 cm · Manga 60 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Busto 86 cm · Largo 53 cm · Manga 61 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Busto 91 cm · Largo 54.5 cm · Manga 62 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Busto 97 cm · Largo 56 cm · Manga 63 cm', inStock: true },
    ],
    compositionOrIngredients: '70% Lana Merino Extrafina, 20% Seda Morera, 10% Cashmere Certificado.',
    careOrHowToUse: 'Lavar a mano en agua fría con detergente para prendas delicadas. Secar en horizontal.',
    specifications: [
      { label: 'Textura', value: 'Tacto segunda piel sin picor' },
      { label: 'Cuello', value: 'Redondo clásico con ribete acanalado' },
    ],
    relatedProductIds: ['lum-bot-002', 'lum-mk-003'],
  },

  /* ==========================================================================
     CATEGORÍA 3: FALDAS & PANTALONES (BOUTIQUE)
     ========================================================================== */
  {
    id: 'lum-bot-001',
    sku: 'LUM-FP-001',
    name: 'PANTALÓN PALAZZO CÉLINE TIRO ALTO',
    subtitle: 'Pinzas dobles frontales y caída fluida de pierna ancha',
    department: 'boutique',
    category: 'faldas-pantalones',
    categoryLabel: 'Faldas & Pantalones',
    price: 145,
    badge: 'BESTSELLER',
    featured: true,
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'El pantalón definitivo de silueta alargada. Confeccionado en crepé pesado de caída impecable que no marca y acompaña cada paso con movimiento fluido. Pretina sastre reforzada con presillas y doble pinza frontal.',
    editorialNote: 'Diseño de pierna ancha que alarga visualmente la silueta.',
    colors: [
      {
        id: 'graphite-noir',
        name: 'Grafito Profundo',
        hex: '#1b1b1b',
        finish: 'Crepé Sastre Pesado',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'rose-statement',
        name: 'Magenta Editorial',
        hex: '#c21863',
        finish: 'Crepé Sastre',
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'chalk-white',
        name: 'Blanco Tiza',
        hex: '#f8f8f6',
        finish: 'Crepé Con Forro',
        images: [
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS (34)', measurementsOrDetail: 'Cintura 62 cm · Cadera 90 cm · Entrepierna 81 cm', inStock: true },
      { label: 'S (36)', measurementsOrDetail: 'Cintura 66 cm · Cadera 94 cm · Entrepierna 81.5 cm', inStock: true },
      { label: 'M (38)', measurementsOrDetail: 'Cintura 71 cm · Cadera 99 cm · Entrepierna 82 cm', inStock: true },
      { label: 'L (40)', measurementsOrDetail: 'Cintura 77 cm · Cadera 105 cm · Entrepierna 82.5 cm', inStock: true },
      { label: 'XL (42)', measurementsOrDetail: 'Cintura 83 cm · Cadera 111 cm · Entrepierna 83 cm', inStock: true },
    ],
    compositionOrIngredients: '74% Triacetato Sostenible, 26% Poliéster Reciclado.',
    careOrHowToUse: 'Lavado delicado a máquina máx. 30°C o limpieza en seco.',
    specifications: [
      { label: 'Tiro', value: 'Alto (32 cm)' },
      { label: 'Corte', value: 'Wide-leg / Palazzo' },
      { label: 'Bolsillos', value: '2 bolsillos diagonales delanteros + 2 ribeteados traseros' },
    ],
    relatedProductIds: ['lum-top-001', 'lum-top-002', 'lum-mk-002'],
  },
  {
    id: 'lum-bot-002',
    sku: 'LUM-FP-002',
    name: 'FALDA MIDI BIAS-CUT LUMIÈRE',
    subtitle: 'Satén sedoso con cintura elástica oculta y caída asimétrica',
    department: 'boutique',
    category: 'faldas-pantalones',
    categoryLabel: 'Faldas & Pantalones',
    price: 125,
    badge: 'NEW IN',
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'Cortada al bies para abrazar suavemente las curvas y abrirse en un vuelo delicado al caminar. Su acabado perlado refleja la luz con sutileza, convirtiéndola en el comodín más versátil de la colección.',
    editorialNote: 'Llévala a la cintura con prendas cortas o a la cadera para un aire relajado.',
    colors: [
      {
        id: 'rose-quartz',
        name: 'Cuarzo Rosa',
        hex: '#e58ab5',
        finish: 'Satén Perlado',
        images: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'deep-berry',
        name: 'Frambuesa Profundo',
        hex: '#9e114e',
        finish: 'Satén Intenso',
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Cintura 60-65 cm · Cadera 88-92 cm · Largo 86 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Cintura 65-70 cm · Cadera 92-96 cm · Largo 87 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Cintura 70-76 cm · Cadera 96-102 cm · Largo 88 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Cintura 76-82 cm · Cadera 102-108 cm · Largo 89 cm', inStock: true },
    ],
    compositionOrIngredients: '100% Viscosa Satinada Certificada FSC.',
    careOrHowToUse: 'Lavar a mano en agua fría con jabón neutro. No retorcer.',
    specifications: [
      { label: 'Largo', value: 'Midi (debajo de la rodilla)' },
      { label: 'Cintura', value: 'Banda interior limpia sin costuras visibles' },
    ],
    relatedProductIds: ['lum-top-001', 'lum-mk-001'],
  },
  {
    id: 'lum-bot-003',
    sku: 'LUM-FP-003',
    name: 'FALDA PANTALÓN SASTRE MARGAUX',
    subtitle: 'Diseño cruzado frontal tipo wrap con short sastre interior invisible',
    department: 'boutique',
    category: 'faldas-pantalones',
    categoryLabel: 'Faldas & Pantalones',
    price: 118,
    badge: 'EDITORIAL PICK',
    sizeTypeLabel: 'TALLA',
    colorTypeLabel: 'COLOR',
    description:
      'La estética pulida de una minifalda sastre asimétrica con la total libertad de movimiento de un short estructurado. Incluye hebilla lateral minimalista bañada en tono plata y tejido crepé con caída firme.',
    editorialNote: 'Comodidad absoluta para caminar y moverte por la ciudad con elegancia.',
    colors: [
      {
        id: 'skort-graphite',
        name: 'Negro Grafito',
        hex: '#1b1b1b',
        finish: 'Crepé Sastre',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'skort-lumera-pink',
        name: 'Rosa Luméra',
        hex: '#c21863',
        finish: 'Crepé Estructurado',
        images: [
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'XS', measurementsOrDetail: 'Cintura 61 cm · Cadera 89 cm · Largo 39 cm', inStock: true },
      { label: 'S', measurementsOrDetail: 'Cintura 65 cm · Cadera 93 cm · Largo 40 cm', inStock: true },
      { label: 'M', measurementsOrDetail: 'Cintura 70 cm · Cadera 98 cm · Largo 41 cm', inStock: true },
      { label: 'L', measurementsOrDetail: 'Cintura 76 cm · Cadera 104 cm · Largo 42.5 cm', inStock: true },
    ],
    compositionOrIngredients: '76% Poliéster Reciclado Sastre, 18% Viscosa, 6% Elastano.',
    careOrHowToUse: 'Lavado suave en agua fría. Planchado a baja temperatura.',
    specifications: [
      { label: 'Interior', value: 'Short completo en forro de viscosa transpirable' },
      { label: 'Tiro', value: 'Medio-Alto anatómico' },
    ],
    relatedProductIds: ['lum-top-001', 'lum-top-003', 'lum-mk-002'],
  },

  /* ==========================================================================
     CATEGORÍA 4: MAQUILLAJE — LABIOS & ROSTRO (BEAUTY)
     ========================================================================== */
  {
    id: 'lum-mk-001',
    sku: 'LUM-MK-001',
    name: 'LUMÉRA GLAZE PEPTIDE LIP OIL',
    subtitle: 'Aceite labial nutritivo con péptidos, escualano y brillo espejo 3D',
    department: 'makeup',
    category: 'maquillaje-labios-rostro',
    categoryLabel: 'Maquillaje — Labios & Rostro',
    price: 34,
    badge: 'BESTSELLER',
    featured: true,
    sizeTypeLabel: 'FORMATO / PRESENTACIÓN',
    colorTypeLabel: 'TONO / ACABADO',
    description:
      'Un híbrido entre tratamiento labial intensivo y gloss de alto impacto. Formulado con tripéptidos voluminizadores, aceite de semilla de frambuesa y ácido hialurónico que rellenan e hidratan los labios durante 12 horas sin sensación pegajosa.',
    editorialNote:
      'El tono 01 Luméra Berry replica exactamente el icónico pigmento rosa-magenta de nuestro logo.',
    colors: [
      {
        id: 'shade-01-lumera-berry',
        name: '01 Luméra Berry (Fucsia Traslúcido)',
        hex: '#c21863',
        finish: 'Brillo Espejo Cristal',
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'shade-02-sugar-petal',
        name: '02 Sugar Petal (Rosa Bebé)',
        hex: '#f08db9',
        finish: 'Brillo Nacarado Sutil',
        images: [
          'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'shade-03-espresso-rose',
        name: '03 Rosewood Glaze (Malva Tostado)',
        hex: '#914256',
        finish: 'Brillo Espejo',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'shade-04-crystal-dew',
        name: '04 Crystal Dew (Transparente Puro)',
        hex: '#f9e6ef',
        finish: 'Efecto Cristal Húmedo',
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'Full Size (7 ml)', measurementsOrDetail: '0.23 fl. oz. · Aplicador cushion XXL ergonómico', inStock: true },
      { label: 'Travel Size (3.5 ml)', measurementsOrDetail: '0.12 fl. oz. · Edición de bolsillo para bolso de noche', inStock: true },
      { label: 'Duo Set (2 x 7 ml)', measurementsOrDetail: 'Incluye estuche coleccionable Luméra', inStock: true },
    ],
    compositionOrIngredients:
      'Polyglyceryl-2 Triisostearate, Escualano Vegetal, Aceite de Jojoba Orgánico, Palmitoyl Tripeptide-1, Esferas de Ácido Hialurónico, Vitamina E. 100% Vegano y Cruelty-Free.',
    careOrHowToUse:
      'Desliza el aplicador cushion directamente sobre los labios limpios o encima de tu labial mate para un efecto tridimensional.',
    specifications: [
      { label: 'Acabado', value: 'High-Gloss Espejo sin sensación pegajosa' },
      { label: 'Fórmula', value: 'Vegana · Sin parabenos · Dermatológicamente probada' },
      { label: 'Aroma', value: 'Vainilla blanca y frutos rojos suaves' },
    ],
    relatedProductIds: ['lum-mk-002', 'lum-mk-003', 'lum-dress-001'],
  },
  {
    id: 'lum-mk-002',
    sku: 'LUM-MK-002',
    name: 'VELVET COUTURE MATTE LIPSTICK',
    subtitle: 'Labial en barra de pigmento puro con acabado terciopelo hidratante',
    department: 'makeup',
    category: 'maquillaje-labios-rostro',
    categoryLabel: 'Maquillaje — Labios & Rostro',
    price: 38,
    badge: 'EDITORIAL PICK',
    featured: true,
    sizeTypeLabel: 'FORMATO / PRESENTACIÓN',
    colorTypeLabel: 'TONO / ACABADO',
    description:
      'Color saturado en una sola pasada con textura nube ultraligera. Enriquecido con extracto de flor de camelia y ceras botánicas que difuminan las líneas de los labios dejando un acabado mate aterciopelado tipo filtro editorial.',
    editorialNote:
      'Bala biselada de alta precisión con grabado LUMÉRA y envase recargable magnético.',
    colors: [
      {
        id: 'velvet-01-lumera-signature',
        name: '101 Luméra Signature (Magenta Editorial)',
        hex: '#c21863',
        finish: 'Mate Terciopelo',
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'velvet-02-nude-cachemire',
        name: '102 Nude Cachemire (Rosa Almendra)',
        hex: '#c6827c',
        finish: 'Mate Difuminado',
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'velvet-03-rouge-velours',
        name: '103 Rouge Velours (Frambuesa Oscuro)',
        hex: '#8c123c',
        finish: 'Mate Intenso',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'Barra Completa (3.8 g)', measurementsOrDetail: 'Envase joya magnético recargable', inStock: true },
      { label: 'Recarga Eco (3.8 g)', measurementsOrDetail: 'Cartucho intercambiable para tu estuche Luméra', inStock: true },
    ],
    compositionOrIngredients:
      'Dimethicone, Aceite de Semilla de Camelia Japonica, Manteca de Karité Micronizada, Pigmentos Minerales Tratados.',
    careOrHowToUse:
      'Aplica desde el centro del labio hacia las comisuras. Para un efecto blurred lip, difumina los bordes con la yema del dedo.',
    specifications: [
      { label: 'Duración', value: 'Hasta 10 horas sin cuartearse' },
      { label: 'Cobertura', value: 'Total en una pasada (modulable)' },
    ],
    relatedProductIds: ['lum-mk-001', 'lum-mk-003', 'lum-top-001'],
  },
  {
    id: 'lum-mk-003',
    sku: 'LUM-MK-003',
    name: 'SILK DEW LIQUID BLUSH & CHEEK TINT',
    subtitle: 'Rubor líquido segunda piel con micro-perlas reflectoras de luz',
    department: 'makeup',
    category: 'maquillaje-labios-rostro',
    categoryLabel: 'Maquillaje — Labios & Rostro',
    price: 36,
    badge: 'NEW IN',
    featured: true,
    sizeTypeLabel: 'FORMATO / PRESENTACIÓN',
    colorTypeLabel: 'TONO / ACABADO',
    description:
      'Rubor en sérum de textura sedosa que se funde instantáneamente con la piel sin levantar la base. Su fórmula con niacinamida y extracto de rosa centifolia aporta un rubor fresco, saludable y luminoso durante todo el día.',
    editorialNote: 'Un solo punto en cada pómulo es suficiente para un rubor de pasarela.',
    colors: [
      {
        id: 'blush-01-peony-flush',
        name: 'Peony Flush (Rosa Fresco)',
        hex: '#e0538c',
        finish: 'Luminoso Satinado',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'blush-02-sunset-coral',
        name: 'Guava Rose (Rosa Coral Cálido)',
        hex: '#e46c64',
        finish: 'Dewy Radiante',
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'blush-03-berry-plum',
        name: 'Berry Atelier (Ciruela Rosado)',
        hex: '#9e265a',
        finish: 'Satinado Natural',
        images: [
          'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'Full Size (12 ml)', measurementsOrDetail: '0.40 fl. oz. · Dosificador de precisión', inStock: true },
      { label: 'Mini Size (5 ml)', measurementsOrDetail: '0.17 fl. oz. · Ideal para retoques', inStock: true },
    ],
    compositionOrIngredients:
      'Agua de Rosa Damascena, Niacinamida 2%, Escualano, Mica Mineral Ética, Extracto de Peonía.',
    careOrHowToUse:
      'Agitar bien. Aplicar 1-2 pequeños puntos en las mejillas y difuminar con brocha o a toquecitos con los dedos.',
    specifications: [
      { label: 'Tipo de piel', value: 'Apto para todo tipo de piel, incluso sensible' },
      { label: 'Uso dual', value: 'Mejillas y labios' },
    ],
    relatedProductIds: ['lum-mk-001', 'lum-mk-004'],
  },

  /* ==========================================================================
     CATEGORÍA 5: MAQUILLAJE — OJOS & PALETAS (BEAUTY)
     ========================================================================== */
  {
    id: 'lum-mk-004',
    sku: 'LUM-MK-004',
    name: 'PALETA EDITORIAL ROSE ARCHIVE (9 TONOS)',
    subtitle: 'Sombras compactas en texturas terciopelo mate, satén de seda y topper cristal',
    department: 'makeup',
    category: 'maquillaje-ojos-paletas',
    categoryLabel: 'Maquillaje — Ojos & Paletas',
    price: 58,
    badge: 'LIMITED EDITION',
    featured: true,
    sizeTypeLabel: 'FORMATO / PRESENTACIÓN',
    colorTypeLabel: 'TONO / ACABADO',
    description:
      'Una curaduría de 9 tonos diseñados para crear desde miradas suaves de día hasta ahumados editoriales en tonos rosa empolvado, malva, champagne reflectante y espresso profundo. Pigmentos micronizados de triple molienda que se difuminan sin esfuerzo.',
    editorialNote:
      'Incluye espejo panorámico de borde a borde con marco en el icónico rosa Luméra.',
    colors: [
      {
        id: 'palette-01-rose-archive',
        name: ' armonía 01 — Rose Archive (Rosas, Malvas & Champagne)',
        hex: '#c21863',
        finish: 'Mate + Shimmer + Topper',
        images: [
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'palette-02-nude-gallery',
        name: 'Armonía 02 — Nude Gallery (Neutros Cálidos & Bronce)',
        hex: '#b58876',
        finish: 'Mate + Metálico Seda',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'Paleta 9 x 1.5 g', measurementsOrDetail: 'Peso neto total 13.5 g · Con espejo integrado', inStock: true },
      { label: 'Paleta + Set 2 Brochas Ojos', measurementsOrDetail: 'Incluye brocha difuminadora y lengua de gato veganas', inStock: true },
    ],
    compositionOrIngredients:
      'Fórmula libre de talco con Manteca de Murumuru, Polvo de Seda Vegana y Perlas Reflectoras Multidimensionales.',
    careOrHowToUse:
      'Usa tonos mate con brocha suave para estructurar la cuenca y aplica los tonos topper con la yema del dedo en el centro del párpado móvil.',
    specifications: [
      { label: 'Número de sombras', value: '5 mates aterciopelados, 2 satinados, 2 toppers cristal' },
      { label: 'Fórmula', value: 'Sin caída de pigmento (Zero-Fallout Technology)' },
    ],
    relatedProductIds: ['lum-mk-005', 'lum-mk-001', 'lum-dress-003'],
  },
  {
    id: 'lum-mk-005',
    sku: 'LUM-MK-005',
    name: 'LASH SCULPT PANORAMIC MASCARA',
    subtitle: 'Máscara de pestañas de volumen arquitectónico y curvatura 24h',
    department: 'makeup',
    category: 'maquillaje-ojos-paletas',
    categoryLabel: 'Maquillaje — Ojos & Paletas',
    price: 32,
    sizeTypeLabel: 'FORMATO / PRESENTACIÓN',
    colorTypeLabel: 'TONO / ACABADO',
    description:
      'Define, separa y eleva cada pestaña desde la raíz hasta la punta sin grumos. Su cepillo reloj de arena con micro-cerdas captura hasta las pestañas más cortas, mientras su fórmula con pantenol y biotina las fortalece con cada aplicación.',
    editorialNote: 'Resistente a la humedad y al sudor; se retira fácilmente sin frotar.',
    colors: [
      {
        id: 'mascara-01-carbon-noir',
        name: 'Carbon Noir (Negro Ultra Intenso)',
        hex: '#000000',
        finish: 'Negro Satinado Profundo',
        images: [
          'https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'mascara-02-espresso-burgundy',
        name: 'Burgundy Noir (Borgoña Oscuro Editorial)',
        hex: '#4f1228',
        finish: 'Subtono Berry Sutil',
        images: [
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'Full Size (9.5 ml)', measurementsOrDetail: '0.32 fl. oz. · Cepillo escultural de elastómero', inStock: true },
      { label: 'Mini Size (4.5 ml)', measurementsOrDetail: '0.15 fl. oz. · Formato viaje', inStock: true },
    ],
    compositionOrIngredients:
      'Cera de Carnauba, Pantenol (Provitamina B5), Péptidos Fortalecedores de Pestañas, Óxidos de Hierro Ultrapuros.',
    careOrHowToUse:
      'Coloca el cepillo en la base de las pestañas y desliza en zigzag hacia arriba. Aplica una segunda capa para volumen dramático.',
    specifications: [
      { label: 'Oftalmológicamente testado', value: 'Sí, apto para ojos sensibles y lentes de contacto' },
      { label: 'Efecto', value: '+140% volumen panorámico y rizo sostenido' },
    ],
    relatedProductIds: ['lum-mk-004', 'lum-mk-001'],
  },
  {
    id: 'lum-mk-006',
    sku: 'LUM-MK-006',
    name: 'LUMINOUS SILK SKIN TINT SERUM SPF 30',
    subtitle: 'Base sérum perfeccionadora con ácido hialurónico y cobertura modulable',
    department: 'makeup',
    category: 'maquillaje-labios-rostro',
    categoryLabel: 'Maquillaje — Labios & Rostro',
    price: 48,
    badge: 'EDITORIAL PICK',
    sizeTypeLabel: 'FORMATO / PRESENTACIÓN',
    colorTypeLabel: 'TONO / ACABADO',
    description:
      'El secreto de una piel de galería. Combina la ligereza de un sérum botánico con pigmentos biomiméticos que unifican el tono, disimulan poros y dejan un acabado luminoso natural sin efecto máscara.',
    editorialNote: 'Enriquecida con complejo iluminador de peonía blanca y protección solar mineral SPF 30.',
    colors: [
      {
        id: 'skin-10-porcelain',
        name: '10N Porcelain Rose (Claro Subtono Neutro-Rosado)',
        hex: '#f3d9c8',
        finish: 'Satinado Segunda Piel',
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'skin-20-sand-nude',
        name: '20W Warm Nude (Medio Claro Subtono Cálido)',
        hex: '#e2ba9b',
        finish: 'Satinado Segunda Piel',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'skin-30-golden-honey',
        name: '30N Honey Beige (Medio Bronceado Neutro)',
        hex: '#c79672',
        finish: 'Satinado Segunda Piel',
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        ],
      },
      {
        id: 'skin-40-amber-glow',
        name: '40W Amber Rich (Oscuro Dorado Luminoso)',
        hex: '#986344',
        finish: 'Satinado Segunda Piel',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
        ],
      },
    ],
    sizes: [
      { label: 'Frasco Gotero (30 ml)', measurementsOrDetail: '1.0 fl. oz. · Hasta 90 aplicaciones', inStock: true },
      { label: 'Travel Size (15 ml)', measurementsOrDetail: '0.5 fl. oz. · Formato neceser de viaje', inStock: true },
    ],
    compositionOrIngredients:
      'Ácido Hialurónico Multimolecular, Niacinamida 3%, Extracto de Peonía Blanca, Óxido de Zinc No-Nano SPF 30.',
    careOrHowToUse:
      'Aplica 3-4 gotas sobre el rostro hidratado y extiende desde el centro hacia afuera con brocha o esponja húmeda.',
    specifications: [
      { label: 'Cobertura', value: 'Ligera a media modulable' },
      { label: 'No comedogénico', value: 'Sí, libre de aceites pesados y fragancias sintéticas' },
    ],
    relatedProductIds: ['lum-mk-003', 'lum-mk-001', 'lum-dress-002'],
  },
];

