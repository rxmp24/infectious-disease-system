"use client";

import Link from "next/link";
import { ArrowRight, Activity, Beaker, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* 1. Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <ShieldAlert className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Intelligent Diagnostic System</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">How it Works</a>
              <a href="#diseases" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">Supported Diseases</a>
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6 border border-blue-200 dark:border-blue-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Live System Active
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
                Intelligent Infectious Disease Prediction &amp; Classification System.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-xl">
                An advanced dual-pipeline diagnostic tool utilizing probabilistic machine learning and deep spatial neural networks to assist in clinical triage and laboratory blood smear analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard?tab=triage" 
                  className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                >
                  <Activity className="w-5 h-5" />
                  Start Clinical Triage
                </Link>
                <Link 
                  href="/dashboard?tab=analysis" 
                  className="inline-flex justify-center items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl text-base font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Beaker className="w-5 h-5" />
                  Analyze Blood Smear
                </Link>
              </div>
            </div>

            {/* Hero Visual Concept */}
            <div className="relative hidden lg:block">
              {/* Abstract decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="relative flex justify-center">
                {/* Floating Mockup Cards */}
                <div className="relative w-full max-w-md">
                  {/* Microscopic Cell Card */}
                  <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 animate-float z-20">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                        <Beaker className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Parasitaemia</p>
                        <p className="text-xs text-slate-500">Confidence: 98.4%</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Clinical Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-6 z-10 relative mt-12">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-slate-900 dark:text-white">Triage Profile</span>
                      </div>
                      <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-md">High Risk</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md">High Fever</span>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md">Muscle Pain</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Processing naive bayes probabilistic weights...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Supported Diseases Section */}
      <section id="diseases" className="py-24 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">Targeted Endemic Diseases</h2>
            <p className="text-slate-500 dark:text-slate-400">Our system is heavily optimized and trained to rapidly classify the following high-impact infectious vectors.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Malaria", desc: "Detects Plasmodium parasites via blood smear CNN and identifies systemic clinical symptom profiles." },
              { title: "Typhoid", desc: "Identifies progressive clinical markers including step-ladder fevers and distinctive dermatological signs." },
              { title: "Dengue Fever", desc: "Classifies acute hemorrhagic indicators and severe musculoskeletal pain patterns." },
              { title: "Gastroenteritis", desc: "Triages severe gastrointestinal distress, rapid onset dehydration, and digestive symptoms." }
            ].map((disease, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {disease.title.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{disease.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{disease.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">How the Pipeline Works</h2>
            <p className="text-slate-500 dark:text-slate-400">A streamlined process for rapid, AI-augmented clinical support.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
            
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { icon: FileText, title: "Step 1", desc: "Input Symptoms or Upload Slide." },
                { icon: Activity, title: "Step 2", desc: "AI Processing (Naive Bayes & ONNX)." },
                { icon: CheckCircle2, title: "Step 3", desc: "Receive Diagnostic Confidence Score." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer & Clinical Disclaimer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-50 grayscale">
            <ShieldAlert className="text-slate-600 w-5 h-5" />
            <span className="font-bold text-sm tracking-tight text-slate-600">Intelligent Diagnostic System</span>
          </div>
          
          <div className="max-w-3xl text-center px-4 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              <strong className="text-slate-700 dark:text-slate-300">Disclaimer:</strong> This system is a predictive clinical assistant designed for research and triage augmentation. It does not replace professional pathology or definitive medical diagnosis. Always consult a certified medical professional for formal diagnoses and treatment plans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
