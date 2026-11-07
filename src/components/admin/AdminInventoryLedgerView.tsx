import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CurrencyService } from '../../services/currency.service';
import { InventoryLedgerEntry } from '../../types/admin.types';

interface AdminInventoryLedgerViewProps {
  ledger: InventoryLedgerEntry[];
}

/**
 * AdminInventoryLedgerView
 * Single Responsibility: Renders the immutable, cryptographically signed inventory
 * and accounting ledger (Kardex) for auditing stock movements, costs, and prices.
 */
export const AdminInventoryLedgerView: React.FC<
  AdminInventoryLedgerViewProps
> = ({ ledger }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-pure-white)',
        border: '1px solid var(--color-warm-charcoal)',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-warm-charcoal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <span className="text-caption-editorial" style={{ fontWeight: 700 }}>
            KARDEX CONTABLE DE INVENTARIO // HMAC-SHA256 AUDIT LEDGER
          </span>
          <p
            className="text-caption-editorial"
            style={{ opacity: 0.7, marginTop: '4px' }}
          >
            Base auditable preparada para conciliación de pasarela de pagos y
            contabilidad.
          </p>
        </div>

        <span
          className="badge-signal-blue"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
        >
          <ShieldCheck size={12} />
          <span>{ledger.length} REGISTROS FIRMADOS</span>
        </span>
      </div>

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
            <th style={{ padding: '12px 14px' }}>FECHA / HORA</th>
            <th style={{ padding: '12px 14px' }}>SKU / PRODUCTO</th>
            <th style={{ padding: '12px 14px' }}>VARIANTE</th>
            <th style={{ padding: '12px 14px' }}>MOVIMIENTO STOCK</th>
            <th style={{ padding: '12px 14px' }}>COSTO UNIT. (COP)</th>
            <th style={{ padding: '12px 14px' }}>PRECIO VENTA (COP)</th>
            <th style={{ padding: '12px 14px' }}>RESPONSABLE</th>
            <th style={{ padding: '12px 14px' }}>FIRMA HMAC</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((entry) => (
            <tr
              key={entry.id}
              style={{ borderBottom: '1px solid var(--border-hairline)' }}
            >
              <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                {new Date(entry.createdAt).toLocaleString('es-CO')}
              </td>
              <td style={{ padding: '10px 14px' }}>
                <strong>{entry.sku}</strong> — {entry.productName}
              </td>
              <td style={{ padding: '10px 14px' }}>{entry.variantKey}</td>
              <td style={{ padding: '10px 14px', fontWeight: 700 }}>
                {entry.previousStock} → {entry.newStock} (
                {entry.delta >= 0 ? `+${entry.delta}` : entry.delta})
              </td>
              <td style={{ padding: '10px 14px' }}>
                {CurrencyService.formatCOP(entry.unitCostCop)}
              </td>
              <td style={{ padding: '10px 14px' }}>
                {CurrencyService.formatCOP(entry.unitPriceCop)}
              </td>
              <td style={{ padding: '10px 14px' }}>{entry.actorEmail}</td>
              <td
                style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-gt-america-mono)',
                  fontSize: '10px',
                  opacity: 0.7,
                }}
              >
                {entry.signature.slice(0, 14)}...
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
