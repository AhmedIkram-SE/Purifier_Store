export interface ContactQuery {
  _id?: string
  name: string
  email: string
  phone: string
  query: string
  status: "new" | "in-progress" | "resolved"
  createdAt?: Date
  updatedAt?: Date
}
