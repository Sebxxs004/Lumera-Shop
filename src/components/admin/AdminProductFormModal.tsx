import React, { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { AdminApiService } from '../../services/admin-api.service';
import { VariantStockService } from '../../services/variant-stock.service';
import {
  InventoryTrackingMode,
  Product,
  ProductCategorySlug,
  ProductColorVariant,
  ProductSizeOption,
  SubcategoryDefinition,
} from '../../types/product.types';

interface AdminProductFormModalProps {
  initialProduct?: Product | null;
  subcategories: SubcategoryDefinition[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

const CATEGORY_OPTIONS: Array<{
  slug: Exclude<ProductCategorySlug, 'all'>;
  label: string;
  department: 'boutique' | 'makeup';
}> = [
  {
    slug: 'vestidos-conjuntos',
    label: 'Vestidos & Conjuntos',
    department: 'boutique',
  },
  {
    slug: 'tops-blusas',
    label: 'Tops & Blusas',
    department: 'boutique',
  },
  {
    slug: 'faldas-pantalones',
    label: 'Faldas & Pantalones',
    department: 'boutique',
  },
  {
    slug: 'maquillaje-labios-rostro',
    label: 'Maquillaje — Labios & Rostro',
    department: 'makeup',
  },
  {
    slug: 'maquillaje-ojos-paletas',
    label: 'Maquillaje — Ojos & Paletas',
    department: 'makeup',
  },
];

/**
 * AdminProductFormModal
 * Single Responsibility: Full editor for creating or modifying a Ropa or Makeup product,
 * including visibility control, COP pricing/accounting fields, colors/shades with image
 * upload per color/shade, sizes/formats, and the 3 inventory tracking modes.
 */
export const AdminProductFormModal: React.FC<AdminProductFormModalProps> = ({
  initialProduct,
  subcategories,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(initialProduct);

  const [department, setDepartment] = useState<'boutique' | 'makeup'>(
    initialProduct?.department ?? 'boutique'
  );
  const [category, setCategory] = useState<
    Exclude<ProductCategorySlug, 'all'>
  >(initialProduct?.category ?? 'vestidos-conjuntos');
  const [subcategoryId, setSubcategoryId] = useState<string>(
    initialProduct?.subcategoryId ?? ''
  );
  const [sku, setSku] = useState(initialProduct?.sku ?? '');
  const [name, setName] = useState(initialProduct?.name ?? '');
  const [subtitle, setSubtitle] = useState(initialProduct?.subtitle ?? '');
  const [price, setPrice] = useState<number>(initialProduct?.price ?? 145000);
  const [compareAtPrice, setCompareAtPrice] = useState<string>(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ''
  );
  const [costPriceCop, setCostPriceCop] = useState<number>(
    initialProduct?.costPriceCop ?? 60000
  );
  const [taxRatePct, setTaxRatePct] = useState<number>(
    initialProduct?.taxRatePct ?? 19
  );
  const [badge, setBadge] = useState<string>(initialProduct?.badge ?? 'NEW IN');
  const [isVisible, setIsVisible] = useState<boolean>(
    initialProduct ? initialProduct.isVisible !== false : true
  );
  const [featured, setFeatured] = useState<boolean>(
    Boolean(initialProduct?.featured)
  );
  const [description, setDescription] = useState(
    initialProduct?.description ?? ''
  );
  const [editorialNote, setEditorialNote] = useState(
    initialProduct?.editorialNote ?? ''
  );
  const [compositionOrIngredients, setCompositionOrIngredients] = useState(
    initialProduct?.compositionOrIngredients ?? ''
  );
  const [careOrHowToUse, setCareOrHowToUse] = useState(
    initialProduct?.careOrHowToUse ?? ''
  );

  const [inventoryMode, setInventoryMode] = useState<InventoryTrackingMode>(
    initialProduct?.inventoryMode ?? 'by_color_and_size'
  );

  const [colors, setColors] = useState<ProductColorVariant[]>(
    initialProduct?.colors?.length
      ? initialProduct.colors.map((c) => ({ ...c, images: [...c.images] }))
      : [
          {
            id: `clr-${Date.now()}`,
            name: 'Negro Obsidiana',
            hex: '#151515',
            finish: 'Satinado',
            images: [],
            stock: 6,
            inStock: true,
          },
        ]
  );

  const [sizes, setSizes] = useState<ProductSizeOption[]>(
    initialProduct?.sizes?.length
      ? initialProduct.sizes.map((s) => ({ ...s }))
      : department === 'boutique'
      ? [
          {
            label: 'XS',
            measurementsOrDetail: 'Busto 82-86 cm · Cintura 62-66 cm',
            inStock: true,
            stock: 4,
          },
          {
            label: 'S',
            measurementsOrDetail: 'Busto 86-90 cm · Cintura 66-70 cm',
            inStock: true,
            stock: 6,
          },
          {
            label: 'M',
            measurementsOrDetail: 'Busto 90-94 cm · Cintura 70-74 cm',
            inStock: true,
            stock: 5,
          },
          {
            label: 'L',
            measurementsOrDetail: 'Busto 94-99 cm · Cintura 74-79 cm',
            inStock: true,
            stock: 3,
          },
        ]
      : [
          {
            label: 'Full Size (15 ml)',
            measurementsOrDetail: 'Presentación estándar con aplicador',
            inStock: true,
            stock: 10,
          },
        ]
  );

  const [variantStockMatrix, setVariantStockMatrix] = useState<
    Record<string, number>
  >(() => {
    if (initialProduct?.variantStockMatrix) {
      return { ...initialProduct.variantStockMatrix };
    }
    const initial: Record<string, number> = {};
    for (const c of colors) {
      for (const s of sizes) {
        initial[VariantStockService.buildVariantKey(c.id, s.label)] =
          s.stock ?? 5;
      }
    }
    return initial;
  });

  const [newImageUrlsByColor, setNewImageUrlsByColor] = useState<
    Record<string, string>
  >({});
  const [uploadingColorId, setUploadingColorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDepartmentSwitch = (nextDept: 'boutique' | 'makeup') => {
    setDepartment(nextDept);
    setCategory(
      nextDept === 'boutique'
        ? 'vestidos-conjuntos'
        : 'maquillaje-labios-rostro'
    );
  };

  // Add a new color / shade
  const handleAddColor = () => {
    const newId = `clr-${Date.now()}-${colors.length + 1}`;
    const newColor: ProductColorVariant = {
      id: newId,
      name:
        department === 'makeup'
          ? `0${colors.length + 1} Nuevo Tono`
          : `Nuevo Color ${colors.length + 1}`,
      hex: department === 'makeup' ? '#c21863' : '#24170f',
      finish: department === 'makeup' ? 'Mate Terciopelo' : 'Seda Natural',
      images: [],
      stock: 5,
      inStock: true,
    };

    const nextColors = [...colors, newColor];
    setColors(nextColors);

    const nextMatrix = { ...variantStockMatrix };
    for (const s of sizes) {
      nextMatrix[VariantStockService.buildVariantKey(newId, s.label)] = 5;
    }
    setVariantStockMatrix(nextMatrix);
  };

  const handleRemoveColor = (colorId: string) => {
    if (colors.length <= 1) return;
    setColors((prev) => prev.filter((c) => c.id !== colorId));
  };

  const handleUploadImageForColor = async (colorId: string, file: File) => {
    setUploadingColorId(colorId);
    setErrorMessage(null);
    try {
      const uploadedUrl = await AdminApiService.uploadImageFile(file);
      setColors((prev) =>
        prev.map((c) =>
          c.id === colorId ? { ...c, images: [...c.images, uploadedUrl] } : c
        )
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al subir la imagen.'
      );
    } finally {
      setUploadingColorId(null);
    }
  };

  const handleAddImageUrlForColor = (colorId: string) => {
    const url = (newImageUrlsByColor[colorId] ?? '').trim();
    if (!url) return;
    setColors((prev) =>
      prev.map((c) =>
        c.id === colorId ? { ...c, images: [...c.images, url] } : c
      )
    );
    setNewImageUrlsByColor((prev) => ({ ...prev, [colorId]: '' }));
  };

  const handleRemoveImageFromColor = (colorId: string, imgIndex: number) => {
    setColors((prev) =>
      prev.map((c) =>
        c.id === colorId
          ? { ...c, images: c.images.filter((_, i) => i !== imgIndex) }
          : c
      )
    );
  };

  // Add a new size / presentation format
  const handleAddSize = () => {
    const defaultLabel =
      department === 'makeup'
        ? `Formato ${sizes.length + 1}`
        : `Talla ${sizes.length + 1}`;
    const nextSizes: ProductSizeOption[] = [
      ...sizes,
      {
        label: defaultLabel,
        measurementsOrDetail: 'Especificación estándar',
        inStock: true,
        stock: 5,
      },
    ];
    setSizes(nextSizes);

    const nextMatrix = { ...variantStockMatrix };
    for (const c of colors) {
      nextMatrix[VariantStockService.buildVariantKey(c.id, defaultLabel)] = 5;
    }
    setVariantStockMatrix(nextMatrix);
  };

  const handleRemoveSize = (idx: number) => {
    if (sizes.length <= 1) return;
    setSizes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMatrixCellChange = (
    colorId: string,
    sizeLabel: string,
    nextVal: number
  ) => {
    const key = VariantStockService.buildVariantKey(colorId, sizeLabel);
    setVariantStockMatrix((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.floor(nextVal)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const catDef = CATEGORY_OPTIONS.find((c) => c.slug === category);
      const ensuredColors = colors.map((c) => ({
        ...c,
        images:
          c.images.length > 0
            ? c.images
            : [
                'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1000&q=85',
              ],
      }));

      const payload: Partial<Product> = {
        sku: sku.trim().toUpperCase() || undefined,
        name: name.trim().toUpperCase(),
        subtitle: subtitle.trim(),
        department,
        category,
        categoryLabel: catDef?.label ?? category,
        subcategoryId: subcategoryId || undefined,
        price: Math.max(0, Number(price)),
        compareAtPrice: compareAtPrice.trim()
          ? Math.max(0, Number(compareAtPrice))
          : undefined,
        costPriceCop: Math.max(0, Number(costPriceCop)),
        taxRatePct: Math.max(0, Number(taxRatePct)),
        badge: badge
          ? (badge as Product['badge'])
          : undefined,
        isVisible,
        featured,
        description,
        editorialNote,
        compositionOrIngredients,
        careOrHowToUse,
        sizeTypeLabel:
          department === 'makeup' ? 'FORMATO / PRESENTACIÓN' : 'TALLA',
        colorTypeLabel: department === 'makeup' ? 'TONO / ACABADO' : 'COLOR',
        inventoryMode,
        colors: ensuredColors,
        sizes,
        variantStockMatrix,
      };

      if (isEditing && initialProduct) {
        await AdminApiService.updateProduct(initialProduct.id, payload);
      } else {
        await AdminApiService.createProduct(payload);
      }

      await onSaved();
      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al guardar el producto.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--color-warm-charcoal)',
    backgroundColor: 'var(--color-pure-white)',
    fontFamily: 'var(--font-gt-america-mono)',
    fontSize: '12px',
    color: 'var(--color-soft-black)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontFamily: 'var(--font-gt-america-mono)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'var(--color-soft-black)',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        backgroundColor: 'rgba(21, 21, 21, 0.72)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        padding: '28px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          backgroundColor: 'var(--color-pure-white)',
          border: '1px solid var(--color-warm-charcoal)',
          padding: 'clamp(20px, 3vw, 36px)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            marginBottom: '24px',
            borderBottom: '1px solid var(--color-warm-charcoal)',
          }}
        >
          <div>
            <span className="text-caption-editorial">
              ATELIER PRODUCT &amp; INVENTORY SPEC // SIGNED BACKEND
            </span>
            <h2 className="section-heading" style={{ fontSize: '20px' }}>
              {isEditing
                ? `EDITAR PRODUCTO: ${initialProduct?.name}`
                : 'CREAR NUEVO PRODUCTO (ROPA O MAKEUP)'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="pill-btn pill-btn--outline"
            style={{ padding: '8px 12px' }}
          >
            <X size={16} />
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: 'var(--color-warm-charcoal)',
              color: 'var(--color-pure-white)',
              padding: '12px 16px',
              marginBottom: '20px',
              fontFamily: 'var(--font-gt-america-mono)',
              fontSize: '11px',
            }}
          >
            ERROR: {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Datos Generales, Visibilidad y Departamento */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <label style={labelStyle}>DEPARTAMENTO *</label>
              <select
                value={department}
                onChange={(e) =>
                  handleDepartmentSwitch(
                    e.target.value as 'boutique' | 'makeup'
                  )
                }
                style={inputStyle}
              >
                <option value="boutique">ROPA (PRENDAS &amp; BOUTIQUE)</option>
                <option value="makeup">MAKEUP (MAQUILLAJE)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>CATEGORÍA BASE *</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as Exclude<ProductCategorySlug, 'all'>
                  )
                }
                style={inputStyle}
              >
                {CATEGORY_OPTIONS.filter(
                  (c) => c.department === department
                ).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>SUBCATEGORÍA</label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                style={inputStyle}
              >
                <option value="">— General —</option>
                {subcategories
                  .filter((s) => s.department === department)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>CÓDIGO SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej: LUM-VC-010"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <label style={labelStyle}>NOMBRE DEL PRODUCTO / PRENDA *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: VESTIDO MIDI SATÉN ÉCLAT / LIP OIL PÉPTIDOS"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>SUBTÍTULO / CORTE O ACABADO *</label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej: Corte al bies con espalda descubierta"
                style={inputStyle}
              />
            </div>
          </div>

          {/* 2. Precios en Pesos Colombianos (COP), Contabilidad y Visibilidad */}
          <div
            style={{
              backgroundColor: 'var(--color-ash-gray)',
              padding: '18px',
              marginBottom: '24px',
              border: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label style={labelStyle}>PRECIO DE VENTA (COP $) *</label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  PRECIO ANTERIOR TACHADO (COP $)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="Opcional (Ej: 220000)"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  COSTO UNITARIO CONTABLE (COP $)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={costPriceCop}
                  onChange={(e) => setCostPriceCop(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>IVA CONTABLE (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxRatePct}
                  onChange={(e) => setTaxRatePct(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>ETIQUETA / BADGE</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Sin etiqueta</option>
                  <option value="NEW IN">NEW IN (Recién Llegado)</option>
                  <option value="BESTSELLER">BESTSELLER (Más Vendido)</option>
                  <option value="LIMITED EDITION">LIMITED EDITION</option>
                  <option value="EDITORIAL PICK">EDITORIAL PICK</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-hairline)',
              }}
            >
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                />
                <span>
                  VISIBLE AL PÚBLICO EN LA WEB (Desmarcar para ocultar prenda o
                  producto)
                </span>
              </label>

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>DESTACAR EN TARJETAS DE LO MÁS VENDIDO (MEGA-MENÚ)</span>
              </label>
            </div>
          </div>

          {/* 3. Selección del Modo de Control de Stock / Agotado */}
          <div
            style={{
              marginBottom: '24px',
              padding: '18px',
              border: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <label style={{ ...labelStyle, marginBottom: '10px' }}>
              MODO DE CONTROL DE STOCK Y DETECCIÓN DE AGOTADO *
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {(
                [
                  {
                    mode: 'by_size',
                    title: '1. SOLO POR TALLA O TAMAÑO',
                    desc: 'Para prendas de un color por talla (XS, S, M, L) o maquillaje que varía solo por tamaño (Full Size / Mini).',
                  },
                  {
                    mode: 'by_color',
                    title: '2. SOLO POR TONO O COLOR',
                    desc: 'Ideal para maquillaje de único tamaño donde cada tono tiene su propio stock independiente.',
                  },
                  {
                    mode: 'by_color_and_size',
                    title: '3. COMBINADO (COLOR/TONO × TALLA/TAMAÑO)',
                    desc: 'Matriz completa: controla el stock exacto de cada combinación de color/tono y talla/presentación.',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => setInventoryMode(opt.mode)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    border:
                      inventoryMode === opt.mode
                        ? '2px solid var(--color-signal-blue)'
                        : '1px solid var(--color-warm-charcoal)',
                    backgroundColor:
                      inventoryMode === opt.mode
                        ? 'var(--color-warm-charcoal)'
                        : 'var(--color-pure-white)',
                    color:
                      inventoryMode === opt.mode
                        ? 'var(--color-pure-white)'
                        : 'var(--color-soft-black)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-gt-america-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginBottom: '4px',
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-gt-america-mono)',
                      fontSize: '10px',
                      opacity: 0.8,
                      lineHeight: 1.4,
                    }}
                  >
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Gestión de Colores / Tonos + Carga de Imágenes por Color/Tono */}
          <div
            style={{
              marginBottom: '24px',
              padding: '18px',
              border: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span style={labelStyle}>
                {department === 'makeup'
                  ? 'TONOS DEL MAQUILLAJE E IMÁGENES POR TONO'
                  : 'COLORES DE LA PRENDA E IMÁGENES POR COLOR'}
              </span>

              <button
                type="button"
                onClick={handleAddColor}
                className="pill-btn pill-btn--brand"
                style={{ padding: '6px 14px', fontSize: '10px' }}
              >
                <Plus size={12} />
                <span>
                  {department === 'makeup'
                    ? 'AGREGAR TONO'
                    : 'AGREGAR COLOR'}
                </span>
              </button>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {colors.map((color, colorIdx) => (
                <div
                  key={color.id}
                  style={{
                    border: '1px solid var(--border-hairline)',
                    padding: '14px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        inventoryMode === 'by_color'
                          ? '60px 1.2fr 1fr 120px auto'
                          : '60px 1.2fr 1fr auto',
                      gap: '12px',
                      alignItems: 'end',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <label style={labelStyle}>HEX</label>
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColors((prev) =>
                            prev.map((c, i) =>
                              i === colorIdx ? { ...c, hex: val } : c
                            )
                          );
                        }}
                        style={{
                          width: '100%',
                          height: '38px',
                          border: '1px solid var(--color-warm-charcoal)',
                          cursor: 'pointer',
                        }}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        {department === 'makeup'
                          ? 'NOMBRE DEL TONO *'
                          : 'NOMBRE DEL COLOR *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={color.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColors((prev) =>
                            prev.map((c, i) =>
                              i === colorIdx ? { ...c, name: val } : c
                            )
                          );
                        }}
                        placeholder="Ej: 01 Luméra Berry / Negro Obsidiana"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>ACABADO / TEXTURA</label>
                      <input
                        type="text"
                        value={color.finish ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColors((prev) =>
                            prev.map((c, i) =>
                              i === colorIdx ? { ...c, finish: val } : c
                            )
                          );
                        }}
                        placeholder="Ej: Brillo Espejo / Satén Seda"
                        style={inputStyle}
                      />
                    </div>

                    {inventoryMode === 'by_color' && (
                      <div>
                        <label style={labelStyle}>STOCK DE ESTE TONO</label>
                        <input
                          type="number"
                          min={0}
                          value={color.stock ?? 0}
                          onChange={(e) => {
                            const nextStock = Math.max(
                              0,
                              Number(e.target.value)
                            );
                            setColors((prev) =>
                              prev.map((c, i) =>
                                i === colorIdx
                                  ? {
                                      ...c,
                                      stock: nextStock,
                                      inStock: nextStock > 0,
                                    }
                                  : c
                              )
                            );
                          }}
                          style={inputStyle}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={colors.length <= 1}
                      onClick={() => handleRemoveColor(color.id)}
                      className="pill-btn pill-btn--outline"
                      style={{ padding: '9px 10px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Imágenes adjuntas a este Color / Tono */}
                  <div>
                    <label style={labelStyle}>
                      IMÁGENES ASOCIADAS A &quot;{color.name}&quot; (
                      {color.images.length})
                    </label>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      {color.images.map((imgUrl, imgIdx) => (
                        <div
                          key={`${color.id}-img-${imgIdx}`}
                          style={{
                            position: 'relative',
                            width: '72px',
                            height: '92px',
                            border: '1px solid var(--color-warm-charcoal)',
                            backgroundColor: 'var(--color-pure-white)',
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={color.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImageFromColor(color.id, imgIdx)
                            }
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              backgroundColor: 'var(--color-warm-charcoal)',
                              color: 'var(--color-pure-white)',
                              border: 'none',
                              width: 18,
                              height: 18,
                              fontSize: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      {/* Subir archivo desde el computador */}
                      <label
                        className="pill-btn pill-btn--brand"
                        style={{
                          padding: '8px 14px',
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={12} />
                        <span>
                          {uploadingColorId === color.id
                            ? 'SUBIENDO...'
                            : 'SUBIR ARCHIVO DE IMAGEN'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              void handleUploadImageForColor(color.id, file);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>

                      {/* O pegar URL de imagen */}
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          minWidth: '240px',
                          gap: '6px',
                        }}
                      >
                        <input
                          type="url"
                          value={newImageUrlsByColor[color.id] ?? ''}
                          onChange={(e) =>
                            setNewImageUrlsByColor((prev) => ({
                              ...prev,
                              [color.id]: e.target.value,
                            }))
                          }
                          placeholder="O pegar URL de imagen (https://...)"
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImageUrlForColor(color.id)}
                          className="pill-btn pill-btn--outline"
                          style={{ padding: '8px 12px', fontSize: '10px' }}
                        >
                          ADJUNTAR URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Tallas (Ropa) o Tamaños / Presentaciones (Makeup) */}
          <div
            style={{
              marginBottom: '24px',
              padding: '18px',
              border: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span style={labelStyle}>
                {department === 'makeup'
                  ? 'TAMAÑOS / FORMATOS DE PRESENTACIÓN'
                  : 'TALLAS DE LA PRENDA'}
              </span>

              <button
                type="button"
                onClick={handleAddSize}
                className="pill-btn pill-btn--brand"
                style={{ padding: '6px 14px', fontSize: '10px' }}
              >
                <Plus size={12} />
                <span>
                  {department === 'makeup'
                    ? 'AGREGAR TAMAÑO / FORMATO'
                    : 'AGREGAR TALLA'}
                </span>
              </button>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {sizes.map((sz, szIdx) => (
                <div
                  key={`size-row-${szIdx}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      inventoryMode === 'by_size'
                        ? '160px 1fr 130px auto'
                        : '160px 1fr auto',
                    gap: '10px',
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      {department === 'makeup' ? 'FORMATO *' : 'TALLA *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={sz.label}
                      onChange={(e) => {
                        const nextLabel = e.target.value;
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === szIdx ? { ...s, label: nextLabel } : s
                          )
                        );
                      }}
                      placeholder="Ej: XS, S, M / Full Size 15ml"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>MEDIDAS O ESPECIFICACIÓN</label>
                    <input
                      type="text"
                      value={sz.measurementsOrDetail}
                      onChange={(e) => {
                        const nextSpec = e.target.value;
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === szIdx
                              ? { ...s, measurementsOrDetail: nextSpec }
                              : s
                          )
                        );
                      }}
                      placeholder="Ej: Busto 86-90cm · Cintura 66-70cm"
                      style={inputStyle}
                    />
                  </div>

                  {inventoryMode === 'by_size' && (
                    <div>
                      <label style={labelStyle}>STOCK (UNIDADES)</label>
                      <input
                        type="number"
                        min={0}
                        value={sz.stock ?? 0}
                        onChange={(e) => {
                          const nextStock = Math.max(
                            0,
                            Number(e.target.value)
                          );
                          setSizes((prev) =>
                            prev.map((s, i) =>
                              i === szIdx
                                ? {
                                    ...s,
                                    stock: nextStock,
                                    inStock: nextStock > 0,
                                  }
                                : s
                            )
                          );
                        }}
                        style={inputStyle}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={sizes.length <= 1}
                    onClick={() => handleRemoveSize(szIdx)}
                    className="pill-btn pill-btn--outline"
                    style={{ padding: '9px 10px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Matriz de Stock Combinado (Color/Tono x Talla/Tamaño) */}
          {inventoryMode === 'by_color_and_size' && (
            <div
              style={{
                marginBottom: '24px',
                padding: '18px',
                border: '1px solid var(--color-warm-charcoal)',
                backgroundColor: 'var(--color-ash-gray)',
                overflowX: 'auto',
              }}
            >
              <label style={{ ...labelStyle, marginBottom: '10px' }}>
                MATRIZ DE UNIDADES EN STOCK POR (COLOR/TONO × TALLA/TAMAÑO) — 0
                UNIDADES = AGOTADO AUTOMÁTICO
              </label>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: 'var(--color-pure-white)',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '11px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--color-warm-charcoal)',
                      color: 'var(--color-pure-white)',
                    }}
                  >
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>
                      COLOR / TONO
                    </th>
                    {sizes.map((sz) => (
                      <th
                        key={sz.label}
                        style={{ padding: '10px 12px', textAlign: 'center' }}
                      >
                        {sz.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colors.map((clr) => (
                    <tr
                      key={clr.id}
                      style={{
                        borderBottom: '1px solid var(--border-hairline)',
                      }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                            backgroundColor: clr.hex,
                            border: '1px solid #ccc',
                            marginRight: 8,
                            verticalAlign: 'middle',
                          }}
                        />
                        {clr.name}
                      </td>
                      {sizes.map((sz) => {
                        const key = VariantStockService.buildVariantKey(
                          clr.id,
                          sz.label
                        );
                        const val = variantStockMatrix[key] ?? 0;
                        return (
                          <td
                            key={key}
                            style={{ padding: '8px', textAlign: 'center' }}
                          >
                            <input
                              type="number"
                              min={0}
                              value={val}
                              onChange={(e) =>
                                handleMatrixCellChange(
                                  clr.id,
                                  sz.label,
                                  Number(e.target.value)
                                )
                              }
                              style={{
                                width: '74px',
                                padding: '6px 8px',
                                textAlign: 'center',
                                border:
                                  val === 0
                                    ? '1px solid #b91c1c'
                                    : '1px solid var(--color-warm-charcoal)',
                                backgroundColor:
                                  val === 0 ? '#fef2f2' : '#ffffff',
                                fontFamily: 'var(--font-gt-america-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            />
                            <div
                              style={{
                                fontSize: '9px',
                                marginTop: '2px',
                                opacity: 0.7,
                              }}
                            >
                              {val === 0 ? 'AGOTADO' : `${val} UDS.`}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. Descripción, Nota Editorial y Composición */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <label style={labelStyle}>DESCRIPCIÓN DEL PRODUCTO</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>NOTA EDITORIAL ATELIER</label>
              <textarea
                rows={3}
                value={editorialNote}
                onChange={(e) => setEditorialNote(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                {department === 'makeup'
                  ? 'INGREDIENTES ACTIVOS / FÓRMULA'
                  : 'COMPOSICIÓN TEXTIL'}
              </label>
              <textarea
                rows={2}
                value={compositionOrIngredients}
                onChange={(e) => setCompositionOrIngredients(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                {department === 'makeup'
                  ? 'MODO DE APLICACIÓN'
                  : 'CUIDADO DE LA PRENDA'}
              </label>
              <textarea
                rows={2}
                value={careOrHowToUse}
                onChange={(e) => setCareOrHowToUse(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-warm-charcoal)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="pill-btn pill-btn--outline"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="pill-btn pill-btn--brand"
            >
              {isSubmitting
                ? 'FIRMANDO Y GUARDANDO EN BACKEND...'
                : isEditing
                ? 'GUARDAR CAMBIOS'
                : 'PUBLICAR PRODUCTO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
