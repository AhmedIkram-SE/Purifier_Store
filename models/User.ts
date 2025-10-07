export interface User {
  _id?: string
  name: string
  email: string
  password: string // hashed
  role: "customer" | "admin"
  billingInfo?: {
    cardNumber?: string // encrypted/tokenized in production
    expiryDate?: string
    cardholderName?: string
    billingAddress?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface UserRegistration {
  name: string
  email: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}
