import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export interface UploadResponse {
  secure_url: string;
  public_id: string;
  version: number;
}

interface UseCloudinaryUploadOptions {
  folder: "water-purifiers" | "air-purifiers" | "reviews" | "temp";
  maxSize?: number;
  onSuccess?: (url: string, publicId: string) => void;
  onError?: (error: string) => void;
}

export function useCloudinaryUpload(options: UseCloudinaryUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: any) => {
    try {
      const uploadResult = result.info as UploadResponse;
      const url = uploadResult.secure_url;
      const publicId = uploadResult.public_id;

      setUploadedUrl(url);
      setUploadError(null);
      setIsUploading(false);

      if (options.onSuccess) {
        options.onSuccess(url, publicId);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setUploadError(errorMsg);
      if (options.onError) {
        options.onError(errorMsg);
      }
    }
  };

  const handleUploadError = (error: any) => {
    const errorMsg = error?.message || "Upload failed";
    setUploadError(errorMsg);
    setIsUploading(false);
    if (options.onError) {
      options.onError(errorMsg);
    }
  };

  return {
    isUploading,
    uploadError,
    uploadedUrl,
    setUploadedUrl,
    handleUploadSuccess,
    handleUploadError,
  };
}
