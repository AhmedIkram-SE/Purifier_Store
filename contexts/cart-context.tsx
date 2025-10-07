"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import type { CartItem } from "@/models/Order"
import { useAuth } from "@/contexts/auth-context"

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.stock) }
            : item,
        )
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      } else {
        const updatedItems = [...state.items, action.payload]
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.productId !== action.payload)
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.productId })
      }

      const updatedItems = state.items.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, quantity: Math.min(action.payload.quantity, item.stock) }
          : item,
      )
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }

    case "LOAD_CART": {
      return {
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })

  const { isAuthenticated } = useAuth()
  const initializedRef = useRef(false)

  // Load cart: from server if authenticated, otherwise from localStorage
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/cart", { cache: "no-store" })
          if (res.ok) {
            const data = await res.json()
            dispatch({ type: "LOAD_CART", payload: data.items ?? [] })
          } else {
            dispatch({ type: "LOAD_CART", payload: [] })
          }
        } catch {
          dispatch({ type: "LOAD_CART", payload: [] })
        }
      } else {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart)
            dispatch({ type: "LOAD_CART", payload: cartItems })
          } catch {
            dispatch({ type: "LOAD_CART", payload: [] })
          }
        } else {
          dispatch({ type: "LOAD_CART", payload: [] })
        }
      }
      initializedRef.current = true
    }
    load()
    // Clear guest local cart when transitioning to authenticated
    if (isAuthenticated) {
      localStorage.removeItem("cart")
    }
  }, [isAuthenticated])

  // Persist cart changes: to server for authenticated users; to localStorage for guests
  useEffect(() => {
    if (!initializedRef.current) return

    const persist = async () => {
      if (isAuthenticated) {
        try {
          await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: state.items }),
          })
        } catch (e) {
          console.error("[v0] Failed to persist cart to server", e)
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    }
    persist()
  }, [state.items, isAuthenticated])

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
