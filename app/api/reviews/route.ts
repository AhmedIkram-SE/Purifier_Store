import { type NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import type { Review } from "@/models/Review";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    // Fetch latest reviews for the product
    const reviews = await db
      .collection("reviews")
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    // Validate input
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "productId, rating, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    // Check if user has a delivered order for this product
    const deliveredOrder = await db.collection("orders").findOne({
      userId: decoded.userId,
      status: "delivered",
      "items.productId": productId,
    });

    if (!deliveredOrder) {
      return NextResponse.json(
        { error: "You can only review products you have ordered and received" },
        { status: 403 }
      );
    }

    // Get user name
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await db.collection("reviews").findOne({
      productId,
      userId: decoded.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create review
    const newReview: Omit<Review, "_id"> = {
      productId,
      userId: decoded.userId,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(newReview);

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
