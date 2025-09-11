// src/components/ExportButton.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { prepareScheduleForExport } from '../utils/exportHelper';

const ExportButton = () => {
  const schedule = useSelector(state => state.schedule);
  // const currentTheme = useSelector(state => state.theme.currentTheme);

  const exportAsImage = async () => {
    // Create a temporary element for export
    const exportElement = document.createElement('div');
    exportElement.className = 'p-6 bg-white rounded-xl shadow-lg';
    
    const scheduleData = prepareScheduleForExport(schedule);
    
    const daySections = schedule.enabledDays.map((day) => {
      const items = scheduleData[day] || [];
      const color = day === 'friday' ? '#3B82F6' : day === 'saturday' ? '#4F46E5' : day === 'sunday' ? '#10B981' : '#F59E0B';
      const title = day.charAt(0).toUpperCase() + day.slice(1);
      return `
        <div>
          <h3 class="text-xl font-semibold mb-4">${title}</h3>
          <div class="space-y-3">
            ${items.map(activity => `
              <div class="p-3 rounded-lg border-l-4" style="border-color: ${color}">
                <div class="font-semibold">${activity.title}</div>
                <div class="text-sm text-gray-600">${activity.time}</div>
                <div class="text-sm mt-1">${activity.description}</div>
                <div class="text-xs text-gray-500 mt-1">Mood: ${activity.mood}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    const nowStr = new Date().toLocaleDateString();
    const theme = (schedule?.enabledDays || []).join(', ').toUpperCase();

    exportElement.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">My Weekend Plan</h2>
        <div class="text-sm text-gray-500">${nowStr} • Days: ${theme}</div>
      </div>
      <div class="grid grid-cols-2 gap-6">${daySections}</div>
      <div class="text-center text-xs text-gray-500 mt-6">Created with Weekendly</div>
    `;
    
    document.body.appendChild(exportElement);
    
    const canvas = await html2canvas(exportElement, {
      backgroundColor: '#ffffff'
    });
    
    document.body.removeChild(exportElement);
    
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    
    link.href = data;
    link.download = 'weekendly-plan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportAsImage}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      Export Plan
    </button>
  );
};

export default ExportButton;