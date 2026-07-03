import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Code, FileText, Download, ChevronLeft, Building2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import TCSPractice from './TCSPractice';

const InterviewPrep = ({ filterType = 'all' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Viewer states
  const [activeProblem, setActiveProblem] = useState(null);
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isOutputLoading, setIsOutputLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const fetchPrep = async () => {
      try {
        const res = await axios.get('/data/interview-prep.json');
        setData(res.data || []);
      } catch (err) {
        console.error('Error fetching interview prep data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrep();
  }, []);

  // Filter the categories
  let filteredData = data.filter(cat => {
    const isAptitude = cat.category === 'Aptitude Assignments';
    const isCompany = ['Accenture', 'Cognizant', 'TATA ELXSI', 'TCS', 'TCS - NINJA', 'Wipro Elite NLTH'].includes(cat.category);
    
    if (filterType === 'aptitude') return isAptitude;
    if (filterType === 'company') return isCompany;
    if (filterType === 'interview') return !isCompany && !isAptitude;
    return true;
  });

  if (filterType === 'company') {
    filteredData = [
      { category: 'TCS Premium NQT Module', problems: [], pdfs: [], looseFiles: [], isCustomTcs: true },
      ...filteredData
    ];
  }

  // Auto-select aptitude category so users don't have to click the single card
  useEffect(() => {
    if (filterType === 'aptitude' && filteredData.length > 0 && !selectedCategory) {
      setSelectedCategory(filteredData[0]);
    }
  }, [filterType, filteredData, selectedCategory]);

  const handleSelectProblem = (prob) => {
    setActiveProblem(prob);
    if (prob.hasCode) {
      setCode(prob.solution || '// Write your code here...');
      setCustomInput('');
      setOutput('');
      setShowSolution(false);
    }
  };

  const runCode = async () => {
    if (!code) return;
    setIsOutputLoading(true);
    setOutput('');
    try {
      const langToCompiler = {
        'java': 'openjdk-jdk-22+36',
        'cpp': 'gcc-13.2.0',
        'python': 'cpython-3.12.7'
      };

      const payload = {
        compiler: langToCompiler[activeProblem.language] || 'gcc-13.2.0',
        code: code,
        stdin: customInput
      };

      const res = await axios.post('https://wandbox.org/api/compile.json', payload);
      const resData = res.data;
      if (resData.compiler_error || resData.program_error) {
        setOutput(resData.compiler_error || resData.program_error);
      } else {
        setOutput(resData.program_message || 'Executed successfully (no output).');
      }
    } catch (err) {
      setOutput('Error executing code. Network issue.');
    } finally {
      setIsOutputLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  // View 3: The Problem Viewer (LeetCode Style or Text Style)
  if (activeProblem) {
    return (
      <div className="max-w-7xl mx-auto mt-8 animate-fade-in pb-12 px-4">
        <button
          onClick={() => setActiveProblem(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Problems
        </button>

        {activeProblem.hasCode ? (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)] min-h-[700px]">
            {/* Left Pane */}
            <div className="w-full lg:w-1/3 bg-white/5 border border-white/10 rounded-xl p-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code className="text-green-500" />
                {activeProblem.title}
              </h3>
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                {activeProblem.description || 'No description provided.'}
              </div>
            </div>

            {/* Right Pane (Code Editor) */}
            <div className="w-full lg:w-2/3 bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
              <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  solution.{activeProblem.language}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setShowSolution(!showSolution)} className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded font-bold transition-all">
                    {showSolution ? 'Hide Solution' : 'View Solution'}
                  </button>
                  <button onClick={runCode} disabled={isOutputLoading} className="text-xs px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded font-bold flex items-center gap-1 transition-all">
                    {isOutputLoading ? 'Running...' : 'Run Code'}
                  </button>
                </div>
              </div>
              <div className="flex-grow min-h-[400px]">
                <Editor
                  height="100%"
                  language={activeProblem.language === 'py' ? 'python' : activeProblem.language}
                  theme="vs-dark"
                  value={showSolution ? (activeProblem.solution) : code}
                  onChange={(val) => { if (!showSolution) setCode(val); }}
                  options={{ readOnly: showSolution, minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono' }}
                />
              </div>
              {/* Console */}
              <div className="bg-black/30 border-t border-white/10 flex flex-col sm:flex-row min-h-[150px]">
                <div className="w-full sm:w-1/2 border-r border-white/10 p-3 flex flex-col">
                  <span className="text-xs text-gray-500 font-bold uppercase mb-2">Custom Input</span>
                  <textarea
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white font-mono text-sm outline-none flex-grow resize-none"
                    value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                  ></textarea>
                </div>
                <div className="w-full sm:w-1/2 p-3 flex flex-col">
                  <span className="text-xs text-gray-500 font-bold uppercase mb-2">Output</span>
                  <div className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-gray-300 font-mono text-sm flex-grow overflow-auto whitespace-pre-wrap">
                    {isOutputLoading ? <span className="animate-pulse">Executing...</span> : output}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">{activeProblem.title}</h3>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {activeProblem.description || activeProblem.content}
            </div>
          </div>
        )}
      </div>
    );
  }

  // View 2: The Category Detail (List of Problems inside a Category)
  if (selectedCategory) {
    if (selectedCategory.isCustomTcs) {
      return (
        <div className="max-w-7xl mx-auto mt-4 px-4 pb-12 animate-fade-in relative z-20">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 z-50 relative bg-black/50 px-4 py-2 rounded-full w-max"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Company Selection
          </button>
          {/* We must wrap TCSPractice since it acts like a full page */}
          <div className="-mt-16">
            <TCSPractice />
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto mt-8 animate-fade-in px-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Categories
        </button>

        <h2 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">
          {selectedCategory.category}
        </h2>

        {selectedCategory.problems.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Code className="text-electric-blue" /> Coding Questions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory.problems.map((prob, i) => (
                <div key={i} onClick={() => handleSelectProblem(prob)} className="bg-white/5 border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/10 hover:border-electric-blue transition-all group">
                  <h4 className="text-white font-bold group-hover:text-electric-blue transition-colors">{prob.title}</h4>
                  <span className="text-xs text-gray-500 mt-2 block uppercase">{prob.language} Code Available</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory.pdfs.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText className="text-red-500" /> PDF Resources</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {selectedCategory.pdfs.map((pdf, i) => (
                <a key={i} href={pdf.url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all">
                  <span className="text-white font-medium truncate">{pdf.title}</span>
                  <Download className="text-gray-400 w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        )}

        {selectedCategory.looseFiles.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="text-yellow-500" /> Theory & Concepts</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory.looseFiles.map((file, i) => (
                <div key={i} onClick={() => handleSelectProblem(file)} className="bg-white/5 border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/10 hover:border-electric-blue transition-all">
                  <h4 className="text-white font-medium">{file.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // View 1: The Main Dashboard (Grid of Categories)
  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Company & Interview Prep
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Massive collection of previously asked interview questions, coding rounds, and aptitude tests for top IT companies and specific tech roles.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-electric-blue transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center mb-4 border border-white/5 group-hover:border-electric-blue/50 transition-colors">
              <Building2 className="text-electric-blue w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{cat.category}</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {cat.problems.length > 0 && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{cat.problems.length} Coding</span>}
              {cat.looseFiles.length > 0 && <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{cat.looseFiles.length} Theory</span>}
              {cat.pdfs.length > 0 && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">{cat.pdfs.length} PDFs</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;
