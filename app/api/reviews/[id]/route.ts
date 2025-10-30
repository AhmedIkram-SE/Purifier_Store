import { type NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { rating, comment } = await request.json();

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json(
        { error: "rating and comment are required" },
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

    // Check if review exists and belongs to user
    const review = await db.collection("reviews").findOne({
      _id: new ObjectId(id),
      userId: decoded.userId,
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update review and return the updated document
    const result = await db.collection("reviews").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          rating,
          comment,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Return the updated review with _id as string
    const updatedReview = {
      ...result,
      _id: result._id.toString(),
    };

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
