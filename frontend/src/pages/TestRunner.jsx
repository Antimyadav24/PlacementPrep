import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useApi from '../hooks/useApi';
import { useAppAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingStates';
import ConfirmModal from '../components/ConfirmModal';

const TestRunner = () => {
  const { moduleType, category } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { user } = useAppAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 mins
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [rank, setRank] = useState(null);

  const storageKey = `test-autosave-${moduleType}-${category}`;

  const handleAnswer = (optionIdx) => {
    const current = questions[currentIdx];
    if (!current) return;
    setAnswers((prev) => {
      const next = { ...prev, [current.id]: optionIdx };
      localStorage.setItem(storageKey, JSON.stringify({ answers: next, marked: [...markedForReview], currentIdx }));
      return next;
    });
  };

  const toggleMarked = () => {
    const current = questions[currentIdx];
    if (!current) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      next.has(current.id) ? next.delete(current.id) : next.add(current.id);
      localStorage.setItem(storageKey, JSON.stringify({ answers, marked: [...next], currentIdx }));
      return next;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setShowSubmitModal(false);
    setIsSubmitting(true);
    
    try {
      const correctCount = questions.filter(q => {
        const selected = answers[q.id];
        const correctIdx = q.options ? q.options.indexOf(q.correctAnswer) : { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[q.correctOption];
        return selected === correctIdx;
      }).length;

      const submission = {
        moduleType,
        category,
        score: correctCount,
        totalQuestions: questions.length,
        email: user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '',
        fullName: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous User'
      };
      
      const res = await api.post('/results/submit', submission);
      const data = { ...res.data, percentage: Math.round((correctCount / questions.length) * 100), moduleType, category };
      setResult(data);
      localStorage.removeItem(storageKey);
      try {
        const lb = await api.get('/results/leaderboard');
        const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
        const idx = (lb.data || []).findIndex((e) => e.fullName === data.user?.fullName || e.fullName === submission.fullName);
        setRank(idx >= 0 ? idx + 1 : null);
      } catch { /* rank optional */ }
      toast.success("Test submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting test results.");
      setResult({ score: 0, totalQuestions: questions.length });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, questions, answers, moduleType, category, user, api]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        if (moduleType === 'mock' && !isNaN(Number(category))) {
          // It is an admin-created custom Mock Test!
          const res = await api.get(`/mock-tests/${category}`);
          const test = res.data;
          setQuestions(test.questions || []);
          setTimeLeft((test.timeLimit || 20) * 60);
        } else {
          // Standard practice test route
          const res = await api.get(`/questions/${moduleType}?category=${category}`);
          const data = res.data || [];
          if (data.length === 0) {
            setQuestions(getMockQuestions());
            setTimeLeft(10 * 60);
          } else {
            setQuestions(data);
            setTimeLeft(data.length * 60); // 1 min per question
          }
        }
      } catch (err) {
        console.error("Fetch questions error:", err);
        toast.error("Failed to load questions. Using sample test data.");
        setQuestions(getMockQuestions());
        setTimeLeft(10 * 60);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const { answers: a, marked: m, currentIdx: c } = JSON.parse(saved);
        if (a) setAnswers(a);
        if (m) setMarkedForReview(new Set(m));
        if (c !== undefined) setCurrentIdx(c);
      } catch { /* ignore */ }
    }
  }, [moduleType, category, api, storageKey]);

  // Leaving page warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!result && !isSubmitting && questions.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [result, isSubmitting, questions.length]);

  // Timer logic
  useEffect(() => {
    if (isLoading || isSubmitting || result || questions.length === 0) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isSubmitting, result, questions.length, handleSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (result) return <ResultView result={result} rank={rank} navigate={navigate} />;

  const q = questions[currentIdx];

  if (!q) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy text-center p-6">
        <HelpCircle className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Questions Found</h2>
        <p className="text-gray-400 mb-8">We couldn't find any questions for this category.</p>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] bg-navy flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-40 bg-gray-900 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{moduleType.replace('-', ' ')} - {category.replace('-', ' ')}</h2>
            <p className="text-xs text-gray-500">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          
          <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border ${timeLeft < 300 ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white'}`}>
             <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'animate-pulse' : ''}`} />
             <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>

          <Button variant="danger" className="px-6" onClick={() => setShowSubmitModal(true)}>
             Finish Test
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          {/* Main Question Area */}
          <div className="flex-grow p-6 md:p-10 overflow-y-auto">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-start gap-4 mb-8">
                <span className="bg-electric-blue/20 text-electric-blue font-bold px-3 py-1 rounded-lg">Q{currentIdx + 1}</span>
                <h3 className="text-2xl font-semibold text-white leading-relaxed">
                  {q.question || q.text}
                </h3>
              </div>

              <div className="space-y-4 mb-10">
                {(q.options || [q.optionA, q.optionB, q.optionC, q.optionD]).map((opt, idx) => {
                  const isSelected = answers[q.id] === idx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`
                        group p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4
                        ${isSelected ? 'bg-electric-blue/10 border-electric-blue' : 'bg-white/5 border-white/5 hover:border-white/20'}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-all
                        ${isSelected ? 'bg-electric-blue border-electric-blue text-white' : 'border-gray-700 text-gray-500 group-hover:border-gray-500'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`text-lg ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/10">
                 <Button 
                   variant="secondary" 
                   disabled={currentIdx === 0} 
                   onClick={() => setCurrentIdx(currentIdx - 1)}
                 >
                   <ChevronLeft className="w-5 h-5 mr-1" />
                   Previous
                 </Button>
                 
                 <Button 
                    variant="ghost" 
                    className={`${markedForReview.has(q.id) ? 'text-orange-400' : 'text-gray-500'}`}
                    onClick={toggleMarked}
                  >
                    <Flag className={`w-5 h-5 mr-1 ${markedForReview.has(q.id) ? 'fill-orange-400' : ''}`} />
                    {markedForReview.has(q.id) ? 'Marked' : 'Mark for Review'}
                 </Button>

                 <Button 
                   variant={currentIdx === questions.length - 1 ? 'primary' : 'secondary'} 
                   onClick={() => {
                     if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
                     else setShowSubmitModal(true);
                   }}
                 >
                   {currentIdx === questions.length - 1 ? 'Review & Submit' : 'Next'}
                   <ChevronRight className="w-5 h-5 ml-1" />
                 </Button>
              </div>
            </motion.div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="w-full lg:w-80 bg-gray-900/50 border-l border-white/10 p-6 overflow-y-auto">
             <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Question Palette</h4>
             <div className="grid grid-cols-5 gap-3">
                {questions.map((ques, i) => {
                  const isCurrent = currentIdx === i;
                  const isAnswered = answers[ques.id] !== undefined;
                  const isMarked = markedForReview.has(ques.id);

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-bold transition-all border
                        ${isCurrent ? 'border-electric-blue text-electric-blue bg-electric-blue/10 scale-110 z-10' : 
                          isAnswered ? 'bg-green-500 border-green-500 text-white' : 
                          isMarked ? 'bg-orange-500 border-orange-500 text-white' : 
                          'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'}
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                })}
             </div>

             <div className="mt-10 space-y-4 border-t border-white/10 pt-6">
                <LegendItem color="bg-green-500" label="Answered" />
                <LegendItem color="bg-orange-500" label="Marked" />
                <LegendItem color="bg-white/5" border="border-white/10" label="Not Visited" />
                <LegendItem color="bg-electric-blue/10" border="border-electric-blue" label="Current" />
             </div>
          </div>
        </div>

        <ConfirmModal 
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={handleSubmit}
          title="Finish Test?"
          message={`You have answered ${Object.keys(answers).length} out of ${questions.length} questions. Are you sure you want to submit?`}
          confirmText="Yes, Submit"
        />
      </div>
    </PageTransition>
  );
};

const LegendItem = ({ color, border = '', label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded ${color} ${border}`} />
    <span className="text-xs text-gray-400 font-medium">{label}</span>
  </div>
);

const downloadResultPdf = (result, rank) => {
  const pct = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;
  const html = `<html><head><title>Test Result</title></head><body style="font-family:Arial;padding:40px">
    <h1>PlacePrep Test Result</h1>
    <p><strong>Module:</strong> ${result.moduleType || 'Test'}</p>
    <p><strong>Category:</strong> ${result.category || '-'}</p>
    <p><strong>Score:</strong> ${result.score} / ${result.totalQuestions}</p>
    <p><strong>Percentage:</strong> ${pct}%</p>
    ${rank ? `<p><strong>Rank:</strong> #${rank}</p>` : ''}
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
  </body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `placeprep-result-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const ResultView = ({ result, rank, navigate }) => {
  const percentage = result.percentage ?? (result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0);
  
  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-navy">
        <Card className="w-full max-w-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-electric-blue/10 rounded-full blur-[80px] -z-10" />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${percentage >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>

          <h1 className="text-4xl font-extrabold text-white mb-2">Test Completed!</h1>
          <p className="text-gray-400 mb-10">Here is a summary of your performance.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Your Score</p>
                <p className="text-3xl font-extrabold text-white">{result.score} <span className="text-lg text-gray-600">/ {result.totalQuestions}</span></p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Percentage</p>
                <p className="text-3xl font-extrabold text-electric-blue">{percentage}%</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">{rank ? 'Your Rank' : 'Accuracy'}</p>
                <p className="text-3xl font-extrabold text-green-400">{rank ? `#${rank}` : `${percentage}%`}</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button variant="primary" className="px-10" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
             <Button variant="secondary" className="px-10" onClick={() => downloadResultPdf(result, rank)}>Download Result</Button>
             <Button variant="secondary" className="px-10" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

const getMockQuestions = () => [
  { 
    id: 'm1', 
    text: 'What is the full form of DBMS?', 
    optionA: 'Database Management System', 
    optionB: 'Data Base Micro System', 
    optionC: 'Database Meta System', 
    optionD: 'None of these', 
    correctOption: 'A' 
  },
  { 
    id: 'm2', 
    text: 'Which of the following is not a type of SQL constraint?', 
    optionA: 'NOT NULL', 
    optionB: 'UNIQUE', 
    optionC: 'PRIMARY KEY', 
    optionD: 'ALTERNATE KEY', 
    correctOption: 'D' 
  },
  { 
    id: 'm3', 
    text: 'Who is the father of Java programming language?', 
    optionA: 'Bjarne Stroustrup', 
    optionB: 'James Gosling', 
    optionC: 'Dennis Ritchie', 
    optionD: 'Guido van Rossum', 
    correctOption: 'B' 
  },
];

export default TestRunner;
