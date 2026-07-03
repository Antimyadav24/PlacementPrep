import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingStates';
import { CheckCircle, XCircle, Bookmark, RotateCcw, Filter, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  { id: 'Aptitude', label: 'Aptitude' },
];

const PracticeQuestions = () => {
  const api = useApi();
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [difficulty, setDifficulty] = useState('ALL');
  const [category, setCategory] = useState('Aptitude');
  const [wrongIds, setWrongIds] = useState([]);
  const [retryMode, setRetryMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (category === 'Aptitude' || category === 'LiveAptitudeAPI') {
          const res = await fetch('/data/aptitude-api.json');
          let data = await res.json();
          // Assign random difficulties to make the filters work
          const difficulties = ['Easy', 'Medium', 'Hard'];
          data = (data || []).map((q, i) => ({
            ...q,
            difficulty: difficulties[i % 3]
          }));
          setQuestions(data);
          setIdx(0); setSelected(null); setChecked(false);
          return;
        }

        let url = '/questions/TECHNICAL';
        const catMap = { 'Java': 'core-java', 'React': 'react', 'SQL': 'sql', 'Data Structures': 'data-structures' };
        const backendCat = catMap[category] || '';
        if (backendCat) {
          url += `?category=${backendCat}`;
        }
        
        const res = await api.get(url);
        setQuestions(res.data || []);
        setIdx(0); setSelected(null); setChecked(false);
      } catch {
        toast.error('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [api, category]);

  useEffect(() => {
    let list = retryMode ? questions.filter((q) => wrongIds.includes(q.id)) : questions;
    if (difficulty !== 'ALL') list = list.filter((q) => q.difficulty === difficulty);
    setFiltered(list);
    setIdx(0); setSelected(null); setChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, difficulty, retryMode]);

  const q = filtered[idx];
  // Support both JSON array options and Spring Boot optionA/B/C/D format
  const qOptions = q ? (q.options || [q.optionA, q.optionB, q.optionC, q.optionD]) : [];
  let correctIdx = -1;
  if (q) {
    if (q.options && q.correctAnswer) {
      correctIdx = q.options.indexOf(q.correctAnswer);
    } else if (q.correctOption) {
      correctIdx = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[q.correctOption] ?? -1;
    }
  }
  const isCorrect = checked && selected === correctIdx;

  const handleCheck = async () => {
    if (selected === null || !q) return;
    setChecked(true);
    if (selected !== correctIdx) {
      setWrongIds((prev) => [...new Set([...prev, q.id])]);
    }
    try {
      await api.post('/results/submit', {
        moduleType: 'PRACTICE',
        category,
        score: selected === correctIdx ? 1 : 0,
        totalQuestions: 1,
      });
    } catch { /* silent tracking */ }
  };

  const toggleBookmark = async () => {
    if (!q) return;
    try {
      await api.post(`/bookmarks/toggle/${q.id}`);
      setBookmarked((prev) => {
        const next = new Set(prev);
        next.has(q.id) ? next.delete(q.id) : next.add(q.id);
        return next;
      });
      toast.success('Bookmark updated');
    } catch {
      toast.error('Bookmark failed');
    }
  };

  const next = () => {
    if (idx < filtered.length - 1) { setIdx(idx + 1); setSelected(null); setChecked(false); }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  if (!q) return (
    <Card className="glass-card p-12 text-center">
      <p className="text-gray-400 mb-4">{retryMode ? 'No wrong questions to retry!' : 'No questions found for this filter.'}</p>
      {retryMode && <Button variant="primary" onClick={() => setRetryMode(false)}>Back to All Questions</Button>}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-500" />
          {['ALL', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${difficulty === d ? 'bg-electric-blue text-white' : 'bg-white/5 text-gray-400'}`}>{d}</button>
          ))}
        </div>
        {wrongIds.length > 0 && (
          <button onClick={() => setRetryMode(!retryMode)} className="flex items-center gap-1 text-orange-400 text-sm font-bold hover:text-orange-300">
            <RotateCcw className="w-4 h-4" />{retryMode ? 'All Questions' : `Retry Wrong (${wrongIds.length})`}
          </button>
        )}
        <span className="text-sm text-gray-500 ml-auto">{idx + 1} / {filtered.length}</span>
      </div>

      <Card className="glass-card p-8">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-electric-blue/15 text-electric-blue text-xs font-bold px-3 py-1 rounded-full">{q.difficulty}</span>
          <button onClick={toggleBookmark} className="text-gray-400 hover:text-orange-400">
            <Bookmark className={`w-5 h-5 ${bookmarked.has(q.id) ? 'fill-orange-400 text-orange-400' : ''}`} />
          </button>
        </div>
        <h3 className="text-xl font-semibold text-white mb-8 leading-relaxed">{q.question}</h3>

        <div className="space-y-3 mb-8">
          {qOptions.map((opt, i) => {
            let cls = 'bg-white/5 border-white/10 hover:border-white/20';
            if (checked) {
              if (i === correctIdx) cls = 'bg-green-500/15 border-green-500';
              else if (i === selected) cls = 'bg-red-500/15 border-red-500';
            } else if (selected === i) cls = 'bg-electric-blue/15 border-electric-blue';
            return (
              <button key={i} disabled={checked} onClick={() => setSelected(i)}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${cls}`}>
                <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm">{String.fromCharCode(65 + i)}</span>
                <span className="text-white">{opt}</span>
                {checked && i === correctIdx && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                {checked && i === selected && i !== correctIdx && <XCircle className="w-5 h-5 text-red-400 ml-auto" />}
              </button>
            );
          })}
        </div>

        {checked && q.explanation && (
          <div className="p-4 rounded-xl bg-electric-blue/10 border border-electric-blue/20 mb-6">
            <p className="text-sm font-bold text-electric-blue mb-1">Explanation</p>
            <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="primary" onClick={checked ? next : handleCheck} disabled={(!checked && selected === null) || (checked && idx >= filtered.length - 1)}>
            {checked ? 'Next Question' : 'Check Answer'} 
            {checked && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
          {!checked && (
            <Button variant="secondary" onClick={next} disabled={idx >= filtered.length - 1}>
              Skip <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PracticeQuestions;
