export interface Product {
  id: string;
  title: string;
  code?: string;
  value: number;
  originalValue: number;
  description: string;
  quantity: number;
  companyId: string;
  imgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRequestData {
  data: {
    products: Product[];
    status: number;
    statusText: string;
    pages: number;
  };
}
