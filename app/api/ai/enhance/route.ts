import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Validate API key is set
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Get client IP for rate limiting
    const clientId =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    // Check rate limit (5 requests per minute)
    if (!checkRateLimit(clientId, 5, 60000)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { title, category, description, type } = body;

    // Validate required fields
    if (!title || !category || !description || !type) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, category, description, type",
        },
        { status: 400 }
      );
    }

    // Validate type is either 'description' or 'keywords'
    if (!["description", "keywords"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be either 'description' or 'keywords'" },
        { status: 400 }
      );
    }

    // Use gemini-1.5-flash for faster, cheaper responses
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    if (type === "description") {
      prompt = `You are an expert product copywriter specializing in e-commerce optimization. 
      
Your task is to enhance and optimize a product description for SEO and conversion.

Product Details:
- Title: ${title}
- Category: ${category}
- Current Description: ${description}

Please provide an enhanced product description that:
1. Is 150-200 words
2. Includes relevant SEO keywords naturally
3. Highlights key benefits and features
4. Uses compelling, persuasive language
5. Maintains a professional and informative tone
6. Includes a clear call-to-action or value proposition

Respond with ONLY the enhanced description, nothing else.`;
    } else if (type === "keywords") {
      prompt = `You are an expert SEO specialist.

Your task is to generate SEO-optimized keywords for an e-commerce product.

Product Details:
- Title: ${title}
- Category: ${category}
- Description: ${description}

Please provide 8-12 relevant, high-impact keywords that:
1. Are commonly searched by potential customers
2. Have good search volume potential
3. Match the product category and features
4. Include both broad and long-tail keywords
5. Are separated by commas

Respond with ONLY the keywords separated by commas, nothing else. Example format: keyword1, keyword2, keyword3`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    return NextResponse.json({
      success: true,
      type: type,
      content: generatedText.trim(),
    });
  } catch (error) {
    console.error("AI Enhancement Error:", error);

    let errorMessage = "Failed to enhance content";
    let statusCode = 500;

    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();

      // Handle quota exceeded errors
      if (errorStr.includes("429") || errorStr.includes("quota")) {
        errorMessage =
          "API quota exceeded. Please try again later or upgrade your Gemini API plan at https://aistudio.google.com";
        statusCode = 429;
      }
      // Handle model not found errors
      else if (
        errorStr.includes("404") ||
        errorStr.includes("not found") ||
        errorStr.includes("not supported")
      ) {
        errorMessage =
          "AI model not available. Please check your API configuration.";
        statusCode = 404;
      }
      // Handle authentication errors
      else if (errorStr.includes("401") || errorStr.includes("unauthorized")) {
        errorMessage =
          "Invalid API key. Please check your GEMINI_API_KEY configuration.";
        statusCode = 401;
      }
      // Default error
      else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
