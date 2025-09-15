
import React, { useState, useRef, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../components/AppIcon';
import Button from '../components/ui/Button';

// Lazy load heavy components
const WeekendPlanCard = lazy(() => import('../components/WeekendPlanCard'));

// Dynamic import for html2canvas to reduce initial bundle size
const loadHtml2Canvas = () => import('html2canvas');

const PreviewPage = () => {
  const navigate = useNavigate();
  const schedule = useSelector(state => state.schedule);
  const [colorScheme, setColorScheme] = useState('vibrant');
  const [layout, setLayout] = useState('timeline');
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);

  const colorSchemes = [
    { id: 'vibrant', name: 'Vibrant', gradient: 'from-purple-600 to-pink-600' },
    { id: 'minimal', name: 'Minimal', gradient: 'from-gray-100 to-gray-200' },
    { id: 'nature', name: 'Nature', gradient: 'from-green-400 to-blue-500' },
    { id: 'sunset', name: 'Sunset', gradient: 'from-orange-400 to-red-500' },
    { id: 'ocean', name: 'Ocean', gradient: 'from-blue-400 to-cyan-500' },
    { id: 'forest', name: 'Forest', gradient: 'from-green-500 to-emerald-600' },
    { id: 'lavender', name: 'Lavender', gradient: 'from-purple-400 to-indigo-500' },
    { id: 'coral', name: 'Coral', gradient: 'from-pink-400 to-red-500' }
  ];

  const layouts = [
    { id: 'timeline', name: 'Timeline' },
    { id: 'grid', name: 'Grid' },
    { id: 'card', name: 'Card' }
  ];

  const handleExport = async (format = 'png') => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      // Dynamically import html2canvas only when needed
      const html2canvas = (await loadHtml2Canvas()).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `weekend-plan-${new Date().toISOString().split('T')[0]}.${format}`;
      
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else {
        // For PDF, we'll use a library like jsPDF - in feature if required
        link.href = canvas.toDataURL('image/png');
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const hasActivities = schedule.enabledDays?.some(day => schedule[day]?.length > 0) || false;

  if (!hasActivities) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AppIcon name="Calendar" size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Schedule Found</h2>
          <p className="text-gray-500 mb-6">Create your schedule first to see the preview.</p>
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <AppIcon name="ArrowLeft" size={16} />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekend Plan Preview</h1>
              <p className="text-gray-600">Customize and export your weekend schedule</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <AppIcon name="ArrowLeft" size={16} />
                Back
              </Button>
              <Button 
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <AppIcon name="Download" size={16} />
                {isExporting ? 'Exporting...' : 'Export PNG'}
              </Button>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customize Design</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Color Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setColorScheme(scheme.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        colorScheme === scheme.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-8 rounded bg-gradient-to-r ${scheme.gradient} mb-2`}></div>
                      <span className="text-xs text-gray-600">{scheme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Layout Style</label>
                <div className="space-y-2">
                  {layouts.map((layoutOption) => (
                    <button
                      key={layoutOption.id}
                      onClick={() => setLayout(layoutOption.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        layout === layoutOption.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {layoutOption.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl shadow-elevated overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <AppIcon name="Eye" size={20} className="mr-2" />
              Preview
            </h3>
            <p className="text-gray-600 text-sm mt-1">Live preview of your shareable weekend plan</p>
          </div>
          <div className="p-6">
            <div ref={cardRef}>
              <Suspense fallback={
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white min-h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/80">Loading preview...</p>
                  </div>
                </div>
              }>
                <WeekendPlanCard
                  schedule={schedule}
                  colorScheme={colorScheme}
                  layout={layout}
                  showHeader={true}
                  showFooter={true}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
