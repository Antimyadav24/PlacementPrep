import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingStates';
import { Target, Clock, BookOpen, ChevronRight, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const MockTest = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [mockTests, setMockTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMockTests = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/mock-tests');
      setMockTests(res.data || []);
    } catch (err) {
      console.error("Error fetching mock tests:", err);
      toast.error("Failed to load mock tests. Using sample tests.");
      // Fallback
      setMockTests(getFallbackMockTests());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, [api]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Assessment</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Mock Test <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-purple-500">Centre</span></h1>
            <p className="text-gray-400 max-w-2xl text-lg">Simulate the real exam experience with timed tests. Real-time scores and ranking analytics are generated instantly.</p>
          </div>
          <motion.div 
             whileHover={{ scale: 1.05 }}
             className="bg-gradient-to-br from-electric-blue/10 to-purple-500/10 border border-white/10 p-5 rounded-[24px] flex items-center gap-5 shadow-2xl backdrop-blur-md"
          >
             <div className="p-3 bg-white/5 rounded-xl border border-white/10">
               <Award className="w-8 h-8 text-electric-blue" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">National Percentile</p>
                <p className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Top 5%</p>
             </div>
          </motion.div>
        </div>

        {/* Timed Test Warning */}
        <div className="mb-10 bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl flex gap-4 items-center">
          <ShieldAlert className="w-8 h-8 text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            <strong>Important Rules:</strong> These are strictly timed tests. Once started, you cannot pause or close the browser tab without losing progress. 
            <span className="text-electric-blue font-semibold"> No study materials, PDF notes, or personal notes will be accessible during the active test.</span>
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center"><LoadingSpinner size="lg" /></div>
        ) : mockTests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mockTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card h-full relative overflow-hidden group hover:border-electric-blue/40 transition-all p-8 flex flex-col justify-between rounded-[32px] shadow-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-electric-blue/5 rounded-bl-[100px] -z-10 transition-all group-hover:scale-110" />
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Target className="w-3 h-3" /> Exam Simulation
                      </span>
                      <span className={`text-xxs font-extrabold uppercase px-3 py-1 rounded-full ${
                        test.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-extrabold text-white mb-3 leading-tight group-hover:text-electric-blue transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                      {test.description || "A custom placement evaluation test set up by administration."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex flex-wrap gap-6 mb-8 text-gray-400 text-sm font-semibold">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <BookOpen className="w-4 h-4 text-electric-blue" />
                        <span>{test.questions ? test.questions.length : 10} Qs</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <Clock className="w-4 h-4 text-electric-blue" />
                        <span>{test.timeLimit} Mins</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-2">
                      <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-[#040614] bg-gray-800 flex items-center justify-center overflow-hidden shadow-sm">
                             <img src={`https://i.pravatar.cc/150?u=${test.id + i}`} alt="User" />
                          </div>
                        ))}
                        <span className="w-10 h-10 rounded-full border-2 border-[#040614] bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] text-white font-bold">
                          +1k
                        </span>
                      </div>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(`/test/mock/${test.id}`)}
                        className="group/btn text-sm font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,191,255,0.2)]"
                      >
                        Start Test
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Target className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">No mock tests have been configured by the admin yet.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

const getFallbackMockTests = () => [
  { id: 1, title: 'TCS NQT Mock Assessment 1', description: 'A standard evaluation for TCS recruitment including Quantitative Aptitude, Logical Reasoning, and Java concepts.', timeLimit: 20, difficulty: 'Medium', questions: [1,2,3,4,5,6,7,8,9,10] },
  { id: 2, title: 'Google Prep Mock Test', description: 'Contains challenging questions in Operating Systems, Networks, and Data Structures.', timeLimit: 30, difficulty: 'Hard', questions: [1,2,3,4,5,6,7,8,9,10] }
];

export default MockTest;
