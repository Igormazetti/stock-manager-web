import { Client } from "./client";

export interface SaleProduct {
  id: string;
  product_id: string;
  sale_id: string;
  quantity_sold: number;
  productSaleValue?: number;
  Product: {
    id: string;
    title: string;
    code?: string;
    value: number;
    description: string;
    quantity: number;
    companyId: string;
    imgUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Sale {
  id: string;
  client: string;
  clientId?: string;
  Client?: Client;
  company_id: string;
  createdAt: string;
  totalValue: number;
  Products: SaleProduct[];
  discount?: number;
  observation?: string;
}

export interface SaleRequestData {
  data: {
    sales: Sale[];
    pages: number;
    status: number;
    statusText: string;
  };
}
