export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  ProductId: string;
  CustomerId: string;
  quantity: number;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  Product?: Product;
} 