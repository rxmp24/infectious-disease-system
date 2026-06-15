import { useRef, useState, useEffect } from 'react';
import { UploadCloud, Microscope, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface LaboratoryAnalysisProps {
  file: File | null;
  preview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyzeSmear: () => void;
  analysisResult: { result: string; confidence: number } | null;
  clearSession: () => void;
  isLoading: boolean;
}

export default function LaboratoryAnalysis({
  file,
  preview,
  handleFileChange,
  handleAnalyzeSmear,
  analysisResult,
  clearSession,
  isLoading
}: LaboratoryAnalysisProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const event = {
        target: { files: e.dataTransfer.files }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  const isMalaria = analysisResult?.result === 'Parasitized';
  const confidencePercent = analysisResult ? (analysisResult.confidence * 100).toFixed(1) : 0;

  return (
    <div className="max-w-4xl w-full mx-auto animate-fade-in pb-12 transition-colors">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Automated Smear Analysis</h2>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-2xl">
          Upload digitized blood smear slides for deep-learning analysis. Our CNN model 
          detects Plasmodium parasites with high accuracy in thin blood smears.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-8 transition-colors">
        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 flex flex-col items-center justify-center
              ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              ref={fileInputRef}
              className="hidden" 
            />
            <div className="bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-full mb-6">
              <UploadCloud className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Drag and drop a blood smear image here</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/60 text-emerald-700 dark:text-emerald-300 px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <UploadCloud className="w-5 h-5" />
                Browse Files
              </button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">Supports TIFF, JPG, and PNG high-res laboratory scans (Max 50MB)</p>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-colors">
            <div className="flex items-center gap-6">
              {preview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-black">
                  <img src={preview} alt="Blood Smear Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{file.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}</p>
                <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-xl p-5 flex items-start gap-3 transition-colors">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300 mb-1">PROTOCOL NOTE</h4>
            <p className="text-sm text-orange-800 dark:text-orange-400/80 leading-relaxed">
              Ensure the microscopic objective is at 100x oil immersion for maximum segmentation accuracy of the Clinical Curator engine.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={clearSession}
            disabled={!file}
            className="flex-1 py-4 px-6 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear Session
          </button>
          <button 
            onClick={handleAnalyzeSmear} 
            disabled={!file || isLoading}
            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:bg-emerald-300 dark:disabled:bg-emerald-900 dark:disabled:text-emerald-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-sm shadow-emerald-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spinner" />
                Analyzing Smear...
              </>
            ) : (
              <>
                <Microscope className="w-5 h-5" />
                Analyze Blood Smear
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 mb-8 animate-fade-in transition-colors">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 dark:border-emerald-900/50"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-600 dark:border-t-emerald-400 animate-spinner"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Analyzing Blood Smear</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse-slow">Running CNN deep-learning inference on slide image...</p>
            </div>
          </div>
        </div>
      )}

      {analysisResult && !isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-fade-in relative overflow-hidden transition-colors">
          <div className={`absolute top-0 left-0 w-1 h-full ${isMalaria ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${isMalaria ? 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'}`}>
                  Analysis Result
                </span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${isMalaria ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                {isMalaria ? 'Malaria Detected' : 'No Malaria Detected'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isMalaria ? 'Plasmodium parasites observed in red blood cells.' : 'Cell structures appear uninfected.'}
              </p>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <span className={`text-4xl font-bold tracking-tight ${isMalaria ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                {confidencePercent}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Confidence
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${isMalaria ? 'bg-red-500' : 'bg-emerald-500'}`} 
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
