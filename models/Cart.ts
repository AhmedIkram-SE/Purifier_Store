export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageURL: string
  stock: number
}

export interface Cart {
  _id?: string
  userId: string
  items: CartItem[]
  updatedAt?: Date
}
