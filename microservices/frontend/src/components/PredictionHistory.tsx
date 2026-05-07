import { History, Activity, Microscope, Trash2 } from 'lucide-react';

interface PredictionHistoryProps {
  history: any[];
  clearHistory: () => void;
}

export default function PredictionHistory({ history, clearHistory }: PredictionHistoryProps) {
  return (
    <div className="max-w-4xl w-full mx-auto animate-fade-in pb-12 transition-colors">
      <div className="mb-10 flex items-center gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400">
          <History className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Prediction History</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review past diagnostic inferences linked to your anonymous session.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-800/50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center transition-colors">
          <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history found</h3>
          <p className="text-gray-500 dark:text-gray-400">Your past predictions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => {
            const isTriage = record.type === 'SYMPTOM';
            const Icon = isTriage ? Activity : Microscope;
            
            return (
              <div 
                key={record.id} 
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md dark:hover:shadow-none dark:hover:border-gray-700 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${isTriage ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${isTriage ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'}`}>
                      {isTriage ? 'Clinical Triage' : 'Smear Analysis'}
                    </span>
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 ml-auto">
                      {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Diagnosis</p>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{record.diagnosis}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(record.confidence * 100).toFixed(1)}%
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest mt-1">
                        Confidence
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {isTriage ? 'Reported Symptoms' : 'Analyzed File'}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors">
                      {isTriage ? (
                        <div className="flex flex-wrap gap-1.5">
                           {record.inputs.includes('[') 
                              ? JSON.parse(record.inputs).length > 0 ? "Processed symptoms payload" : "No symptoms"
                              : record.inputs}
                        </div>
                      ) : (
                        record.inputs
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
