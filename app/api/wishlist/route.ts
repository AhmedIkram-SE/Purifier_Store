import { type NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    const wishlist = await db.collection("wishlists").findOne({
      userId: decoded.userId,
    });

    return NextResponse.json({
      products: wishlist?.products || [],
    });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    // Find or create wishlist
    const wishlist = await db.collection("wishlists").findOneAndUpdate(
      { userId: decoded.userId },
      {
        $addToSet: { products: productId }, // Add product if not already present
        $set: { updatedAt: new Date() },
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({
      message: "Product added to wishlist",
      products: wishlist?.value?.products || [productId],
    });
  } catch (error) {
    console.error("Wishlist add error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    // Remove product from wishlist
    const wishlist = await db.collection("wishlists").findOneAndUpdate(
      { userId: decoded.userId },
      {
        $pull: { products: productId },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      message: "Product removed from wishlist",
      products: wishlist?.value?.products || [],
    });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
