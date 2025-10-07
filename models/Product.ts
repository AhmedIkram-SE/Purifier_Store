export interface Product {
  _id?: string
  name: string
  category: "water-purifier" | "air-purifier"
  description: string
  price: number
  stock: number
  imageURL: string
  specifications: {
    [key: string]: string
  }
  features: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}
