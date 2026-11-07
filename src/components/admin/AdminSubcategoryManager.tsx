import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { AdminApiService } from '../../services/admin-api.service';
import {
  ProductCategorySlug,
  SubcategoryDefinition,
} from '../../types/product.types';

interface AdminSubcategoryManagerProps {
  subcategories: SubcategoryDefinition[];
  onRefresh: () => Promise<void>;
}

const BASE_CATEGORIES: Array<{
  slug: Exclude<ProductCategorySlug, 'all'>;
  label: string;
  department: 'boutique' | 'makeup';
}> = [
  {
    slug: 'vestidos-conjuntos',
    label: 'Ropa — Vestidos & Conjuntos',
    department: 'boutique',
  },
  {
    slug: 'tops-blusas',
    label: 'Ropa — Tops & Blusas',
    department: 'boutique',
  },
  {
    slug: 'faldas-pantalones',
    label: 'Ropa — Faldas & Pantalones',
    department: 'boutique',
  },
  {
    slug: 'maquillaje-labios-rostro',
    label: 'Makeup — Labios & Rostro',
    department: 'makeup',
  },
  {
    slug: 'maquillaje-ojos-paletas',
    label: 'Makeup — Ojos & Paletas',
    department: 'makeup',
  },
];

/**
 * AdminSubcategoryManager
 * Single Responsibility: Manages subcategories for Ropa and Makeup in the admin console.
 */
export const AdminSubcategoryManager: React.FC<
  AdminSubcategoryManagerProps
