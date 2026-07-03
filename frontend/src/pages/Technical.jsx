import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import { Code, Database, Server, Globe, Search, Terminal } from 'lucide-react';

const Technical = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Core Java', icon: Code, count: 400, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { name: 'DBMS', icon: Database, count: 350, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Operating Systems', icon: Terminal, count: 300, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'Computer Networks', icon: Globe, count: 250, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Data Structures', icon: Server, count: 500, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Technical MCQs</h1>
          <p className="text-gray-400 max-w-2xl">Validate your core engineering concepts. Selected questions from top recruitment exams.</p>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search topics (e.g. OOPS, Normalization, TCP/IP)..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-electric-blue outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Card 
              key={i} 
              className="cursor-pointer group hover:border-electric-blue/30 transition-all flex items-center gap-6 p-6"
              onClick={() => navigate(`/test/technical/${cat.name.toLowerCase().replace(' ', '-')}`)}
            >
              <div className={`w-16 h-16 ${cat.bg} ${cat.color} rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count}+ Practice Questions</p>
              </div>
              <button className="p-3 rounded-full bg-white/5 text-gray-400 group-hover:bg-electric-blue group-hover:text-white transition-all">
                <Code className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Technical;
