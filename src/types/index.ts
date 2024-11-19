export interface Product {
  id: string;
  name: string;
  brand: string;
  purchasePrice: number;
  purchaseDate: string;
  imageUrl: string;
  status: 'in_stock' | 'sold';
  salePrice?: number;
  saleDate?: string;
  category: 'sneakers' | 'clothing' | 'objects' | 'tickets';
  description?: string;
}

export interface Order {
  id: string;
  name: string;
  brand: string;
  purchasePrice: number;
  purchaseDate: string;
  imageUrl: string;
  category: 'sneakers' | 'clothing' | 'objects' | 'tickets';
  description?: string;
  status: 'pending' | 'ordered';
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
}