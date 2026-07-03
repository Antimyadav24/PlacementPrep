import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import PageTransition from '../components/PageTransition';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import AdminOverview from '../components/dashboard/AdminOverview';
import { Skeleton } from '../components/ui/LoadingStates';

const Dashboard = () => {
  const { isAdmin, isLoaded } = useAppAuth();
  const api = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (isAdmin) { setLoading(false); return; }
    const fetch = async () => {
      try {
        const res = await api.get('/results/dashboard-stats');
        setStats(res.data);
      } catch { setStats({ totalQuestionsSolved: 0, accuracyRate: 0, weeklyProgress: [], badges: [], recentActivity: [], rank: '-', totalUsers: 0, streak: 0, dailyGoal: 20, dailyProgress: 0, recommendedTopics: [] }); }
      finally { setLoading(false); }
    };
    fetch();
  }, [isLoaded, isAdmin, api]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <PageTransition>
      {isAdmin ? <AdminOverview /> : <StudentDashboard stats={stats} />}
    </PageTransition>
  );
};

export default Dashboard;
