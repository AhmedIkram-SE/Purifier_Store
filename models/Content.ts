export interface Content {
  _id?: string
  type: "about" | "contact"
  title: string
  description: string
  sections?: {
    heading: string
    content: string
  }[]
  contactInfo?: {
    phone: string
    email: string
    address: string
  }
  createdAt?: Date
  updatedAt?: Date
}
