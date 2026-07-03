import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Users, Database, Target, Code, FileText, ShieldCheck, BarChart3, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../ui/LoadingStates';
import { motion } from 'framer-motion';

const AdminOverview = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ users: 0, questions: 0, mockTests: 0, coding: 0, materials: 0, announcements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [u, q, m, c, s, a] = await Promise.allSettled([
          api.get('/admin/users'), api.get('/admin/questions'), api.get('/admin/mock-tests'),
          api.get('/admin/coding-problems'), api.get('/admin/study-materials'), api.get('/admin/announcements'),
        ]);
        setCounts({
          users: u.status === 'fulfilled' ? u.value.data?.length || 0 : 0,
          questions: q.status === 'fulfilled' ? q.value.data?.length || 0 : 0,
          mockTests: m.status === 'fulfilled' ? m.value.data?.length || 0 : 0,
          coding: c.status === 'fulfilled' ? c.value.data?.length || 0 : 0,
          materials: s.status === 'fulfilled' ? s.value.data?.length || 0 : 0,
          announcements: a.status === 'fulfilled' ? a.value.data?.length || 0 : 0,
        });
      } finally { setLoading(false); }
    };
    load();
  }, [api]);

  if (loading) return <div className="p-10"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Analytics</span>
          </motion.h1>
          <p className="text-gray-400 text-lg">Platform overview and quick actions</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin')}>Open Admin Panel</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {[
          { icon: Users, label: 'Users', value: counts.users, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
          { icon: Database, label: 'MCQs', value: counts.questions, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
          { icon: Target, label: 'Mock Tests', value: counts.mockTests, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
          { icon: Code, label: 'Coding', value: counts.coding, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
          { icon: FileText, label: 'Resources', value: counts.materials, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
          { icon: Megaphone, label: 'Alerts', value: counts.announcements, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className={`glass-card p-6 text-center hover:border-white/20 transition-all rounded-[24px] shadow-lg relative overflow-hidden group`}>
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${s.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${s.bg} ${s.color} border ${s.border} flex items-center justify-center shadow-inner`}>
                <s.icon className="w-7 h-7" />
              </div>
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-electric-blue" />Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="secondary" onClick={() => navigate('/admin')}>Manage Questions</Button>
          <Button variant="secondary" onClick={() => navigate('/admin')}>Upload Resources</Button>
          <Button variant="secondary" onClick={() => navigate('/admin')}>Post Announcement</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
