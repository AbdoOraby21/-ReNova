
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ScrapType {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
}

export type RequestStatus = 'جديد' | 'تم التواصل' | 'جاري التفاوض' | 'مقبول' | 'مكتمل' | 'مرفوض';
export type PurchaseStatus = 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'مكتمل' | 'ملغي';

export interface ScrapRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  scrapType: string;
  askingPrice: number;
  description: string;
  address: string;
  image?: string;
  status: RequestStatus;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PurchaseOrder {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: PurchaseStatus;
  createdAt: string;
  paymentMethod: 'الدفع عند الاستلام';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
