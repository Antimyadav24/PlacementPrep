import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import { BrainCircuit, Calculator, MessageSquare, Lightbulb, Search } from 'lucide-react';

const Aptitude = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Quantitative', icon: Calculator, count: 500, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Logical Reasoning', icon: BrainCircuit, count: 450, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Verbal Ability', icon: MessageSquare, count: 300, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'Data Interpretation', icon: Lightbulb, count: 200, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Aptitude Practice</h1>
          <p className="text-gray-400 max-w-2xl">Master the fundamentals of problem solving. Choose a category to begin your practice session.</p>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search topics (e.g. Percentage, Blood Relations)..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-electric-blue outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Card 
              key={i} 
              className="cursor-pointer group hover:border-electric-blue/30 transition-all flex flex-col items-center text-center p-8"
              onClick={() => navigate(`/test/aptitude/${cat.name.toLowerCase().replace(' ', '-')}`)}
            >
              <div className={`w-16 h-16 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{cat.count}+ Practice Questions</p>
              <button className="w-full py-3 rounded-xl bg-white/5 text-gray-300 group-hover:bg-electric-blue group-hover:text-white font-semibold transition-all">
                Practice Now
              </button>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Aptitude;
