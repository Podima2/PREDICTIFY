import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, Check, User, Loader2 } from 'lucide-react';
import { uploadAvatarToIPFS } from '../../utils/uploadToIpfs';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setIsUploadingToIPFS(true);
    
    try {
      // Create a preview URL first
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        
        // Upload to IPFS
        try {
          const ipfsUrl = await uploadAvatarToIPFS(file);
          onAvatarChange(ipfsUrl);
          console.log('✅ Avatar uploaded to IPFS:', ipfsUrl);
        } catch (error) {
          console.error('❌ Failed to upload to IPFS:', error);
          alert('Failed to upload image. Please try again.');
          setPreviewUrl(null);
        } finally {
          setIsUploadingToIPFS(false);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ Error processing file:', error);
      setIsUploadingToIPFS(false);
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    onAvatarChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
            isDragging
              ? 'border-red-500 bg-red-950/20'
              : previewUrl
                ? 'border-green-500'
                : 'border-neutral-700 hover:border-red-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDragLeave}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <User className={`${iconSizes[size]} text-neutral-400`} />
            </div>
          )}

          {/* Upload Overlay */}
          {!previewUrl && !disabled && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <Camera className={`${iconSizes[size]} text-white`} />
            </div>
          )}

          {/* Remove Button */}
          {previewUrl && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveAvatar();
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}

          {/* Uploading Indicator */}
          {(isUploading || isUploadingToIPFS) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
                {isUploadingToIPFS && (
                  <span className="text-xs text-white">Uploading to IPFS...</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Instructions */}
      {!previewUrl && !disabled && (
        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-400">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-neutral-500">
            PNG, JPG up to 5MB
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}; 