import { useState } from "react";

interface EnhanceResponse {
  success: boolean;
  type: "description" | "keywords";
  content: string;
  error?: string;
}

export function useAIEnhance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = async (
    title: string,
    category: string,
    description: string,
    type: "description" | "keywords"
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enhance content");
      }

      const data: EnhanceResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Enhancement failed");
      }

      return data.content;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("AI Enhancement Error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    enhance,
    loading,
    error,
  };
}
