import { cn } from "@/lib/utils";
import { Image, Loader2, Upload, Video, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "./button";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string, type: "Image" | "Video") => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  acceptedFormats?: string;
  maxFileSize?: number; // in MB
  folder?: string; // Cloudinary folder path
  supportedTypes?: ("Image" | "Video")[]; // What types are supported
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  className,
  disabled = false,
  acceptedFormats = "image/*,video/*",
  maxFileSize = 10,
  folder = "payment-proofs", // Default folder
  supportedTypes = ["Image", "Video"],
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"Image" | "Video" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): "Image" | "Video" | null => {
    if (file.type.startsWith("image/")) return "Image";
    if (file.type.startsWith("video/")) return "Video";
    return null;
  };

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
    formData.append("folder", folder);

    // Use video upload endpoint for videos
    const isVideo = file.type.startsWith("video/");
    const uploadUrl = isVideo
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

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
    setPreviewType(null);

    // Validate file type
    const fileType = getFileType(file);
    if (!fileType) {
      const errorMsg = "Please select a valid image or video file";
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    if (!supportedTypes.includes(fileType)) {
      const errorMsg = `${fileType} files are not supported for this upload`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Validate file size (videos can be larger)
    const maxSize = fileType === "Video" ? maxFileSize * 2 : maxFileSize; // Allow 2x size for videos
    if (file.size > maxSize * 1024 * 1024) {
      const errorMsg = `File size must be less than ${maxSize}MB for ${fileType.toLowerCase()}s`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setPreviewType(fileType);

      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(file);

      // Success callback with type
      onUploadSuccess(uploadedUrl, fileType);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setError(errorMsg);
      onUploadError?.(errorMsg);
      setPreviewUrl(null);
      setPreviewType(null);
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
    setPreviewType(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getUploadText = () => {
    if (folder === "product-images") {
      if (supportedTypes.length === 1) {
        return supportedTypes[0] === "Image"
          ? "Click to upload product image"
          : "Click to upload product video";
      }
      return "Click to upload product image or video";
    }
    return "Click to upload payment proof";
  };

  const getFileFormatsText = () => {
    const formats = [];
    if (supportedTypes.includes("Image")) formats.push("PNG, JPG");
    if (supportedTypes.includes("Video")) formats.push("MP4, MOV");
    return formats.join(", ");
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
              <div className="flex items-center gap-2">
                {supportedTypes.includes("Image") && (
                  <Image className="h-6 w-6 text-gray-400" />
                )}
                {supportedTypes.includes("Video") && (
                  <Video className="h-6 w-6 text-gray-400" />
                )}
                {supportedTypes.length === 2 && (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-600 text-center">
                {getUploadText()}
              </span>
              <span className="text-xs text-gray-400">
                {getFileFormatsText()} up to {maxFileSize}MB
                {supportedTypes.includes("Video") &&
                  ` (${maxFileSize * 2}MB for videos)`}
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Preview */}
      {previewUrl && previewType && (
        <div className="relative">
          <div className="relative border border-gray-200 rounded-lg p-2">
            {previewType === "Image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="w-full h-48 object-cover rounded"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            )}
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
            {previewType === "Image" ? (
              <Image className="h-4 w-4 mr-1" />
            ) : (
              <Video className="h-4 w-4 mr-1" />
            )}
            Upload successful! {previewType} ready to submit.
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