> = ({ subcategories, onRefresh }) => {
  const [label, setLabel] = useState('');
  const [department, setDepartment] = useState<'boutique' | 'makeup'>(
    'boutique'
  );
  const [category, setCategory] = useState<
    Exclude<ProductCategorySlug, 'all'>
  >('vestidos-conjuntos');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showInNewArrivals, setShowInNewArrivals] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDepartmentChange = (nextDept: 'boutique' | 'makeup') => {
    setDepartment(nextDept);
    setCategory(
      nextDept === 'boutique'
        ? 'vestidos-conjuntos'
        : 'maquillaje-labios-rostro'
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await AdminApiService.createSubcategory({
        label: label.trim().toUpperCase(),
        department,
        category,
        searchKeyword: searchKeyword.trim(),
        showInNewArrivals,
        isVisible: true,
        sortOrder: subcategories.length + 1,
      });
      setLabel('');
      setSearchKeyword('');
      await onRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al crear subcategoría.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (sub: SubcategoryDefinition) => {
    try {
      await AdminApiService.updateSubcategory(sub.id, {
        isVisible: !sub.isVisible,
      });
      await onRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al actualizar visibilidad.'
      );
    }
  };

  const handleToggleNewArrivals = async (sub: SubcategoryDefinition) => {
    try {
      await AdminApiService.updateSubcategory(sub.id, {
        showInNewArrivals: !sub.showInNewArrivals,
      });
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await AdminApiService.deleteSubcategory(id);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar.');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {error && (
        <div
          style={{
            backgroundColor: 'var(--color-warm-charcoal)',
            color: 'var(--color-pure-white)',
            padding: '12px 16px',
            fontFamily: 'var(--font-gt-america-mono)',
            fontSize: '11px',
          }}
        >
          ERROR: {error}
        </div>
      )}

      {/* Create Subcategory Form */}
      <form
        onSubmit={handleCreate}
        style={{
          backgroundColor: 'var(--color-pure-white)',
          border: '1px solid var(--color-warm-charcoal)',
          padding: '24px',
        }}
      >
        <h3
          className="text-caption-editorial"
          style={{
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--color-soft-black)',
          }}
        >
          + AGREGAR NUEVA SUBCATEGORÍA AL NAVBAR Y CATÁLOGO
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          <div>
            <label
              className="text-caption-editorial"
              style={{ display: 'block', marginBottom: '6px' }}
            >
              NOMBRE DE SUBCATEGORÍA *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: VESTIDOS DE GALA / DELINEADORES"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className="text-caption-editorial"
              style={{ display: 'block', marginBottom: '6px' }}
            >
              SECCIÓN DEL NAVBAR *
            </label>
            <select
              value={department}
              onChange={(e) =>
                handleDepartmentChange(e.target.value as 'boutique' | 'makeup')
              }
              style={inputStyle}
            >
              <option value="boutique">ROPA (BOUTIQUE)</option>
              <option value="makeup">MAKEUP (MAQUILLAJE)</option>
            </select>
          </div>

          <div>
            <label
              className="text-caption-editorial"
              style={{ display: 'block', marginBottom: '6px' }}
            >
              CATEGORÍA BASE *
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as Exclude<ProductCategorySlug, 'all'>
                )
              }
              style={inputStyle}
            >
              {BASE_CATEGORIES.filter((c) => c.department === department).map(
                (c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              className="text-caption-editorial"
              style={{ display: 'block', marginBottom: '6px' }}
            >
              PALABRA CLAVE DE FILTRO (OPCIONAL)
            </label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Ej: Satén, Lino, Lip Oil"
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '18px',
            paddingTop: '16px',
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
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={showInNewArrivals}
              onChange={(e) => setShowInNewArrivals(e.target.checked)}
            />
            <span>MOSTRAR TAMBIÉN EN MENÚ &quot;RECIÉN LLEGADO&quot;</span>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="pill-btn pill-btn--brand"
            style={{ padding: '10px 20px', fontSize: '11px' }}
          >
            <Plus size={14} />
            <span>
              {isSaving ? 'GUARDANDO...' : 'CREAR SUBCATEGORÍA FIRMADA'}
            </span>
          </button>
        </div>
      </form>

      {/* Subcategories Table */}
      <div
        style={{
          backgroundColor: 'var(--color-pure-white)',
          border: '1px solid var(--color-warm-charcoal)',
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-gt-america-mono)',
            fontSize: '11px',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--color-warm-charcoal)',
                color: 'var(--color-pure-white)',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '12px 16px' }}>SUBCATEGORÍA</th>
              <th style={{ padding: '12px 16px' }}>SECCIÓN NAVBAR</th>
              <th style={{ padding: '12px 16px' }}>CATEGORÍA BASE</th>
              <th style={{ padding: '12px 16px' }}>FILTRO CLAVE</th>
              <th style={{ padding: '12px 16px' }}>EN RECIÉN LLEGADO</th>
              <th style={{ padding: '12px 16px' }}>VISIBILIDAD</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => (
              <tr
                key={sub.id}
                style={{
                  borderBottom: '1px solid var(--border-hairline)',
                  opacity: sub.isVisible ? 1 : 0.5,
                }}
              >
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                  {sub.label}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {sub.department === 'boutique' ? 'ROPA' : 'MAKEUP'}
                </td>
                <td style={{ padding: '12px 16px' }}>{sub.category}</td>
                <td style={{ padding: '12px 16px' }}>
                  {sub.searchKeyword || '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleNewArrivals(sub)}
                    className="pill-btn pill-btn--outline"
                    style={{ padding: '4px 10px', fontSize: '10px' }}
                  >
                    {sub.showInNewArrivals ? 'SÍ (ACTIVO)' : 'NO'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(sub)}
                    className={`pill-btn ${
                      sub.isVisible ? 'pill-btn--brand' : 'pill-btn--outline'
                    }`}
                    style={{ padding: '4px 10px', fontSize: '10px' }}
                  >
                    {sub.isVisible ? (
                      <>
                        <Eye size={12} />
                        <span>VISIBLE</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} />
                        <span>OCULTA</span>
                      </>
                    )}
                  </button>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(sub.id)}
                    title="Eliminar subcategoría"
                    className="pill-btn pill-btn--outline"
                    style={{ padding: '6px 10px', fontSize: '10px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
