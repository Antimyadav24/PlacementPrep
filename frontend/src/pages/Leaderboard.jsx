import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import { Trophy, Medal, Search, CalendarDays } from 'lucide-react';
import { Skeleton } from '../components/ui/LoadingStates';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const api = useApi();
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('global'); // 'global', 'weekly', 'monthly'
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/results/leaderboard?period=${period}`);
      setLeaders(res.data || []);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setLeaders(getMockLeaders());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [api, period]);

  const filteredLeaders = leaders.filter(l => 
    l.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex p-5 bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-full mb-6 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)]"
          >
            <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-lg" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Leaderboard</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">Compete with peer candidates. Ranks are compiled dynamically based on practice accuracy and mock tests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="p-6 text-center">
               <Medal className="w-10 h-10 text-accent mx-auto mb-4" />
               <h4 className="text-gray-500 text-sm font-bold uppercase mb-1">Weekly Filter</h4>
               <p className="text-xs text-gray-400">Ranks compile automatically relative to overall points scored.</p>
            </Card>

            <div className="bg-surface-hover border border-border rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Rank Period</p>
              <PeriodBtn label="Global Leaderboard" active={period === 'global'} onClick={() => setPeriod('global')} />
              <PeriodBtn label="Weekly Standings" active={period === 'weekly'} onClick={() => setPeriod('weekly')} />
              <PeriodBtn label="Monthly Standings" active={period === 'monthly'} onClick={() => setPeriod('monthly')} />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="lg:col-span-3">
             <Card className="glass-card overflow-hidden p-0 rounded-[32px] border border-border shadow-2xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -z-10" />
                <div className="p-6 md:p-8 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-6 bg-surface">
                   <h3 className="font-extrabold text-2xl text-primary capitalize flex items-center gap-3">
                     <Medal className="w-6 h-6 text-accent" />
                     {period} Standings
                   </h3>
                   <div className="relative w-full sm:w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-accent focus:bg-surface-hover transition-all text-primary shadow-inner"
                      />
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-surface-hover text-muted text-xs font-black uppercase tracking-widest">
                            <th className="px-8 py-5">Rank</th>
                            <th className="px-8 py-5">User Name</th>
                            <th className="px-8 py-5">Total Score</th>
                            <th className="px-8 py-5">Tests taken</th>
                            <th className="px-8 py-5">Accuracy Rate</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {isLoading ? (
                           [1,2,3,4,5].map(i => (
                             <tr key={i}>
                               <td className="px-8 py-5"><Skeleton className="h-6 w-8" /></td>
                               <td className="px-8 py-5"><div className="flex gap-3"><Skeleton className="h-10 w-10 circle" /><Skeleton className="h-6 w-32 mt-2" /></div></td>
                               <td className="px-8 py-5"><Skeleton className="h-6 w-16" /></td>
                               <td className="px-8 py-5"><Skeleton className="h-6 w-12" /></td>
                               <td className="px-8 py-5"><Skeleton className="h-6 w-12" /></td>
                             </tr>
                           ))
                         ) : filteredLeaders.length > 0 ? (
                            filteredLeaders.map((user, idx) => (
                              <motion.tr 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={idx} 
                                className="hover:bg-surface-hover transition-colors group relative"
                              >
                                 <td className="px-8 py-5">
                                    <div className={`
                                      w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm
                                      ${idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 
                                        idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-[0_0_15px_rgba(156,163,175,0.5)]' : 
                                        idx === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-black shadow-[0_0_15px_rgba(217,119,6,0.5)]' : 
                                        'text-muted bg-surface-hover border border-border'}
                                    `}>
                                       {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : idx + 1}
                                    </div>
                                 </td>
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 rounded-full border-2 border-border bg-gradient-to-tr from-accent to-accent-hover flex items-center justify-center text-primary font-extrabold shadow-lg text-lg">
                                          {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                                       </div>
                                       <span className="font-extrabold text-primary text-base group-hover:text-accent transition-colors">{user.fullName}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 font-black text-primary text-lg">{user.totalScore > 0 ? user.totalScore : '-'}</td>
                                 <td className="px-8 py-5 font-bold text-muted">{user.testCount > 0 ? user.testCount : '-'}</td>
                                 <td className="px-8 py-5">
                                    <span className={`px-3 py-1.5 rounded-lg font-black border ${user.accuracy > 0 ? 'bg-success/10 text-success border-success/20' : 'bg-surface text-muted border-border'}`}>
                                      {user.accuracy > 0 ? `${user.accuracy}%` : 'Unranked'}
                                    </span>
                                 </td>
                              </motion.tr>
                            ))
                         ) : (
                           <tr>
                             <td colSpan="5" className="text-center py-16 text-gray-500 font-medium">
                               No standings recorded for this period.
                             </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const PeriodBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 ${
      active 
        ? 'bg-accent/10 text-accent border border-accent/20' 
        : 'text-muted hover:text-primary hover:bg-surface border border-transparent'
    }`}
  >
    <CalendarDays className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const getMockLeaders = () => [
  { id: 1, fullName: 'Alex Johnson', totalScore: 2450, testCount: 42, accuracy: 92 },
  { id: 2, fullName: 'Sarah Williams', totalScore: 2320, testCount: 38, accuracy: 89 },
  { id: 3, fullName: 'Michael Chen', totalScore: 2210, testCount: 45, accuracy: 87 }
];

export default Leaderboard;
