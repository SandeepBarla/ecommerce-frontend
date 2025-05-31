import { cn } from "@/lib/utils";
import { Image, Loader2, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "./button";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  acceptedFormats?: string;
  maxFileSize?: number; // in MB
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  className,
  disabled = false,
  acceptedFormats = "image/*",
  maxFileSize = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your environment variables."
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "payment-proofs"); // Organize uploads in folders

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous states
    setError(null);
    setPreviewUrl(null);

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      const errorMsg = `File size must be less than ${maxFileSize}MB`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select a valid image file";
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(file);

      // Success callback
      onUploadSuccess(uploadedUrl);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setError(errorMsg);
      onUploadError?.(errorMsg);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        <Button
          type="button"
          variant="outline"
          className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-ethnic-purple/50 flex flex-col items-center justify-center space-y-2 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-ethnic-purple" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Click to upload payment proof
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG up to {maxFileSize}MB
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="relative border border-gray-200 rounded-lg p-2">
            <img
              src={previewUrl}
              alt="Payment proof preview"
              className="w-full h-48 object-cover rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4"
              onClick={clearPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <Image className="h-4 w-4 mr-1" />
            Upload successful! Image ready to submit.
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
