export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  observations: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientRequestData {
  data: {
    clients: Client[];
    status: number;
    statusText: string;
    pages: number;
  };
}
