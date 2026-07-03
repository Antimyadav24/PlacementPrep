import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import Card from '../ui/Card';
import { LoadingSpinner, Skeleton } from '../ui/LoadingStates';
import { BookOpen, FileText, Video, Bookmark, CheckCircle, ExternalLink, X, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  { id: 'Aptitude', label: 'Aptitude' },
  { id: 'Java', label: 'Core Java' },
  { id: 'React', label: 'React JS' },
  { id: 'SQL', label: 'SQL' },
  { id: 'Data Structures', label: 'DSA' },
];

const getAptitudeTopic = (filename) => {
  const f = filename.toLowerCase();
  if (f.includes('probability')) return 'Probability';
  if (f.includes('lcm') || f.includes('hcf')) return 'LCM & HCF';
  if (f.includes('train')) return 'Trains & Time';
  if (f.includes('bod') || f.includes('bodmas')) return 'BODMAS';
  if (f.includes('unit') || f.includes('digit') || f.includes('remainder') || f.includes('divisibility')) return 'Number System';
  if (f.includes('log')) return 'Logarithms';
  if (f.includes('pop') || f.includes('age')) return 'Population & Ages';
  if (f.includes('clock') || f.includes('cal')) return 'Clock & Calendar';
  if (f.includes('men') || f.includes('squre')) return 'Mensuration';
  return 'General Formulas';
};

