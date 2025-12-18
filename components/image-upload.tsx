"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  folder: "water-purifiers" | "air-purifiers" | "reviews" | "temp";
  onImageUrlChange: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  folder,
  onImageUrlChange,
  currentImageUrl,
  label = "Upload Product Image",
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );

  const handleUploadSuccess = (result: any) => {
    try {
      const url = result.info.secure_url;
      setPreviewUrl(url);
      onImageUrlChange(url);
      setUploadError(null);
      setIsUploading(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setUploadError(errorMsg);
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: any) => {
    const errorMsg = error?.message || "Upload failed";
    setUploadError(errorMsg);
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Image Preview:</p>
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt="Product preview"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Image ready to upload
          </p>
        </div>
      )}

      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        onQueued={() => setIsUploading(true)}
        options={{
          folder: `Purifier_Store/${folder}`,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ["image/jpeg", "image/png", "image/webp"],
          multiple: false,
          resourceType: "image",
          autoMinimize: true,
          qualityTransformation: [{ quality: "auto", fetch_format: "auto" }],
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open()}
            disabled={isUploading || disabled}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : label}
          </Button>
        )}
      </CldUploadWidget>

      {/* Error Alert */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, WebP (Max 5MB)
      </p>
    </div>
  );
}
