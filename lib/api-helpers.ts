import { NextResponse } from "next/server";

/**
 * Standard API success response
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Standard API error response
 */
export function apiError(message: string, details?: unknown, status = 500) {
  console.error("API Error:", message, details);
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details instanceof Error ? details.message : details,
    },
    { status }
  );
}

/**
 * Wrapper for API route handlers with error handling
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error("Unhandled API error:", error);
      return apiError(
        "Internal server error",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };
}

/**
 * Parse query parameters from request URL
 */
export function getQueryParams(request: Request) {
  const { searchParams } = new URL(request.url);
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    getInt: (key: string, defaultValue?: number) => {
      const value = searchParams.get(key);
      if (!value) return defaultValue;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    },
    getBoolean: (key: string, defaultValue = false) => {
      const value = searchParams.get(key);
      if (!value) return defaultValue;
      return value === "true" || value === "1";
    },
  };
}
