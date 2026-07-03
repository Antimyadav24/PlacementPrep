import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { ChevronLeft, ChevronRight, Eye, Code, FileText, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const TCSPractice = () => {
  const [activeTab, setActiveTab] = useState('coding');
  const [nqtQuestions, setNqtQuestions] = useState([]);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [nqtIdx, setNqtIdx] = useState(0);
  const [codingIdx, setCodingIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Coding states
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isOutputLoading, setIsOutputLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Reset state when switching questions
  useEffect(() => {
    if (codingQuestions[codingIdx]) {
      setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}`);
      setCustomInput('');
      setOutput('');
      setShowSolution(false);
    }
  }, [codingIdx, codingQuestions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [nqtRes, codingRes] = await Promise.all([
          axios.get('/data/tcs-nqt.json').catch(() => ({ data: [] })),
          axios.get('/data/tcs-coding.json').catch(() => ({ data: [] }))
        ]);
        setNqtQuestions(nqtRes.data || []);
        setCodingQuestions(codingRes.data || []);
      } catch (err) {
        console.error('Error fetching TCS data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  const renderNQT = () => {
    const q = nqtQuestions[nqtIdx];
    if (!q) return <div className="text-gray-400 p-8 text-center bg-white/5 rounded-2xl">No NQT questions available.</div>;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
          <span className="text-gray-400 font-medium">Question {nqtIdx + 1} of {nqtQuestions.length}</span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setNqtIdx(Math.max(0, nqtIdx - 1)); setShowHint(false); }} disabled={nqtIdx === 0}>
              <ChevronLeft className="w-5 h-5" /> Prev
            </Button>
            <Button variant="primary" onClick={() => { setNqtIdx(Math.min(nqtQuestions.length - 1, nqtIdx + 1)); setShowHint(false); }} disabled={nqtIdx === nqtQuestions.length - 1}>
              Next <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-electric-blue"></div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FileText className="text-electric-blue" />
            {q.title}
          </h3>
          
          {q.problem && (
            <div className="mb-6 bg-black/20 p-6 rounded-xl border border-white/5">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">{q.problem}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {q.sampleInput && (
              <div className="bg-[#0d1117] p-5 rounded-xl border border-white/10">
                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 block">Sample Input</span>
                <pre className="font-mono text-sm text-green-400 overflow-x-auto">{q.sampleInput}</pre>
              </div>
            )}
            {q.sampleOutput && (
              <div className="bg-[#0d1117] p-5 rounded-xl border border-white/10">
                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 block">Sample Output</span>
                <pre className="font-mono text-sm text-green-400 overflow-x-auto">{q.sampleOutput}</pre>
              </div>
            )}
          </div>
          
          {q.hint && (
            <div className="mt-8 border-t border-white/10 pt-6">
              {!showHint ? (
                <button 
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-2 text-electric-blue hover:text-blue-400 transition-colors font-medium bg-blue-500/10 px-4 py-2 rounded-lg"
                >
                  <Eye className="w-5 h-5" /> Reveal Hint / Explanation
                </button>
              ) : (
                <div className="p-5 border border-blue-500/30 bg-blue-500/10 rounded-xl animate-fade-in">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Hint
                  </h4>
                  <p className="text-blue-100 leading-relaxed">{q.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const runCode = async () => {
    if (!code) return;
    setIsOutputLoading(true);
    setOutput('');
    try {
      const response = await axios.post('https://wandbox.org/api/compile.json', {
        compiler: 'gcc-13.2.0',
        code: code,
        stdin: customInput
      });
      const data = response.data;
      if (data.compiler_error) {
        setOutput(data.compiler_error);
      } else {
        setOutput(data.program_message || 'Code executed successfully with no output.');
      }
    } catch (err) {
      setOutput('Error executing code. Please try again.');
    } finally {
      setIsOutputLoading(false);
    }
  };

  const formatDescription = (text) => {
    if (!text) return null;
    const keywords = ['Example 1:', 'Example 2:', 'Input:', 'Input :', 'Output:', 'Output :', 'Explanation:', 'Constraints:', 'Constraints :'];
    let formattedText = text;
    keywords.forEach(kw => {
      const regex = new RegExp(`(${kw})`, 'gi');
      formattedText = formattedText.replace(regex, '|||$1|||');
    });
    
    return formattedText.split('|||').map((part, i) => {
      const isKeyword = keywords.some(kw => part.toLowerCase() === kw.toLowerCase());
      if (isKeyword) {
        return <span key={i} className="text-electric-blue font-bold mt-4 mb-1 block">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderCoding = () => {
    const q = codingQuestions[codingIdx];
    if (!q) return <div className="text-gray-400 p-8 text-center bg-white/5 rounded-2xl">No Coding questions available.</div>;

    return (
      <div className="flex flex-col lg:flex-row gap-6 min-h-[700px]">
        {/* Left Pane: Problem List & Description */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 block">Select Problem</label>
            <select 
              className="w-full bg-black/50 border border-white/10 text-white rounded-lg p-3 outline-none focus:border-electric-blue transition-colors"
              value={codingIdx}
              onChange={(e) => setCodingIdx(Number(e.target.value))}
            >
              {codingQuestions.map((cq, i) => (
                <option key={cq.id} value={i}>
                  {i + 1}. {cq.fileName.replace('.cpp', '').replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow bg-white/5 border border-white/10 rounded-xl p-6 overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Code className="text-green-500" />
              {q.fileName.replace('.cpp', '').replace(/_/g, ' ')}
            </h3>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
              {formatDescription(q.description)}
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor */}
        <div className="w-full lg:w-2/3 bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <span className="text-gray-300 font-mono text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="ml-2">solution.cpp</span>
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
              defaultLanguage="cpp"
              theme="vs-dark"
              value={showSolution ? (q.solution || '// Solution not available') : code}
              onChange={(val) => { if (!showSolution) setCode(val); }}
              options={{
                readOnly: showSolution,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* I/O Console */}
          <div className="bg-black/30 border-t border-white/10 flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 border-r border-white/10 p-3 flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase mb-2">Custom Input</span>
              <textarea 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white font-mono text-sm outline-none focus:border-electric-blue flex-grow resize-none min-h-[100px]"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input here..."
              ></textarea>
            </div>
            <div className="w-full sm:w-1/2 p-3 flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase mb-2">Output</span>
              <div className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-gray-300 font-mono text-sm flex-grow overflow-auto min-h-[100px] whitespace-pre-wrap">
                {isOutputLoading ? <span className="animate-pulse text-gray-500">Executing code...</span> : (output || 'Output will appear here...')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 animate-fade-in pb-12">
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-8 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === 'coding' ? 'bg-electric-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            TCS Coding Platform
          </button>
          <button
            onClick={() => setActiveTab('nqt')}
            className={`px-8 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === 'nqt' ? 'bg-electric-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            NQT Logic & Aptitude
          </button>
        </div>
      </div>

      {activeTab === 'nqt' ? renderNQT() : renderCoding()}
    </div>
  );
};

export default TCSPractice;
