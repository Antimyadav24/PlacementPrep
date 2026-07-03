import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import PageTransition from '../components/PageTransition';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Users, 
  Database, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  LayoutDashboard,
  X,
  Info,
  Menu,
  GraduationCap,
  FileText,
  Code,
  Trophy,
  Target,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const MCQ_CATEGORIES = [
  { id: 'quantitative', name: 'Quantitative Aptitude', module: 'APTITUDE' },
  { id: 'logical-reasoning', name: 'Logical Reasoning', module: 'APTITUDE' },
  { id: 'verbal-ability', name: 'Verbal Ability', module: 'APTITUDE' },
  { id: 'data-interpretation', name: 'Data Interpretation', module: 'APTITUDE' },
  { id: 'core-java', name: 'Core Java', module: 'TECHNICAL' },
  { id: 'dbms', name: 'DBMS', module: 'TECHNICAL' },
  { id: 'operating-systems', name: 'Operating Systems', module: 'TECHNICAL' },
  { id: 'computer-networks', name: 'Computer Networks', module: 'TECHNICAL' },
  { id: 'data-structures', name: 'Data Structures', module: 'TECHNICAL' }
];

const AdminDashboard = () => {
  const api = useApi();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [codingProblems, setCodingProblems] = useState([]);
  const [interviewResources, setInterviewResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Modals & Selection States
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showMockTestModal, setShowMockTestModal] = useState(false);
  const [showCodingModal, setShowCodingModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  // Form Value States
  const [questionForm, setQuestionForm] = useState({ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '', category: 'core-java', difficulty: 'Easy', moduleType: 'TECHNICAL', company: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'PDF', url: '', content: '', category: 'quantitative' });
  const [mockTestForm, setMockTestForm] = useState({ title: '', description: '', timeLimit: 20, difficulty: 'Medium', questions: [] });
  const [codingForm, setCodingForm] = useState({ title: '', difficulty: 'Easy', topic: 'Arrays', description: '', solutionCode: '', explanation: '' });
  const [interviewForm, setInterviewForm] = useState({ category: 'HR', title: '', content: '', company: 'General', authorName: 'Admin' });

  // Pagination & Filtering
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, resultsRes, questionsRes, materialsRes, testsRes, codingRes, interviewRes, annRes] = await Promise.allSettled([
        api.get('/admin/users'),
        api.get('/admin/results'),
        api.get('/admin/questions'),
        api.get('/admin/study-materials'),
        api.get('/admin/mock-tests'),
        api.get('/admin/coding-problems'),
        api.get('/admin/interview-resources'),
        api.get('/admin/announcements'),
      ]);
      const get = (r) => r.status === 'fulfilled' ? (r.value.data || []) : [];
      setUsers(get(usersRes));
      setResults(get(resultsRes));
      setQuestions(get(questionsRes));
      setMaterials(get(materialsRes));
      setMockTests(get(testsRes));
      setCodingProblems(get(codingRes));
      setInterviewResources(get(interviewRes));
      setAnnouncements(get(annRes));
    } catch (err) {
      console.error("Admin data fetch error:", err);
      toast.error("Failed to fetch administrative records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [api]);

  // Reset page when switching tabs or searching
  useEffect(() => {
    setCurrentPage(1);
    setSearch('');
  }, [activeTab]);

  // --- CRUD: QUESTIONS ---
  const handleOpenQuestion = (q = null) => {
    if (q) {
      setSelectedItem(q);
      setQuestionForm({ ...q, company: q.company || '' });
    } else {
      setSelectedItem(null);
      setQuestionForm({ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '', category: 'core-java', difficulty: 'Easy', moduleType: 'TECHNICAL', company: '' });
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/admin/questions/${selectedItem.id}`, questionForm);
        toast.success("Question updated successfully!");
      } else {
        await api.post('/admin/questions', questionForm);
        toast.success("Question created successfully!");
      }
      setShowQuestionModal(false);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to save question.");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success("Question deleted.");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // --- CRUD: STUDY MATERIALS ---
  const handleOpenMaterial = (m = null) => {
    if (m) {
      setSelectedItem(m);
      setMaterialForm(m);
    } else {
      setSelectedItem(null);
      setMaterialForm({ title: '', type: 'PDF', url: '', content: '', category: 'quantitative' });
    }
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/admin/study-materials/${selectedItem.id}`, materialForm);
        toast.success("Study material updated");
      } else {
        await api.post('/admin/study-materials', materialForm);
        toast.success("Study material added");
      }
      setShowMaterialModal(false);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to save material.");
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Delete this study material?")) return;
    try {
      await api.delete(`/admin/study-materials/${id}`);
      toast.success("Material deleted");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // --- CRUD: MOCK TESTS ---
  const handleOpenMockTest = (mt = null) => {
    if (mt) {
      setSelectedItem(mt);
      setMockTestForm({ ...mt, questions: mt.questions || [] });
    } else {
      setSelectedItem(null);
      setMockTestForm({ title: '', description: '', timeLimit: 20, difficulty: 'Medium', questions: [] });
    }
    setShowMockTestModal(true);
  };

  const handleSaveMockTest = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/admin/mock-tests/${selectedItem.id}`, mockTestForm);
        toast.success("Mock test updated");
      } else {
        await api.post('/admin/mock-tests', mockTestForm);
        toast.success("Mock test configured");
      }
      setShowMockTestModal(false);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to save mock test.");
    }
  };

  const handleDeleteMockTest = async (id) => {
    if (!window.confirm("Delete this mock test?")) return;
    try {
      await api.delete(`/admin/mock-tests/${id}`);
      toast.success("Mock test removed");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const toggleMockTestQuestion = (q) => {
    const exists = mockTestForm.questions.some(item => item.id === q.id);
    if (exists) {
      setMockTestForm({
        ...mockTestForm,
        questions: mockTestForm.questions.filter(item => item.id !== q.id)
      });
    } else {
      setMockTestForm({
        ...mockTestForm,
        questions: [...mockTestForm.questions, q]
      });
    }
  };

  // --- CRUD: CODING PROBLEMS ---
  const handleOpenCoding = (cp = null) => {
    if (cp) {
      setSelectedItem(cp);
      setCodingForm(cp);
    } else {
      setSelectedItem(null);
      setCodingForm({ title: '', difficulty: 'Easy', topic: 'Arrays', description: '', solutionCode: '', explanation: '' });
    }
    setShowCodingModal(true);
  };

  const handleSaveCoding = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/admin/coding-problems/${selectedItem.id}`, codingForm);
        toast.success("Coding problem updated");
      } else {
        await api.post('/admin/coding-problems', codingForm);
        toast.success("Coding problem added");
      }
      setShowCodingModal(false);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to save coding problem.");
    }
  };

  const handleDeleteCoding = async (id) => {
    if (!window.confirm("Delete this coding challenge?")) return;
    try {
      await api.delete(`/admin/coding-problems/${id}`);
      toast.success("Problem removed");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // --- CRUD: INTERVIEW RESOURCES ---
  const handleOpenInterview = (ir = null) => {
    if (ir) {
      setSelectedItem(ir);
      setInterviewForm(ir);
    } else {
      setSelectedItem(null);
      setInterviewForm({ category: 'HR', title: '', content: '', company: 'General', authorName: 'Admin' });
    }
    setShowInterviewModal(true);
  };

  const handleSaveInterview = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/admin/interview-resources/${selectedItem.id}`, interviewForm);
        toast.success("Interview resource updated");
      } else {
        await api.post('/admin/interview-resources', interviewForm);
        toast.success("Interview resource added");
      }
      setShowInterviewModal(false);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to save resource.");
    }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.delete(`/admin/interview-resources/${id}`);
      toast.success("Resource deleted");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // Helper filter/pagination calculations
  const getFilteredList = () => {
    const term = search.toLowerCase();
    switch (activeTab) {
      case 'questions':
        return questions.filter(q => q.text.toLowerCase().includes(term) || q.category.toLowerCase().includes(term));
      case 'materials':
        return materials.filter(m => m.title.toLowerCase().includes(term) || m.category.toLowerCase().includes(term));
      case 'mocktests':
        return mockTests.filter(t => t.title.toLowerCase().includes(term));
      case 'coding':
        return codingProblems.filter(c => c.title.toLowerCase().includes(term) || c.topic.toLowerCase().includes(term));
      case 'interview':
        return interviewResources.filter(i => i.title.toLowerCase().includes(term) || i.category.toLowerCase().includes(term));
      case 'users':
        return users.filter(u => u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
      case 'results':
        return results.filter(r => r.user.fullName.toLowerCase().includes(term) || r.category.toLowerCase().includes(term));
      default:
        return [];
    }
  };

  const list = getFilteredList();
  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));
  const paginatedList = list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-64px)] bg-navy text-white relative">
        
        {/* Mobile Header Toggle */}
        <div className="absolute top-4 left-4 z-40 lg:hidden">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 bg-gray-900 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-electric-blue"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Left */}
        <div className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:static
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 pt-20 lg:pt-6 space-y-6">
            <div className="flex items-center gap-3 px-4 py-2 mb-4 bg-white/5 rounded-2xl border border-white/10">
              <GraduationCap className="w-8 h-8 text-electric-blue" />
              <div>
                <p className="font-extrabold text-sm leading-tight text-white font-mono">Admin Portal</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-wider">CONSOLE</p>
              </div>
            </div>

            <div className="space-y-1">
              <SidebarLink icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }} />
              <SidebarLink icon={Database} label="MCQ Questions" active={activeTab === 'questions'} onClick={() => { setActiveTab('questions'); setSidebarOpen(false); }} />
              <SidebarLink icon={FileText} label="Study Materials" active={activeTab === 'materials'} onClick={() => { setActiveTab('materials'); setSidebarOpen(false); }} />
              <SidebarLink icon={Target} label="Mock Tests" active={activeTab === 'mocktests'} onClick={() => { setActiveTab('mocktests'); setSidebarOpen(false); }} />
              <SidebarLink icon={Code} label="DSA Problems" active={activeTab === 'coding'} onClick={() => { setActiveTab('coding'); setSidebarOpen(false); }} />
              <SidebarLink icon={GraduationCap} label="Interview Prep" active={activeTab === 'interview'} onClick={() => { setActiveTab('interview'); setSidebarOpen(false); }} />
              <SidebarLink icon={Users} label="Users Registry" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} />
              <SidebarLink icon={Trophy} label="Scores & History" active={activeTab === 'results'} onClick={() => { setActiveTab('results'); setSidebarOpen(false); }} />
              <SidebarLink icon={Megaphone} label="Announcements" active={activeTab === 'announcements'} onClick={() => { setActiveTab('announcements'); setSidebarOpen(false); }} />
            </div>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="flex-grow p-6 lg:p-10 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto pt-12 lg:pt-0">
            
            {/* Header Title with Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white capitalize leading-tight">
                  {activeTab === 'overview' ? 'Administration Hub' : 
                   activeTab === 'questions' ? 'MCQ Question Bank' : 
                   activeTab === 'materials' ? 'Study Materials & PDFs' : 
                   activeTab === 'mocktests' ? 'Timed Mock Assessments' :
                   activeTab === 'coding' ? 'DSA Coding Problems' :
                   activeTab === 'interview' ? 'Interview Resource Guidelines' :
                   activeTab === 'users' ? 'Registered Candidates' : activeTab === 'announcements' ? 'Platform Announcements' : 'User Score Analytics'}
                </h1>
                <p className="text-sm text-gray-400 mt-1">Insert, modify, or delete database entities seamlessly.</p>
              </div>

              {/* Add New Button for active CRUD tabs */}
              {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'results' && (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    if (activeTab === 'questions') handleOpenQuestion();
                    if (activeTab === 'materials') handleOpenMaterial();
                    if (activeTab === 'mocktests') handleOpenMockTest();
                    if (activeTab === 'coding') handleOpenCoding();
                    if (activeTab === 'interview') handleOpenInterview();
                  }}
                  className="py-2.5 px-5 bg-gradient-to-r from-electric-blue to-blue-600 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Content
                </Button>
              )}
            </div>

            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <AdminStatCard icon={Users} label="Total Users" value={users.length} color="text-cyan-400" bg="bg-cyan-400/10" />
                  <AdminStatCard icon={Database} label="MCQ pool" value={questions.length} color="text-indigo-400" bg="bg-indigo-400/10" />
                  <AdminStatCard icon={Target} label="Mock Tests" value={mockTests.length} color="text-emerald-400" bg="bg-emerald-400/10" />
                  <AdminStatCard icon={Code} label="DSA Problems" value={codingProblems.length} color="text-purple-400" bg="bg-purple-400/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-electric-blue/5 rounded-full blur-[80px]" />
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-electric-blue" />
                      Administrative Overview
                    </h3>
                    <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                      <p>As the administrator, you have complete control over questions pool, revision PDFs, YouTube links, mock test setups, and candidate metrics.</p>
                      <p>Adding mock tests allows you to bundle specific questions, define time limits, and let users test their ability under strict exam simulations.</p>
                    </div>
                  </Card>

                  <Card className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6">Database Seeder Metrics</h3>
                    <div className="space-y-3 font-mono text-xs text-gray-400">
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Registered Profiles:</span> <span className="text-white font-bold">{users.length}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Aptitude/Technical MCQs:</span> <span className="text-white font-bold">{questions.length}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Study Materials uploaded:</span> <span className="text-white font-bold">{materials.length}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Custom Mock tests active:</span> <span className="text-white font-bold">{mockTests.length}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Interview prep guides:</span> <span className="text-white font-bold">{interviewResources.length}</span></div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB-BASED DATA LIST PANES */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.map((a) => (
                  <Card key={a.id} className="glass-card p-5 flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-electric-blue">{a.type}</span>
                      <h4 className="font-bold text-white mt-1">{a.title}</h4>
                      <p className="text-sm text-gray-400 mt-2">{a.content}</p>
                    </div>
                    <button onClick={async () => { await api.delete(`/admin/announcements/${a.id}`); fetchAdminData(); }} className="text-red-400 text-xs font-bold">Delete</button>
                  </Card>
                ))}
                <Button variant="primary" onClick={async () => {
                  const title = prompt('Announcement title');
                  const content = prompt('Announcement content');
                  if (title && content) { await api.post('/admin/announcements', { title, content, type: 'INFO', active: true }); fetchAdminData(); }
                }}>Post Announcement</Button>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'announcements' && (
              <div className="space-y-6">
                
                {/* Search / Filter header */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder={`Search ${activeTab}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-electric-blue outline-none transition-all"
                  />
                </div>

                {/* Table Pane */}
                <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl overflow-x-auto shadow-2xl">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/10">
                      <tr>
                        {activeTab === 'questions' && (
                          <>
                            <th className="px-6 py-4">Question</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeTab === 'materials' && (
                          <>
                            <th className="px-6 py-4">Material Details</th>
                            <th className="px-6 py-4">Resource Type</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeTab === 'mocktests' && (
                          <>
                            <th className="px-6 py-4">Test Title</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Questions</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeTab === 'coding' && (
                          <>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Topic</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeTab === 'interview' && (
                          <>
                            <th className="px-6 py-4">Guide Title</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeTab === 'users' && (
                          <>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">College</th>
                            <th className="px-6 py-4">Branch</th>
                          </>
                        )}
                        {activeTab === 'results' && (
                          <>
                            <th className="px-6 py-4">Candidate</th>
                            <th className="px-6 py-4">Module</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Score Achieved</th>
                            <th className="px-6 py-4">Timestamp</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {isLoading ? (
                        <tr><td colSpan="5" className="text-center py-20 text-gray-500 font-bold">Loading...</td></tr>
                      ) : paginatedList.length > 0 ? (
                        paginatedList.map((item) => (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            {activeTab === 'questions' && (
                              <>
                                <td className="px-6 py-4"><p className="font-bold text-white line-clamp-1">{item.text}</p></td>
                                <td className="px-6 py-4"><span className="text-electric-blue font-bold uppercase text-xs">{item.category.replace("-", " ")}</span></td>
                                <td className="px-6 py-4"><span className="text-xs">{item.difficulty}</span></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button onClick={() => handleOpenQuestion(item)} className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteQuestion(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                              </>
                            )}
                            {activeTab === 'materials' && (
                              <>
                                <td className="px-6 py-4">
                                  <p className="font-bold text-white">{item.title}</p>
                                  <p className="text-xxs text-gray-500 truncate max-w-xs">{item.url}</p>
                                </td>
                                <td className="px-6 py-4"><span className="bg-white/5 px-2.5 py-0.5 rounded text-xxs font-bold text-gray-400">{item.type}</span></td>
                                <td className="px-6 py-4"><span className="text-electric-blue font-bold uppercase text-xs">{item.category.replace("-", " ")}</span></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button onClick={() => handleOpenMaterial(item)} className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteMaterial(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                              </>
                            )}
                            {activeTab === 'mocktests' && (
                              <>
                                <td className="px-6 py-4">
                                  <p className="font-bold text-white">{item.title}</p>
                                  <p className="text-xxs text-gray-500 truncate max-w-xs">{item.description}</p>
                                </td>
                                <td className="px-6 py-4"><span className="font-bold text-white">{item.timeLimit} Mins</span></td>
                                <td className="px-6 py-4"><span className="bg-electric-blue/15 text-electric-blue text-xs font-bold px-2 py-0.5 rounded-full">{item.questions ? item.questions.length : 0} Qs</span></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button onClick={() => handleOpenMockTest(item)} className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteMockTest(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                              </>
                            )}
                            {activeTab === 'coding' && (
                              <>
                                <td className="px-6 py-4"><p className="font-bold text-white">{item.title}</p></td>
                                <td className="px-6 py-4"><span className="text-xs uppercase font-bold text-gray-400">{item.topic}</span></td>
                                <td className="px-6 py-4"><span>{item.difficulty}</span></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button onClick={() => handleOpenCoding(item)} className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteCoding(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                              </>
                            )}
                            {activeTab === 'interview' && (
                              <>
                                <td className="px-6 py-4"><p className="font-bold text-white">{item.title}</p></td>
                                <td className="px-6 py-4"><span className="bg-white/5 px-2 py-0.5 rounded text-xs font-bold text-gray-400">{item.category}</span></td>
                                <td className="px-6 py-4"><span className="text-electric-blue font-bold text-xs">{item.company || 'General'}</span></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button onClick={() => handleOpenInterview(item)} className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteInterview(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                              </>
                            )}
                            {activeTab === 'users' && (
                              <>
                                <td className="px-6 py-4"><span className="font-bold text-white">{item.fullName}</span></td>
                                <td className="px-6 py-4"><span className="text-gray-400">{item.email}</span></td>
                                <td className="px-6 py-4"><span className="text-xs">{item.collegeName || 'Clerk External'}</span></td>
                                <td className="px-6 py-4"><span className="text-xs text-gray-500 uppercase">{item.branch || '-'}</span></td>
                              </>
                            )}
                            {activeTab === 'results' && (
                              <>
                                <td className="px-6 py-4"><span className="font-bold text-white">{item.user ? item.user.fullName : 'Anonymous'}</span></td>
                                <td className="px-6 py-4"><span className="bg-white/5 px-2 py-0.5 rounded text-xxs font-mono uppercase text-gray-400">{item.moduleType}</span></td>
                                <td className="px-6 py-4"><span className="text-electric-blue font-bold uppercase text-xs">{item.category.replace("-", " ")}</span></td>
                                <td className="px-6 py-4 font-bold text-green-400">{item.score} / {item.totalQuestions}</td>
                                <td className="px-6 py-4 text-xxs text-gray-500"><span>{new Date(item.timestamp).toLocaleString()}</span></td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" className="text-center py-20 text-gray-500">No records found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                {list.length > itemsPerPage && (
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl text-xs">
                    <p className="text-gray-400">
                      Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-white">{Math.min(currentPage * itemsPerPage, list.length)}</strong> of <strong className="text-white">{list.length}</strong> items
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="py-1 px-3" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
                      <Button variant="secondary" className="py-1 px-3" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* MODAL: MCQ QUESTION FORM */}
        <AnimatePresence>
          {showQuestionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQuestionModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10">
                <button onClick={() => setShowQuestionModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold mb-6">{selectedItem ? 'Edit MCQ Question' : 'Add MCQ Question'}</h3>
                
                <form onSubmit={handleSaveQuestion} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Module</label>
                      <select value={questionForm.moduleType} onChange={(e) => setQuestionForm({...questionForm, moduleType: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="TECHNICAL">TECHNICAL</option>
                        <option value="APTITUDE">APTITUDE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Category</label>
                      <select value={questionForm.category} onChange={(e) => setQuestionForm({...questionForm, category: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        {MCQ_CATEGORIES.filter(c => c.module === questionForm.moduleType).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Difficulty</label>
                      <select value={questionForm.difficulty} onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Company Tag (Optional)</label>
                      <input type="text" value={questionForm.company} onChange={(e) => setQuestionForm({...questionForm, company: e.target.value})} placeholder="e.g. TCS, Google" className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Question Description</label>
                    <textarea rows="3" value={questionForm.text} onChange={(e) => setQuestionForm({...questionForm, text: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={questionForm.optionA} onChange={(e) => setQuestionForm({...questionForm, optionA: e.target.value})} required placeholder="Option A" className="bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    <input type="text" value={questionForm.optionB} onChange={(e) => setQuestionForm({...questionForm, optionB: e.target.value})} required placeholder="Option B" className="bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    <input type="text" value={questionForm.optionC} onChange={(e) => setQuestionForm({...questionForm, optionC: e.target.value})} required placeholder="Option C" className="bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    <input type="text" value={questionForm.optionD} onChange={(e) => setQuestionForm({...questionForm, optionD: e.target.value})} required placeholder="Option D" className="bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Correct Option</label>
                      <select value={questionForm.correctOption} onChange={(e) => setQuestionForm({...questionForm, correctOption: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Explanation</label>
                    <textarea rows="2" value={questionForm.explanation} onChange={(e) => setQuestionForm({...questionForm, explanation: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button type="button" variant="secondary" onClick={() => setShowQuestionModal(false)} className="py-2 px-4 text-xs">Cancel</Button>
                    <Button type="submit" variant="primary" className="py-2 px-6 text-xs bg-electric-blue text-white">Save</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: STUDY MATERIAL FORM */}
        <AnimatePresence>
          {showMaterialModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMaterialModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-lg relative z-10">
                <button onClick={() => setShowMaterialModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold mb-6">{selectedItem ? 'Edit Study Material' : 'Add Study Material'}</h3>
                
                <form onSubmit={handleSaveMaterial} className="space-y-4">
                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input type="text" value={materialForm.title} onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Resource Type</label>
                      <select value={materialForm.type} onChange={(e) => setMaterialForm({...materialForm, type: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="PDF">PDF Revision Notes</option>
                        <option value="VIDEO">YouTube Video Link</option>
                        <option value="ARTICLE">General Topic Guide</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Category topic</label>
                      <select value={materialForm.category} onChange={(e) => setMaterialForm({...materialForm, category: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="quantitative">Quantitative Aptitude</option>
                        <option value="logical-reasoning">Logical Reasoning</option>
                        <option value="verbal-ability">Verbal Ability</option>
                        <option value="data-structures">Data Structures</option>
                        <option value="core-java">Core Java</option>
                        <option value="dbms">DBMS</option>
                        <option value="operating-systems">Operating Systems</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Resource URL (For PDF or YouTube Embed)</label>
                    <input type="text" value={materialForm.url} onChange={(e) => setMaterialForm({...materialForm, url: e.target.value})} placeholder="https://youtube.com/embed/..." className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Brief Description / Content Notes</label>
                    <textarea rows="3" value={materialForm.content} onChange={(e) => setMaterialForm({...materialForm, content: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button type="button" variant="secondary" onClick={() => setShowMaterialModal(false)} className="py-2 px-4 text-xs">Cancel</Button>
                    <Button type="submit" variant="primary" className="py-2 px-6 text-xs bg-electric-blue text-white">Save</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: MOCK TEST FORM */}
        <AnimatePresence>
          {showMockTestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMockTestModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
                <button onClick={() => setShowMockTestModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold mb-6">{selectedItem ? 'Edit Mock Assessment' : 'Configure Timed Mock Test'}</h3>
                
                <form onSubmit={handleSaveMockTest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Test Title</label>
                      <input type="text" value={mockTestForm.title} onChange={(e) => setMockTestForm({...mockTestForm, title: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Time Limit (Mins)</label>
                      <input type="number" value={mockTestForm.timeLimit} onChange={(e) => setMockTestForm({...mockTestForm, timeLimit: parseInt(e.target.value) || 20})} required className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Difficulty</label>
                      <select value={mockTestForm.difficulty} onChange={(e) => setMockTestForm({...mockTestForm, difficulty: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Test Description</label>
                    <textarea rows="2" value={mockTestForm.description} onChange={(e) => setMockTestForm({...mockTestForm, description: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  {/* MCQ Selector list */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-2">Select Questions to Include ({mockTestForm.questions.length} selected)</label>
                    <div className="h-44 overflow-y-auto border border-white/10 rounded-xl p-3 bg-navy space-y-2">
                      {questions.map((q) => {
                        const isChecked = mockTestForm.questions.some(item => item.id === q.id);
                        return (
                          <div key={q.id} className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-lg hover:border-white/15">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => toggleMockTestQuestion(q)}
                              className="w-4.5 h-4.5 text-electric-blue focus:ring-0 rounded bg-gray-800 border-white/15"
                            />
                            <div className="text-xxs leading-snug">
                              <p className="font-bold text-white line-clamp-1">{q.text}</p>
                              <p className="text-gray-500 font-semibold">{q.category} - {q.difficulty}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button type="button" variant="secondary" onClick={() => setShowMockTestModal(false)} className="py-2 px-4 text-xs">Cancel</Button>
                    <Button type="submit" variant="primary" className="py-2 px-6 text-xs bg-electric-blue text-white" disabled={mockTestForm.questions.length === 0}>Save Test</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: DSA CODING FORM */}
        <AnimatePresence>
          {showCodingModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCodingModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10">
                <button onClick={() => setShowCodingModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold mb-6">{selectedItem ? 'Edit DSA Coding Problem' : 'Add DSA Coding Problem'}</h3>
                
                <form onSubmit={handleSaveCoding} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Problem Title</label>
                      <input type="text" value={codingForm.title} onChange={(e) => setCodingForm({...codingForm, title: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">DSA Topic</label>
                      <select value={codingForm.topic} onChange={(e) => setCodingForm({...codingForm, topic: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="Arrays">Arrays</option>
                        <option value="Linked Lists">Linked Lists</option>
                        <option value="Dynamic Programming">Dynamic Programming</option>
                        <option value="Stack/Queue">Stack/Queue</option>
                        <option value="Trees">Trees</option>
                        <option value="Graphs">Graphs</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Difficulty</label>
                      <select value={codingForm.difficulty} onChange={(e) => setCodingForm({...codingForm, difficulty: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Problem Description</label>
                    <textarea rows="3" value={codingForm.description} onChange={(e) => setCodingForm({...codingForm, description: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Solution Boilerplate Code (Java)</label>
                    <textarea rows="4" value={codingForm.solutionCode} onChange={(e) => setCodingForm({...codingForm, solutionCode: e.target.value})} placeholder="public int[] solve()..." className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white font-mono resize-none" />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Complexity & Approach Explanation</label>
                    <textarea rows="3" value={codingForm.explanation} onChange={(e) => setCodingForm({...codingForm, explanation: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button type="button" variant="secondary" onClick={() => setShowCodingModal(false)} className="py-2 px-4 text-xs">Cancel</Button>
                    <Button type="submit" variant="primary" className="py-2 px-6 text-xs bg-electric-blue text-white">Save</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: INTERVIEW RESOURCE FORM */}
        <AnimatePresence>
          {showInterviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInterviewModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-lg relative z-10">
                <button onClick={() => setShowInterviewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold mb-6">{selectedItem ? 'Edit Interview Resource' : 'Add Interview Resource'}</h3>
                
                <form onSubmit={handleSaveInterview} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Category</label>
                      <select value={interviewForm.category} onChange={(e) => setInterviewForm({...interviewForm, category: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white">
                        <option value="HR">HR Questions</option>
                        <option value="TECHNICAL">Technical Interview Qs</option>
                        <option value="RESUME">Resume Guidance</option>
                        <option value="EXPERIENCE">Interview Experience</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Target Company (Optional)</label>
                      <input type="text" value={interviewForm.company} onChange={(e) => setInterviewForm({...interviewForm, company: e.target.value})} placeholder="e.g. TCS, Google" className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Author Name (Optional)</label>
                      <input type="text" value={interviewForm.authorName} onChange={(e) => setInterviewForm({...interviewForm, authorName: e.target.value})} className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Resource Title</label>
                    <input type="text" value={interviewForm.title} onChange={(e) => setInterviewForm({...interviewForm, title: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-2.5 text-xs text-white" />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Content details</label>
                    <textarea rows="4" value={interviewForm.content} onChange={(e) => setInterviewForm({...interviewForm, content: e.target.value})} required className="w-full bg-navy border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <Button type="button" variant="secondary" onClick={() => setShowInterviewModal(false)} className="py-2 px-4 text-xs">Cancel</Button>
                    <Button type="submit" variant="primary" className="py-2 px-6 text-xs bg-electric-blue text-white">Save</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border ${
      active 
        ? 'bg-electric-blue/15 border-electric-blue text-electric-blue shadow-md' 
        : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const AdminStatCard = ({ icon: Icon, label, value, color, bg }) => (
  <Card className="flex items-center gap-4 p-4 border border-white/5 bg-white/5">
    <div className={`p-3 rounded-xl ${bg} ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-white mt-0.5">{value}</p>
    </div>
  </Card>
);

export default AdminDashboard;
