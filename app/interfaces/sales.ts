export interface Sale {
  id: string;
  client: string;
  company_id: string;
  createdAt: string;
  totalValue: number;
  Products: [
    {
      id: string;
      product_id: string;
      sale_id: string;
      quantity_sold: number;
      Product: {
        id: string;
        title: string;
        value: number;
        description: string;
        quantity: number;
        companyId: string;
        imgUrl: string | null;
        createdAt: string;
        updatedAt: string;
      };
    },
  ];
}

export interface SaleRequestData {
  data: {
    sales: Sale[];
    pages: number;
    status: number;
    statusText: string;
  };
}
