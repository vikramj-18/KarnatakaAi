import React, { useState } from 'react';
import { analyzeInspirationPhoto } from '../services/api';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  MapPin,
  Plus,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';

interface PhotoToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDestinationToTrip?: (destName: string) => void;
}

const SAMPLE_LANDMARKS = [
  {
    name: 'Hampi Stone Chariot',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b784?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Misty Coorg Coffee Estate',
    imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gokarna Arabian Sea Beach',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Jog Falls Cascades',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
  },
];

export const PhotoToTripModal: React.FC<PhotoToTripModalProps> = ({
  isOpen,
  onClose,
  onAddDestinationToTrip,
}) => {
  if (!isOpen) return null;

  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_LANDMARKS[0].imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    try {
      const result = await analyzeInspirationPhoto(selectedImage);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Photo analysis error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Photo-to-Trip AI</h3>
              <p className="text-xs text-stone-500">
                Identify Karnataka landmarks and landscapes using Gemini Vision
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload or Sample Selection */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">
              Choose an inspiration photo or upload your own:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_LANDMARKS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(sample.imageUrl);
                    setAnalysisResult(null);
                  }}
                  className={`p-1.5 rounded-xl border text-left transition-all ${
                    selectedImage === sample.imageUrl
                      ? 'border-emerald-700 ring-2 ring-emerald-500'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                  <span className="text-[10px] font-bold text-stone-700 block mt-1 truncate">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Input */}
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-stone-300 hover:border-emerald-600 bg-stone-50 text-xs font-semibold text-stone-600 transition-colors">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Upload Custom Image or Screenshot</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Image Preview Box */}
          {selectedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 max-h-56 flex items-center justify-center">
              <img src={selectedImage} alt="Selected inspiration" className="w-full h-56 object-cover" />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-amber-300 font-bold text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Gemini Vision analyzing landscape & architecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Karnataka Destination Match</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Results Display */}
        {analysisResult && (
          <div className="mt-6 p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  Probable Karnataka Destination Match
                </span>
                <h4 className="text-lg font-extrabold text-stone-900 mt-0.5">
                  {analysisResult.probableKarnatakaMatch.name}
                </h4>
                <span className="text-xs font-semibold text-emerald-800">
                  {analysisResult.probableKarnatakaMatch.district} District • {analysisResult.probableKarnatakaMatch.category || 'Historic Landmark'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-center shrink-0">
                <span className="text-base font-extrabold block">
                  {analysisResult.probableKarnatakaMatch.confidenceScore}%
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-700">Confidence</span>
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed font-medium">
              {analysisResult.probableKarnatakaMatch.explanation}
            </p>

            {/* Detected visual cues */}
            {analysisResult.detectedFeatures && (
              <div>
                <span className="font-bold text-stone-700 block mb-1">Detected Visual Clues:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.detectedFeatures.map((feat: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[11px] font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Places */}
            {analysisResult.similarKarnatakaDestinations && (
              <div className="pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-700 block mb-1">Similar Places in Karnataka:</span>
                <div className="space-y-1">
                  {analysisResult.similarKarnatakaDestinations.map((sim: any, idx: number) => (
                    <div key={idx} className="text-stone-600 text-[11px]">
                      • <strong>{sim.name}</strong> ({sim.district}): {sim.whySimilar}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {onAddDestinationToTrip && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onAddDestinationToTrip(analysisResult.probableKarnatakaMatch.name);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {analysisResult.probableKarnatakaMatch.name} to Trip</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
