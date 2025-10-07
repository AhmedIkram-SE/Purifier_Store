import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { User } from "@/models/User"

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
  }
  return secret
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  const JWT_SECRET = getJWTSecret()
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): any {
  try {
    const JWT_SECRET = getJWTSecret()
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
