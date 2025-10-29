"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"

interface WishlistState {
  products: string[] // Array of product IDs
  loading: boolean
}

type WishlistAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_WISHLIST"; payload: string[] }
  | { type: "ADD_PRODUCT"; payload: string }
  | { type: "REMOVE_PRODUCT"; payload: string }

interface WishlistContextType extends WishlistState {
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "LOAD_WISHLIST":
      return { products: action.payload, loading: false }
    case "ADD_PRODUCT":
      return {
        ...state,
        products: state.products.includes(action.payload) ? state.products : [...state.products, action.payload],
      }
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((id) => id !== action.payload),
      }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    products: [],
    loading: true,
  })

  const { isAuthenticated } = useAuth()
  const initializedRef = useRef(false)

  // Load wishlist from server when authenticated
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/wishlist", { cache: "no-store" })
          if (res.ok) {
            const data = await res.json()
            dispatch({ type: "LOAD_WISHLIST", payload: data.products ?? [] })
          } else {
            dispatch({ type: "LOAD_WISHLIST", payload: [] })
          }
        } catch {
          dispatch({ type: "LOAD_WISHLIST", payload: [] })
        }
      } else {
        dispatch({ type: "LOAD_WISHLIST", payload: [] })
      }
      initializedRef.current = true
    }
    load()
  }, [isAuthenticated])

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      return false
    }

    try {
      dispatch({ type: "ADD_PRODUCT", payload: productId })
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (res.ok) {
        return true
      } else {
        dispatch({ type: "REMOVE_PRODUCT", payload: productId })
        return false
      }
    } catch {
      dispatch({ type: "REMOVE_PRODUCT", payload: productId })
      return false
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      return false
    }

    try {
      dispatch({ type: "REMOVE_PRODUCT", payload: productId })
      const res = await fetch("/api/wishlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (res.ok) {
        return true
      } else {
        dispatch({ type: "ADD_PRODUCT", payload: productId })
        return false
      }
    } catch {
      dispatch({ type: "ADD_PRODUCT", payload: productId })
      return false
    }
  }

  const isInWishlist = (productId: string) => {
    return state.products.includes(productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
