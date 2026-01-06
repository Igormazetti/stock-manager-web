"use client";
import React from "react";
import { Sale } from "@/app/interfaces/sales";
import { formatDate } from "@/app/utils/dateFormatter";

interface SalePrintReceiptProps {
  sale: Sale;
  companyName: string;
}

export const SalePrintReceipt = React.forwardRef<HTMLDivElement, SalePrintReceiptProps>(
  ({ sale, companyName }, ref) => {
    const clientName = sale.Client?.name || sale.client;

    console.log(sale)

    return (
      <div ref={ref} className="print-receipt">
        {/* Header - Company Name */}
        <h1 className="company-name">{companyName}</h1>

        {/* Client Info and Sale Date Card */}
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Cliente:</span>
            <span className="info-value">{clientName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Data:</span>
            <span className="info-value">{formatDate(sale.createdAt)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Pedido:</span>
            <span className="info-value">{sale.id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Products Table */}
        <table className="products-table">
          <thead>
            <tr>
              <th>Qtd</th>
              <th>Discriminação das Mercadorias</th>
              <th>Preço Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.Products && sale.Products.length > 0 ? (
              sale.Products.map((saleProduct) => {
                const salePrice = saleProduct.productSaleValue;
                const total = salePrice * saleProduct.quantity_sold;

                return (
                  <tr key={saleProduct.id}>
                    <td className="text-center">{saleProduct.quantity_sold}</td>
                    <td>{saleProduct.Product.title}</td>
                    <td className="text-right">R$ {salePrice.toFixed(2)}</td>
                    <td className="text-right">R$ {total.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  Nenhum produto
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Section */}
        <div className="total-section">
          <span className="total-label">TOTAL R$</span>
          <span className="total-value">R$ {sale.totalValue.toFixed(2)}</span>
        </div>

        {/* Observation if exists */}
        {sale.observation && (
          <div className="observation-section">
            <strong>Observação:</strong>
            <p>{sale.observation}</p>
          </div>
        )}

        <style jsx>{`
          .print-receipt {
            width: 148mm; /* Half of A4 width (210mm / √2 ≈ 148mm) */
            height: 210mm; /* A4 height */
            padding: 15mm;
            background: white;
            font-family: Arial, sans-serif;
            color: #000;
            box-sizing: border-box;
          }

          .company-name {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
            text-transform: uppercase;
          }

          .info-card {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 15px;
            background: #f9f9f9;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
          }

          .info-row:last-child {
            margin-bottom: 0;
          }

          .info-label {
            font-weight: bold;
          }

          .info-value {
            text-align: right;
          }

          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 11px;
          }

          .products-table th {
            background: #000;
            color: #fff;
            padding: 8px 5px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            border: 1px solid #000;
          }

          .products-table td {
            padding: 6px 5px;
            border: 1px solid #000;
          }

          .products-table tbody tr:nth-child(even) {
            background: #f5f5f5;
          }

          .text-center {
            text-align: center;
          }

          .text-right {
            text-align: right;
          }

          .total-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            background: #000;
            color: #fff;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .total-label {
            font-size: 16px;
          }

          .total-value {
            font-size: 20px;
          }

          .observation-section {
            border: 1px solid #000;
            padding: 10px;
            font-size: 11px;
            margin-top: 15px;
          }

          .observation-section strong {
            display: block;
            margin-bottom: 5px;
          }

          .observation-section p {
            margin: 0;
            line-height: 1.4;
          }

          @media print {
            .print-receipt {
              width: 148mm;
              height: 210mm;
              padding: 10mm;
              page-break-after: always;
            }

            @page {
              size: 148mm 210mm;
              margin: 0;
            }
          }
        `}</style>
      </div>
    );
  }
);

SalePrintReceipt.displayName = "SalePrintReceipt";