const LearnMode = () => {
  const api = useApi();
  const [materials, setMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [aptitudeImages, setAptitudeImages] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Aptitude');
  const [tab, setTab] = useState('notes');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('learn-progress') || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [matRes, bmRes, imgRes] = await Promise.all([
          api.get('/study-materials').catch(() => ({ data: [] })),
          api.get('/bookmarks').catch(() => ({ data: [] })),
          fetch('/data/aptitude-formulas.json').then(res => res.json()).catch(() => [])
        ]);
        setMaterials(matRes.data || []);
        setBookmarks(bmRes.data || []);
        setAptitudeImages(imgRes || []);
      } catch {
        toast.error('Failed to load study materials');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [api]);

  const filtered = materials.filter((m) => m.category === category);
  const pdfs = filtered.filter((m) => m.type === 'PDF' || m.type === 'APTITUDE_PDF');
  const videos = filtered.filter((m) => m.type === 'VIDEO');
  const articles = filtered.filter((m) => m.type === 'ARTICLE' || m.type === 'INTERVIEW_NOTES');

  const markComplete = (id) => {
    const next = { ...progress, [id]: true };
    setProgress(next);
    localStorage.setItem('learn-progress', JSON.stringify(next));
    toast.success('Progress saved!');
  };

  const completedCount = Object.keys(progress).filter((k) => progress[k]).length;
  const progressPct = materials.length ? Math.round((completedCount / materials.length) * 100) : 0;

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;

  const groupedAptitude = aptitudeImages.reduce((acc, img) => {
    const topic = getAptitudeTopic(img);
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(img);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* LIGHTBOX OVERLAY */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 bg-white/10 p-3 rounded-full text-white hover:bg-red-500 hover:text-white transition-all shadow-xl" onClick={(e) => { e.stopPropagation(); setLightboxImg(null); }}>
            <X className="w-6 h-6" />
          </button>
          <img src={`/aptitude-formulas/${lightboxImg}`} alt="Formula" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          <p className="text-white mt-4 font-bold text-xl">{lightboxImg.replace(/\.[^/.]+$/, "")}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR */}
        <div className="w-full lg:w-64 space-y-2 sticky top-24">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`w-full text-left px-5 py-3.5 rounded-xl transition-all font-bold ${category === c.id ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-black text-white">{CATEGORIES.find(c => c.id === category)?.label}</h2>
              <p className="text-gray-400 mt-1">{progressPct}% Overall Completion</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 mb-8">
            {[{ id: 'notes', icon: FileText, label: 'Formulas & Notes' }, { id: 'videos', icon: Video, label: 'Videos' }, { id: 'topics', icon: BookOpen, label: 'Explanations' }, { id: 'pyq', icon: Bookmark, label: 'PYQs & Bookmarks' }].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-electric-blue/15 text-electric-blue' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>

          {tab === 'notes' && (
            <div className="animate-fade-in">
              {category === 'Aptitude' && aptitudeImages.length > 0 ? (
                <div className="space-y-12">
                  {Object.entries(groupedAptitude).map(([topic, imgs]) => (
                    <div key={topic} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <div className="w-2 h-8 bg-electric-blue rounded-full"></div>
                        {topic}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {imgs.map((img, idx) => (
                          <Card key={idx} className="glass-card overflow-hidden border border-white/10 hover:border-electric-blue transition-all group cursor-pointer" onClick={() => setLightboxImg(img)}>
                            <div className="relative aspect-square bg-black/40 overflow-hidden">
                              <img 
                                src={`/aptitude-formulas/${img}`} 
                                alt={img} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                                <Search className="text-white w-8 h-8 mb-2 transform group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">View Full</span>
                              </div>
                            </div>
                            <div className="p-3 bg-black/20 text-center border-t border-white/5">
                              <span className="text-xs font-bold text-gray-300 truncate block">{img.replace(/\.[^/.]+$/, "")}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : pdfs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {pdfs.map((m) => (
                    <Card key={m.id} className="glass-card p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-red-500/20 rounded-lg"><FileText className="w-5 h-5 text-red-400" /></div>
                          <h4 className="font-bold text-white">{m.title}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{m.content}</p>
                      </div>
                      <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                        <a href={m.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-electric-blue hover:text-blue-400 flex items-center gap-1">
                          Open PDF <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => markComplete(m.id)} className="text-xs font-bold text-green-400 hover:text-green-300 ml-auto">Mark Complete</button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState message="No notes or formulas for this topic yet." />
              )}
            </div>
          )}

          {tab === 'videos' && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              {videos.length ? videos.map((m) => (
                <Card key={m.id} className="glass-card p-4 overflow-hidden">
                  <h4 className="font-bold text-white mb-3">{m.title}</h4>
                  {m.url && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black/40 mb-3">
                      <iframe src={m.url} title={m.title} className="w-full h-full" allowFullScreen />
                    </div>
                  )}
                  <p className="text-sm text-gray-400">{m.content}</p>
                  <button onClick={() => markComplete(m.id)} className="mt-3 text-xs font-bold text-green-400">Mark Watched</button>
                </Card>
              )) : <EmptyState message="No videos for this topic yet." />}
            </div>
          )}

          {tab === 'topics' && (
            <div className="space-y-4 animate-fade-in">
              {articles.length ? articles.map((m) => (
                <Card key={m.id} className="glass-card p-6 border-white/10 hover:border-electric-blue transition-colors">
                  <h4 className="font-bold text-white text-xl mb-3">{m.title}</h4>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  <button onClick={() => markComplete(m.id)} className="mt-4 text-sm font-bold text-electric-blue hover:text-white transition-colors">Mark as Read</button>
                </Card>
              )) : <EmptyState message="No topic explanations yet. Check Resources page." />}
            </div>
          )}

          {tab === 'pyq' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-gray-400 text-sm mb-6">Bookmarked questions from Practice mode appear here.</p>
              {bookmarks.length ? bookmarks.map((b) => (
                <Card key={b.id} className="glass-card p-5 flex items-center gap-4">
                  <Bookmark className="w-6 h-6 text-orange-400 fill-orange-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white text-lg line-clamp-2">{b.question?.text || 'Question'}</p>
                    <p className="text-sm text-gray-500 mt-1">{b.question?.category} · {b.question?.difficulty}</p>
                  </div>
                </Card>
              )) : <EmptyState message="No bookmarked questions. Bookmark while practicing!" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <Card className="glass-card p-12 text-center w-full border-dashed border-2 border-white/10">
    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6 opacity-50" />
    <h3 className="text-xl font-bold text-white mb-2">Nothing Here Yet</h3>
    <p className="text-gray-400">{message}</p>
  </Card>
);

export default LearnMode;
