export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  available: boolean;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  pickupOrDelivery: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  userId?: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  notes?: string;
  createdAt?: string;
}

export interface Upload {
  id: string;
  url: string;
  filename: string;
  contentType: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
