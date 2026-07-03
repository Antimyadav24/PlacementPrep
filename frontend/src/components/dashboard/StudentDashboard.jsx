import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle, TrendingUp, Clock, Target, Flame, Award, Zap, Trophy, BookOpen, ArrowRight, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityHeatmap from './ActivityHeatmap';

const BADGE_ICONS = { zap: Zap, award: Award, target: Target, flame: Flame, trophy: Trophy };

const StudentDashboard = ({ stats }) => {
  const navigate = useNavigate();
  const { user } = useAppAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">
            Welcome, <span className="text-accent">{user?.firstName || 'Explorer'}</span>!
          </motion.h1>
          <p className="text-gray-400 text-lg">Track your placement prep journey and performance analytics.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/coding-practice')} className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Continue Learning <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Flame} label="Streak" value={`${stats.streak || 0} days`} color="text-orange-400" bg="bg-orange-400/10" />
        <StatCard icon={Target} label="Daily Goal" value={`${stats.dailyProgress || 0}/${stats.dailyGoal || 20}`} color="text-blue-400" bg="bg-blue-400/10" />
        <StatCard icon={CheckCircle} label="Solved" value={stats.totalQuestionsSolved || 0} color="text-green-400" bg="bg-green-400/10" />
        <StatCard icon={Award} label="Rank" value={stats.rank > 0 ? `#${stats.rank}` : 'Unranked'} sub={stats.rank > 0 ? `of ${stats.totalUsers || 1}` : ''} color="text-purple-400" bg="bg-purple-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2 glass-card p-6 md:p-8 flex flex-col justify-between">
          <ActivityHeatmap />
        </Card>

        <div className="space-y-6">
          {/* Difficulty Progress */}
          <Card className="glass-card p-6">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2"><Code className="w-4 h-4 text-accent" /> Problems Solved</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-accent">Easy</span>
                  <span className="text-muted"><span className="text-primary font-bold">{stats.easySolved || 0}</span> / {stats.totalEasy || 50}</span>
                </div>
                <div className="w-full bg-surface rounded-full h-1.5">
                  <div className="bg-accent h-1.5 rounded-full" style={{ width: `${Math.min(100, ((stats.easySolved || 0)/(stats.totalEasy || 50))*100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-warning">Medium</span>
                  <span className="text-muted"><span className="text-primary font-bold">{stats.mediumSolved || 0}</span> / {stats.totalMedium || 100}</span>
                </div>
                <div className="w-full bg-surface rounded-full h-1.5">
                  <div className="bg-warning h-1.5 rounded-full" style={{ width: `${Math.min(100, ((stats.mediumSolved || 0)/(stats.totalMedium || 100))*100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-danger">Hard</span>
                  <span className="text-muted"><span className="text-primary font-bold">{stats.hardSolved || 0}</span> / {stats.totalHard || 20}</span>
                </div>
                <div className="w-full bg-surface rounded-full h-1.5">
                  <div className="bg-danger h-1.5 rounded-full" style={{ width: `${Math.min(100, ((stats.hardSolved || 0)/(stats.totalHard || 20))*100)}%` }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="font-bold text-primary mb-4">Badges Earned</h3>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const earnedBadges = [...(stats.badges || [])];
                
                // Dynamic conditions
                earnedBadges.push({ name: 'Novice Coder', icon: 'Award' }); // Always show at least one to encourage them
                if (stats.totalSolved >= 10) earnedBadges.push({ name: 'Problem Solver', icon: 'Zap' });
                if (stats.totalSolved >= 50) earnedBadges.push({ name: 'Code Master', icon: 'Star' });
                if (stats.streak >= 3) earnedBadges.push({ name: '3 Day Streak', icon: 'Flame' });
                if (stats.streak >= 7) earnedBadges.push({ name: '7 Day Streak', icon: 'Flame' });

                return earnedBadges.map((b, i) => {
                  const Icon = BADGE_ICONS[b.icon] || Award;
                  return (
                    <span key={i} className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 dark:text-yellow-400 text-xs font-bold px-3 py-2 rounded-xl">
                      <Icon className="w-4 h-4" />{b.name}
                    </span>
                  );
                });
              })()}
            </div>
          </Card>
          <Card className="glass-card p-6">
            <h3 className="font-bold text-primary mb-3">Recommended Topics</h3>
            <div className="space-y-2">
              {stats.recommendedTopics?.map((t, i) => (
                <button key={i} onClick={() => navigate('/coding-practice')} className="w-full text-left px-3 py-2 rounded-lg bg-surface hover:bg-accent/10 text-sm text-muted hover:text-accent transition-all capitalize border border-border">
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="glass-card p-6">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-orange-400" />Recent Tests</h3>
        <div className="space-y-3">
          {stats.recentActivity?.length ? stats.recentActivity.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-surface border border-border">
              <div>
                <p className="font-bold text-primary capitalize">{item.moduleType} — {item.category?.replace('-', ' ')}</p>
                <p className="text-xs text-muted mt-1">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
              <span className="font-bold text-accent">{item.score}/{item.totalQuestions}</span>
            </div>
          )) : <p className="text-muted text-center py-6 text-sm">No recent activity. Solve your first problem today!</p>}
        </div>
      </Card>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <motion.div whileHover={{ y: -2 }}>
    <Card className="glass-card flex items-center gap-4 p-5 hover:border-border transition-all rounded-xl shadow-none">
      <div className={`p-3 rounded-xl ${bg} ${color}`}><Icon className="w-6 h-6" /></div>
      <div>
        <p className="text-[10px] text-muted uppercase font-semibold tracking-widest mb-0.5">{label}</p>
        <p className="text-xl font-bold text-primary tracking-tight">{value}{sub && <span className="text-xs text-muted ml-1 font-semibold">{sub}</span>}</p>
      </div>
    </Card>
  </motion.div>
);

export default StudentDashboard;
