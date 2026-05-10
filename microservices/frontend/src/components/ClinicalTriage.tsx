import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Activity, RotateCcw, Loader2 } from 'lucide-react';

const BOX_1_OPTIONS = [
  "High Fever", "Chills", "Fatigue", "Malaise", "Headache", 
  "Sweating (Normal)", "Profuse Sweating", "Saddleback Fever", "Step-Ladder Fever", 
  "Toxic Look (Typhos)", "Joint Pain", "Muscle Pain", "Back Pain", 
  "Pain Behind the Eyes", "Dry Cough", "Dehydration"
];

const BOX_2_OPTIONS = [
  "Abdominal / Belly Pain", "Constipation", "Diarrhoea", "Nausea", 
  "Vomiting (Occasional)", "Persistent Vomiting", "Severe Stomach Cramps", 
  "Loss of Appetite", "Rapid Onset", "Skin Rash", "Bleeding Gums or Nosebleeds", 
  "Blood Spots", "Red Spots Over Body", "Pink Spots", "Dark Urine", 
  "Yellowing of Eyes / Mild Jaundice", "Sunken Eyes"
];

interface ClinicalTriageProps {
  selectedSymptoms: string[];
  toggleSymptom: (symptom: string) => void;
  removeSymptom: (symptom: string) => void;
  handlePredictSymptoms: () => void;
  triageResult: { disease: string; confidence: number } | null;
  clearTriage: () => void;
  isLoading: boolean;
}

function MultiSelectDropdown({ 
  label, 
  options, 
  selected, 
  toggleSymptom, 
  removeSymptom 
}: { 
  label: string, 
  options: string[], 
  selected: string[], 
  toggleSymptom: (s: string) => void,
  removeSymptom: (s: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableOptions = options.filter(o => !selected.includes(o));

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <div 
          className="min-h-[52px] w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 px-3 py-2 flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 focus-within:border-blue-400 dark:focus-within:border-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 && (
            <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">Select symptoms...</span>
          )}
          {selected.map(sym => (
            <span 
              key={sym} 
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800"
              onClick={(e) => { e.stopPropagation(); }}
            >
              {sym}
              <button 
                onClick={(e) => { e.stopPropagation(); removeSymptom(sym); }}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 p-0.5 rounded-full transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="ml-auto">
            <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar py-2">
            {availableOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">All symptoms selected</div>
            ) : (
              availableOptions.map(sym => (
                <div
                  key={sym}
                  className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSymptom(sym);
                  }}
                >
                  {sym}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClinicalTriage({ 
  selectedSymptoms, 
  toggleSymptom, 
  removeSymptom,
  handlePredictSymptoms, 
  triageResult,
  clearTriage,
  isLoading
}: ClinicalTriageProps) {

  const box1Selected = selectedSymptoms.filter(s => BOX_1_OPTIONS.includes(s));
  const box2Selected = selectedSymptoms.filter(s => BOX_2_OPTIONS.includes(s));

  return (
    <div className="max-w-4xl w-full mx-auto animate-fade-in pb-12 transition-colors">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Clinical Triage Evaluation</h2>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-2xl">
          Enter observed clinical symptoms to generate an AI-assisted diagnostic risk profile. 
          Our system uses heuristic weighting to identify infectious vectors early.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-8 transition-colors">
        <MultiSelectDropdown 
          label="General Body, Fever & Pain Symptoms"
          options={BOX_1_OPTIONS}
          selected={box1Selected}
          toggleSymptom={toggleSymptom}
          removeSymptom={removeSymptom}
        />

        <MultiSelectDropdown 
          label="Stomach, Digestion & Visual/Skin Indicators"
          options={BOX_2_OPTIONS}
          selected={box2Selected}
          toggleSymptom={toggleSymptom}
          removeSymptom={removeSymptom}
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button 
            onClick={handlePredictSymptoms}
            disabled={selectedSymptoms.length === 0 || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-900 dark:disabled:text-blue-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-sm shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spinner" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Run Triage Prediction
              </>
            )}
          </button>

          {(selectedSymptoms.length > 0 || triageResult) && (
            <button
              onClick={clearTriage}
              className="sm:w-auto w-full px-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Clear Session
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 animate-fade-in transition-colors">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/50"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spinner"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Processing Triage</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse-slow">Analyzing symptom patterns with AI model...</p>
            </div>
          </div>
        </div>
      )}

      {triageResult && !isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-fade-in relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                  Primary Clinical Suggestion
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Diagnosis: <span className="text-blue-600 dark:text-blue-400">{triageResult.disease}</span>
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Based on {selectedSymptoms.length} reported symptoms
              </p>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {(triageResult.confidence * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Confidence
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${triageResult.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
