import { type NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { Wishlist } from "@/models/Wishlist";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { productId } = await params;

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    const wishlist = await db
      .collection<Wishlist>("wishlists")
      .findOneAndUpdate(
        { userId: decoded.userId },
        {
          $pull: { products: productId } as any,
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    return NextResponse.json({
      message: "Product removed from wishlist",
      products: wishlist?.products || [],
    });
  } catch (error) {
    console.error("Wishlist delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
