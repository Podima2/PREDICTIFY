import React, { useState, useEffect } from 'react';
import { Video, Wifi } from 'lucide-react';
import { useHighlights } from '../../hooks/useHighlights';
import { useWallet } from '../../hooks/useWallet';
import { useUserRegistry } from '../../hooks/useUserRegistry';
import { UserRole } from '../../types';
import {
  VideoUploadStep,
  VideoDetailsStep,
  ReviewStep,
  UploadStatus
} from '../upload';

const UploadPage: React.FC = () => {
  const { address, isConnected } = useWallet();
  const { userRole } = useUserRegistry();
  const { 
    uploadNewHighlight, 
    isUploading, 
    uploadProgress, 
    uploadError, 
    testConnection,
    isUploadingToContract,
    isUploadPending,
    uploadData
  } = useHighlights();

  const [step, setStep] = useState(1);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'minting' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport: 'Soccer',
    position: '',
    skillsShowcased: [] as string[],
    tags: [] as string[],
      opponent: '',
    gameDate: '',
      competition: '',
      result: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');



  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsShowcased: prev.skillsShowcased.includes(skill)
        ? prev.skillsShowcased.filter(s => s !== skill)
        : [...prev.skillsShowcased, skill]
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus('Testing connection...');
    try {
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? '✅ Connection successful!' : '❌ Connection failed');
    } catch (error) {
      setConnectionStatus('❌ Connection test failed');
      console.error('Connection test error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    if (userRole !== UserRole.Athlete) {
      setErrorMessage('Only athletes can upload highlights');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');
    
    try {
      const metadata = {
        title: formData.title,
        description: formData.description,
        sport: formData.sport,
        position: formData.position,
        skillsShowcased: formData.skillsShowcased,
        tags: formData.tags,
        duration: 0, // Will be calculated during upload
        opponent: formData.opponent,
        gameDate: formData.gameDate,
        competition: formData.competition,
        result: formData.result,
        athleteAddress: address
      };

      // Start upload process
      const result = await uploadNewHighlight(selectedFile, metadata);
      
      if (result.success) {
        // The uploadNewHighlight function handles both IPFS upload and blockchain minting
        // The real transaction status will be tracked by the hook
        console.log('Upload initiated successfully');
      } else {
        setUploadStatus('error');
        setErrorMessage(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setUploadStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Monitor transaction status
  useEffect(() => {
    if (uploadError) {
      setUploadStatus('error');
      setErrorMessage(uploadError.message || 'Transaction failed');
    } else if (isUploadingToContract || isUploadPending) {
      setUploadStatus('minting');
    } else if (isUploading) {
      setUploadStatus('uploading');
    } else if (uploadData && !isUploadingToContract && !isUploadPending && !isUploading) {
      // Transaction completed successfully
      setUploadStatus('success');
    }
  }, [uploadError, isUploadingToContract, isUploadPending, isUploading, uploadData]);

  const handleReset = () => {
              setUploadStatus('idle');
              setStep(1);
              setSelectedFile(null);
    setTransactionHash('');
              setFormData({
                title: '',
                description: '',
      sport: 'Soccer',
                position: '',
                skillsShowcased: [],
      tags: [],
      opponent: '',
      gameDate: '',
      competition: '',
      result: ''
    });
    setErrorMessage('');
  };

  // Determine the current status based on real transaction state
  const getCurrentStatus = (): 'success' | 'error' | 'uploading' | 'minting' => {
    if (uploadStatus === 'success') return 'success';
    if (uploadStatus === 'error') return 'error';
    if (isUploadingToContract || isUploadPending) return 'minting';
    if (isUploading) return 'uploading';
    return 'uploading'; // fallback
  };

  if (uploadStatus === 'success' || uploadStatus === 'error' || isUploading || isUploadingToContract || isUploadPending) {
    return (
      <UploadStatus
        status={getCurrentStatus()}
        errorMessage={errorMessage}
        uploadProgress={uploadProgress}
        transactionHash={uploadData}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-sharp text-white">UPLOAD HIGHLIGHTS</h1>
          </div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Showcase your talent with highlight videos and get AI-powered scouting insights
          </p>
        </div>

        {/* Debug Section */}
        <div className="mb-8 bg-neutral-950 border border-neutral-800 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Wifi className="w-5 h-5" />
              <span>Connection Status</span>
            </h3>
            <button
              onClick={handleTestConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Test Connection
            </button>
          </div>
          <div className="text-sm">
            <p className="text-neutral-400 mb-2">Wallet: {isConnected ? '✅ Connected' : '❌ Not Connected'}</p>
            <p className="text-neutral-400 mb-2">Role: {userRole === UserRole.Athlete ? '✅ Athlete' : userRole === UserRole.Scout ? '👁️ Scout' : '❌ Not Registered'}</p>
            <p className="text-neutral-400 mb-2">IPFS: {connectionStatus || '⏳ Not tested'}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-red-600' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 font-bold tracking-wide">
            <span>VIDEO UPLOAD</span>
            <span>DETAILS</span>
            <span>REVIEW</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-950 border border-red-900/30 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <VideoUploadStep
                selectedFile={selectedFile}
                dragActive={dragActive}
                onDrag={handleDrag}
                  onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                onNext={nextStep}
              />
            )}

            {step === 2 && (
              <VideoDetailsStep
                formData={formData}
                onInputChange={handleInputChange}
                onToggleSkill={toggleSkill}
                onToggleTag={toggleTag}
                onPrev={prevStep}
                onNext={nextStep}
              />
            )}

            {step === 3 && (
              <ReviewStep
                formData={formData}
                selectedFile={selectedFile}
                onPrev={prevStep}
                onSubmit={handleSubmit}
                isUploading={isUploading}
              />
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;