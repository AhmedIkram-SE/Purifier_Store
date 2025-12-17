export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

export interface Order {
  _id?: string;
  userId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentIntentId?: string;
  paymentStatus?: "pending" | "succeeded" | "failed" | "canceled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
  stock: number;
}
