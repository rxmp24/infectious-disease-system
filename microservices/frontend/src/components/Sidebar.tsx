import { Activity, Microscope, History, ShieldAlert, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 'triage', label: 'Clinical Triage', icon: Activity },
    { id: 'analysis', label: 'Laboratory Analysis', icon: Microscope },
    { id: 'history', label: 'Prediction History', icon: History },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full flex-shrink-0 transition-colors">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight transition-colors">Infectious Disease</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">Diagnostic System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-4 py-3 mb-4 rounded-xl transition-all duration-200 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 transition-colors">
          <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
            Clinical Curator Engine v2.1 active. All sessions are anonymized.
          </p>
        </div>
      </div>
    </aside>
  );
}
