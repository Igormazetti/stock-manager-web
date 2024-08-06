export interface Product {
  id: string;
  title: string;
  value: number;
  description: string;
  quantity: number;
  companyId: string;
  imgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRequestData {
  data: Product[];
  status: number;
  statusText: string;
}
