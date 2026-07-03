import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-electric-blue text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The #1 Placement Preparation Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Master Your Career <br />
            <span className="bg-gradient-to-r from-electric-blue to-blue-400 bg-clip-text text-transparent">
              Beyond Expectations
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            Prepare for top tech companies with our comprehensive aptitude, technical, and mock test modules. Track your progress and compete globally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="primary" 
              className="w-full sm:w-auto text-lg px-10 py-4"
              onClick={() => navigate('/sign-up')}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button 
              variant="secondary" 
              className="w-full sm:w-auto text-lg px-10 py-4"
              onClick={() => navigate('/mock-test')}
            >
              Explore Tests
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>10,000+ Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Global Leaderboard</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
