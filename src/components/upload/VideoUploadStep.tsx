import React from 'react';
import { Upload, CheckCircle, Camera } from 'lucide-react';

interface VideoUploadStepProps {
  selectedFile: File | null;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export const VideoUploadStep: React.FC<VideoUploadStepProps> = ({
  selectedFile,
  dragActive,
  onDrag,
  onDrop,
  onFileSelect,
  onNext
}) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl text-sharp text-white mb-6">Upload Your Highlight Video</h2>
      
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-red-500 bg-red-950/20' 
            : selectedFile 
              ? 'border-green-500 bg-green-950/20'
              : 'border-neutral-700 hover:border-red-600 hover:bg-red-950/10'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="video/*"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">File Selected</h3>
              <p className="text-green-400 font-medium">{selectedFile.name}</p>
              <p className="text-neutral-400 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 text-neutral-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Your Highlight Video</h3>
              <p className="text-neutral-400 mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500">
                <span>• Max 100MB</span>
                <span>• 15-60 seconds</span>
                <span>• MP4, MOV, AVI</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Guidelines */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Video Guidelines</span>
        </h4>
        <ul className="text-blue-300 space-y-2 text-sm font-medium">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Show your best skills and moments clearly</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Good lighting and stable camera work</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Focus on specific skills or game situations</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Include multiple angles if possible</span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!selectedFile}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 tracking-wide"
      >
        Continue to Details
      </button>
    </div>
  );
}; 