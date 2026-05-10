"use client";

import { useState, useEffect } from "react";
import { useSessionUuid } from "./hooks/useSessionUuid";
import Sidebar from "../components/Sidebar";
import ClinicalTriage from "../components/ClinicalTriage";
import LaboratoryAnalysis from "../components/LaboratoryAnalysis";
import PredictionHistory from "../components/PredictionHistory";
import { Menu, X, ShieldAlert } from "lucide-react";

const SYMPTOM_MAP: Record<string, string> = {
  "High Fever": "high_fever", "Chills": "chills", "Fatigue": "fatigue",
  "Malaise": "malaise", "Headache": "headache", "Sweating (Normal)": "sweating",
  "Profuse Sweating": "profuse sweating", "Saddleback Fever": "saddleback_fever",
  "Step-Ladder Fever": "step_ladder_fever", "Toxic Look (Typhos)": "toxic_look_(typhos)",
  "Joint Pain": "joint_pain", "Muscle Pain": "muscle_pain", "Back Pain": "back_pain",
  "Pain Behind the Eyes": "pain_behind_the_eyes", "Dry Cough": "dry_cough",
  "Dehydration": "dehydration", "Abdominal / Belly Pain": "abdominal_pain",
  "Constipation": "constipation", "Diarrhoea": "diarrhoea", "Nausea": "nausea",
  "Vomiting (Occasional)": "vomiting", "Persistent Vomiting": "persistent_vomiting",
  "Severe Stomach Cramps": "severe stomach cramps", "Loss of Appetite": "loss_of_appetite",
  "Rapid Onset": "rapid_onset", "Skin Rash": "skin_rash", "Bleeding Gums or Nosebleeds": "bleeding_gums_or_nosebleeds",
  "Blood Spots": "blood_spots", "Red Spots Over Body": "red_spots_over_body",
  "Pink Spots": "pink_spots", "Dark Urine": "dark_urine", "Yellowing of Eyes / Mild Jaundice": "yellowing_of_eyes (Mild Jaundice)",
  "Sunken Eyes": "sunken_eyes"
};

const MODEL_FEATURES_ORDER = Object.values(SYMPTOM_MAP).sort();

const getSymptomNames = (featuresStr: string) => {
  try {
    const features = JSON.parse(featuresStr);
    if (!Array.isArray(features)) return "Invalid data";
    
    const reverseMap: Record<string, string> = {};
    Object.entries(SYMPTOM_MAP).forEach(([readable, mapped]) => {
      reverseMap[mapped] = readable;
    });

    const activeSymptoms = features.map((val, index) => {
      if (val === 1) {
        const mappedName = MODEL_FEATURES_ORDER[index];
        return reverseMap[mappedName] || mappedName;
      }
      return null;
    }).filter(Boolean);

    return activeSymptoms.join(', ') || "None";
  } catch (e) {
    return featuresStr; // Fallback for file names
  }
};

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://infectious-disease-api.onrender.com';
};

export default function Dashboard() {
  const sessionUuid = useSessionUuid();
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("triage");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchHistory = async () => {
    if (!sessionUuid) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/diagnostics/history/${sessionUuid}`);
      if (res.ok) {
        const data = await res.json();
        // Format the inputs before setting state
        const formattedData = data.map((item: any) => ({
          ...item,
          inputs: item.type === 'SYMPTOM' ? getSymptomNames(item.inputs) : item.inputs
        }));
        setHistory(formattedData);
      }
    } catch (e) {
      console.error('Error fetching history:', e);
    }
  };

  const clearHistory = async () => {
    if (!sessionUuid) return;
    if (!confirm('Are you sure you want to clear all prediction history? This cannot be undone.')) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/diagnostics/history/${sessionUuid}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHistory([]);
      }
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [sessionUuid]);
  
  // Triage State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<{ disease: string; confidence: number } | null>(null);

  // Analysis State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ result: string; confidence: number } | null>(null);

  // Loading States
  const [isTriageLoading, setIsTriageLoading] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom));
  };

  const handlePredictSymptoms = async () => {
    const mappedSelected = selectedSymptoms.map(s => SYMPTOM_MAP[s]);
    const features = MODEL_FEATURES_ORDER.map(feature => mappedSelected.includes(feature) ? 1 : 0);

    setIsTriageLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/diagnostics/symptoms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-uuid': sessionUuid || ''
        },
        body: JSON.stringify({ features })
      });
      const data = await res.json();
      setTriageResult(data);
      fetchHistory();
    } catch (e) {
      console.error(e);
      alert('Error predicting symptoms');
    } finally {
      setIsTriageLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setAnalysisResult(null); // Reset result when new file is selected
    }
  };

  const clearSession = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
  };

  const clearTriage = () => {
    setSelectedSymptoms([]);
    setTriageResult(null);
  };

  const handleAnalyzeSmear = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setIsAnalysisLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/diagnostics/blood-smear`, {
        method: 'POST',
        headers: {
          'x-session-uuid': sessionUuid || ''
        },
        body: formData
      });
      const data = await res.json();
      setAnalysisResult(data);
      fetchHistory();
    } catch (e) {
      console.error(e);
      alert('Error diagnosing smear');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row overflow-hidden font-sans text-gray-800 dark:text-gray-200 transition-colors relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 z-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldAlert className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Infectious Disease</h1>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 dark:text-gray-300">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:h-full md:flex-shrink-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { 
            setActiveTab(tab); 
            setIsSidebarOpen(false); 
          }} 
        />
      </div>
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-[#F9FAFB] dark:bg-gray-950 transition-colors">
        {activeTab === "triage" && (
          <ClinicalTriage 
            selectedSymptoms={selectedSymptoms}
            toggleSymptom={toggleSymptom}
            removeSymptom={removeSymptom}
            handlePredictSymptoms={handlePredictSymptoms}
            triageResult={triageResult}
            clearTriage={clearTriage}
            isLoading={isTriageLoading}
          />
        )}

        {activeTab === "analysis" && (
          <LaboratoryAnalysis 
            file={file}
            preview={preview}
            handleFileChange={handleFileChange}
            handleAnalyzeSmear={handleAnalyzeSmear}
            analysisResult={analysisResult}
            clearSession={clearSession}
            isLoading={isAnalysisLoading}
          />
        )}

        {activeTab === "history" && (
          <PredictionHistory history={history} clearHistory={clearHistory} />
        )}
      </main>
    </div>
  );
}
