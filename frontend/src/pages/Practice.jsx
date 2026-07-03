import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import LearnMode from '../components/practice/LearnMode';
import PracticeQuestions from '../components/practice/PracticeQuestions';
import InterviewPrep from './InterviewPrep';
import { BrainCircuit, Building2, TerminalSquare, BookOpen, CheckSquare, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Practice = () => {
  const [mode, setMode] = useState('company');
  const [aptitudeSubMode, setAptitudeSubMode] = useState('formula');

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Placement Hub
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your centralized dashboard for Company Coding, Aptitude, and Interview Preparation.
          </p>
        </div>

        {/* 3 Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
          {[
            { id: 'company', icon: Building2, label: 'Company Coding', desc: 'Select a company to practice coding', color: 'from-blue-500/20 to-transparent', border: 'border-blue-500/50' },
            { id: 'aptitude', icon: BrainCircuit, label: 'Aptitude', desc: 'Formulas & Practice MCQs', color: 'from-orange-500/20 to-transparent', border: 'border-orange-500/50' },
            { id: 'interview', icon: TerminalSquare, label: 'Interview Q&A', desc: 'Core Subjects & Role Prep', color: 'from-green-500/20 to-transparent', border: 'border-green-500/50' }
          ].map((m) => (
            <motion.button 
              key={m.id} 
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(m.id)}
              className={`flex-1 p-6 rounded-[24px] border transition-all relative overflow-hidden group ${mode === m.id ? `bg-white/10 ${m.border} shadow-[0_0_30px_rgba(255,255,255,0.1)]` : 'border-white/10 bg-white/5 hover:border-white/30'}`}
            >
              {mode === m.id && <div className={`absolute inset-0 bg-gradient-to-br ${m.color} z-0`} />}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`p-4 rounded-xl mb-4 ${mode === m.id ? 'bg-white/20' : 'bg-white/5'} backdrop-blur-md`}>
                    <m.icon className={`w-8 h-8 ${mode === m.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                </div>
                <h3 className={`font-bold text-xl mb-1 ${mode === m.id ? 'text-white' : 'text-gray-300'}`}>{m.label}</h3>
                <p className="text-gray-400 text-xs">{m.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/10">
          
          {mode === 'company' && <InterviewPrep filterType="company" />}
          {mode === 'interview' && <InterviewPrep filterType="interview" />}
          
          {mode === 'aptitude' && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-8">
                <div className="bg-white/5 p-1 rounded-xl flex border border-white/10 flex-wrap justify-center gap-1">
                  <button 
                    onClick={() => setAptitudeSubMode('formula')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aptitudeSubMode === 'formula' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <BookOpen className="w-4 h-4" /> Formula Notes
                  </button>
                  <button 
                    onClick={() => setAptitudeSubMode('questions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aptitudeSubMode === 'questions' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <CheckSquare className="w-4 h-4" /> Practice Questions
                  </button>
                  <button 
                    onClick={() => setAptitudeSubMode('assignments')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aptitudeSubMode === 'assignments' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <FileText className="w-4 h-4" /> PDF Assignments
                  </button>
                </div>
              </div>
              
              {aptitudeSubMode === 'formula' && <LearnMode />}
              {aptitudeSubMode === 'questions' && <PracticeQuestions />}
              {aptitudeSubMode === 'assignments' && <InterviewPrep filterType="aptitude" />}
            </div>
          )}

        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Practice;
