export interface Product {
  id: string;
  name: string;
  price: string;
  region: string;
  description: string;
}

export interface PurchaseWithProduct {
  id: string;
  quantity: number;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  Product: Product;
}

export interface ProductListProps {
  showPurchased: boolean;
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  userEmail: string;
  onPurchaseComplete: (newBalance: number) => void;
} 