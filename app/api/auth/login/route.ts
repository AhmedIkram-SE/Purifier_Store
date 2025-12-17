import { type NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { verifyPassword, generateToken } from "@/lib/auth";
import type { UserLogin } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password }: UserLogin = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db("purifier_store");

    // Find user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const userForToken = {
      ...user,
      _id: user._id.toString(),
    };
    const token = generateToken(userForToken);

    // Create response with token in cookie AND in JSON body
    const response = NextResponse.json({
      message: "Login successful",
      token: token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
