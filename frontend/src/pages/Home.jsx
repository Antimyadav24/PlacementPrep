import React from 'react';
import Hero from '../components/Hero';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BrainCircuit, Code, Target, Trophy, ShieldCheck, Zap, BookOpen, FolderOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Coding Problems', desc: 'LeetCode-style DSA problems with integrated code execution and explanations.', icon: Code, path: '/coding-practice', color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Assessments', desc: 'Real exam simulations with timers, auto-save, and performance analytics.', icon: Target, path: '/mock-test', color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Progress Tracking', desc: 'Track your daily consistency with our Github-style activity heatmap.', icon: BrainCircuit, path: '/dashboard', color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Leaderboard', desc: 'Compete globally. Track your rank and accuracy against other candidates.', icon: Trophy, path: '/leaderboard', color: 'text-accent', bg: 'bg-accent/10' },
  ];

  const stats = [
    { value: '300+', label: 'Coding Problems' },
    { value: '100+', label: 'Mock Assessments' },
    { value: '1M+', label: 'Submissions' },
    { value: '50k+', label: 'Active Students' },
  ];

  return (
    <PageTransition>
      <div className="pb-24">
        <Hero />

        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center border-border">
                <p className="text-3xl font-extrabold text-accent">{s.value}</p>
                <p className="text-sm text-muted mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">Everything You Need to Crack Placements</h2>
            <p className="text-muted max-w-2xl mx-auto">Master data structures, practice mock assessments, and climb the leaderboard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => navigate(f.path)}
              >
                <Card className="glass-card h-full group cursor-pointer relative overflow-hidden border border-border hover:border-accent/50 transition-all shadow-none">
                  <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-6 shadow-inner`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-muted mb-6 leading-relaxed text-sm">{f.desc}</p>
                  <div className="flex items-center text-accent font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Explore <Zap className="w-4 h-4 ml-1 fill-accent" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-surface border-y border-border py-20 mt-10">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
            {[
              { title: 'Heatmap & Streaks', desc: 'Stay motivated with daily goals, streaks and Github-style activity tracking.', icon: Zap },
              { title: 'Secure Authentication', desc: 'Industry standard security with Clerk. No demo accounts — fully production ready.', icon: ShieldCheck },
              { title: 'Integrated Workspace', desc: 'Write, run, and evaluate code directly in the browser with our premium IDE.', icon: Code },
            ].map((h, i) => (
              <div key={i} className="flex gap-6">
                <div className="p-3 bg-accent/10 rounded-xl text-accent h-fit"><h.icon className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-2 tracking-tight">{h.title}</h4>
                  <p className="text-muted leading-relaxed text-sm">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[32px] p-12 md:p-24 relative overflow-hidden border border-border shadow-2xl bg-black"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-50" />
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 relative z-10 tracking-tight">Ready to land your <br/><span className="text-accent">dream job?</span></h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">Join PlacePrep today and elevate your coding skills with our professional workspace.</p>
            <Button 
              variant="primary"
              onClick={() => navigate('/sign-up')} 
              className="relative z-10 text-lg px-8 py-3"
            >
              Start Practicing Now
            </Button>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
