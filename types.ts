export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  shippingAddress?: string;
  dob?: string;
  gotra?: string;
  rating?: number;
  comments?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

export enum BookingStatus {
  PendingPayment = "Pending Payment",
  Paid = "Paid",
  Delivered = "Delivered",
}

export interface Booking {
  id: string;
  customer: Customer | "self";
  items: CartItem[];
  total: number;
  status: BookingStatus;
  createdAt: Date;
  paymentLink?: string;
}

export interface Astrologer {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id?: string;
  name: string;
  category: "Perfume" | "Gift";
  brand: string;
  type?: string;
  size?: string;
  use?: string;
  tags: string[];
  occasion: string[];
  recipient: "Him" | "Her" | "Them" | "Anyone";
  price: number;
  story: string;
  imageUrl: string;
  affiliateLink: string;
  reviews: Review[];
}

export type MessageAuthor = "user" | "ai";

export interface ComparisonTableData {
  headers: string[];
  rows: string[][];
}

export interface Message {
  author: MessageAuthor;
  text: string;
  products?: Product[];
  comparisonTable?: ComparisonTableData;
}

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Paid";

export interface Review {
  authorName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  customer: CheckoutCustomer;
  product: Product;
  paymentId: string;
  date: string;
  status: OrderStatus;
  trackingNumber?: string;
  isReviewed?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  wishlist: Product[];
}
