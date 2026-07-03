import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingStates';
import { FileText, Video, Map, FileUser, Code, BookOpen, MessageSquare, ExternalLink, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'ALL', label: 'All', icon: BookOpen },
  { id: 'PDF', label: 'PDF Library', icon: FileText },
  { id: 'VIDEO', label: 'YouTube', icon: Video },
  { id: 'INTERVIEW_NOTES', label: 'Interview Notes', icon: MessageSquare },
  { id: 'RESUME', label: 'Resume Templates', icon: FileUser },
  { id: 'ROADMAP', label: 'Roadmaps', icon: Map },
  { id: 'DSA_SHEET', label: 'DSA Sheets', icon: Code },
  { id: 'APTITUDE_PDF', label: 'Aptitude PDFs', icon: FileText },
];

const Resources = () => {
  const api = useApi();
  const [materials, setMaterials] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [tab, setTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [matRes, intRes] = await Promise.all([
          api.get('/study-materials'),
          api.get('/interview-resources'),
        ]);
        setMaterials(matRes.data || []);
        setInterviews(intRes.data || []);
      } catch { /* empty */ }
      finally { setLoading(false); }
    };
    load();
  }, [api]);

  const filtered = materials.filter((m) => {
    const matchTab = tab === 'ALL' || m.type === tab;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.category?.includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Assets</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Resources <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-purple-500">Library</span></h1>
            <p className="text-gray-400 text-lg max-w-2xl">PDFs, videos, roadmaps, DSA sheets, aptitude notes and interview guides.</p>
          </div>
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-electric-blue focus:bg-white/10 outline-none transition-all shadow-inner backdrop-blur-sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {TABS.map((t) => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${tab === t.id ? 'bg-electric-blue text-white shadow-[0_0_15px_rgba(0,191,255,0.4)]' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </motion.button>
          ))}
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.map((m) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={m.id}
              >
                <Card className="glass-card p-6 flex flex-col h-full group hover:border-electric-blue/40 hover:-translate-y-2 transition-all duration-300 rounded-[24px]">
                  <div className="flex items-center justify-between mb-4">
                     <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:bg-electric-blue/10 group-hover:border-electric-blue/30 transition-colors">
                       <FileText className="w-6 h-6 text-electric-blue" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider">{m.type?.replace('_', ' ')}</span>
                  </div>
                  <h3 className="font-extrabold text-white text-lg mb-2 leading-tight group-hover:text-electric-blue transition-colors">{m.title}</h3>
                  <p className="text-sm text-gray-400 flex-grow line-clamp-3 leading-relaxed">{m.content}</p>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-semibold text-gray-500 bg-white/5 px-2 py-1 rounded-md capitalize">{m.category?.replace('-', ' ')}</span>
                    {m.url && (
                      <a href={m.type === 'VIDEO' ? m.url : m.url || '#'} target="_blank" rel="noreferrer"
                        className="text-white text-sm font-bold flex items-center gap-1.5 hover:text-electric-blue transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-electric-blue/30">
                        Open <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {tab === 'INTERVIEW_NOTES' && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-6">Interview Guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {interviews.slice(0, 20).map((r) => (
                <Card key={r.id} className="glass-card p-5">
                  <span className="text-xs font-bold text-purple-400">{r.category}</span>
                  <h4 className="font-bold text-white mt-1">{r.title}</h4>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{r.content}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <Card className="glass-card p-16 text-center mt-8">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No resources found. Admin can upload from the Admin Panel.</p>
          </Card>
        )}
      </div>
    </PageTransition>
  );
};

export default Resources;
