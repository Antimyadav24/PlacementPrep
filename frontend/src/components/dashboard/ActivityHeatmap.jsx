import React from 'react';

const ActivityHeatmap = ({ activityData = [] }) => {
  // Generate a mock year of data if none provided (for demonstration)
  // Usually, this data would come from backend grouped by day
  const daysInYear = 365;
  const generateMockData = () => {
    const data = [];
    const today = new Date();
    for (let i = daysInYear; i > 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Randomly assign 0 to 4 submissions to create the heatmap effect
      // Higher chance of 0 to make it realistic
      const rand = Math.random();
      let count = 0;
      if (rand > 0.6) count = 1;
      if (rand > 0.8) count = 2;
      if (rand > 0.9) count = 3;
      if (rand > 0.95) count = 4;
      data.push({ date: d.toISOString().split('T')[0], count });
    }
    return data;
  };

  const dataToRender = activityData.length > 0 ? activityData : generateMockData();

  // Split data into weeks for rendering the grid
  const weeks = [];
  let currentWeek = [];
  dataToRender.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === dataToRender.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Get color based on submission count (Linear/Leetcode emerald theme)
  const getColor = (count) => {
    if (count === 0) return 'bg-surface-hover'; // empty surface hover adapts to light/dark
    if (count === 1) return 'bg-emerald-800/80 dark:bg-emerald-900'; 
    if (count === 2) return 'bg-emerald-600/80 dark:bg-emerald-700'; 
    if (count === 3) return 'bg-emerald-500 dark:bg-emerald-500'; 
    return 'bg-emerald-400 dark:bg-emerald-400'; // highest
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-semibold text-primary">Activity</h3>
          <p className="text-xs text-muted mt-1">125 submissions in the past year</p>
        </div>
      </div>
      
      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="inline-flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => (
                <div 
                  key={dIdx} 
                  title={`${day.count} submissions on ${day.date}`}
                  className={`w-3 h-3 rounded-[2px] ${getColor(day.count)} hover:ring-1 hover:ring-white/50 transition-all cursor-crosshair`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 text-xs text-muted mt-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[2px] bg-surface-hover" />
        <div className="w-3 h-3 rounded-[2px] bg-emerald-800/80 dark:bg-emerald-900" />
        <div className="w-3 h-3 rounded-[2px] bg-emerald-600/80 dark:bg-emerald-700" />
        <div className="w-3 h-3 rounded-[2px] bg-emerald-500 dark:bg-emerald-500" />
        <div className="w-3 h-3 rounded-[2px] bg-emerald-400 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
