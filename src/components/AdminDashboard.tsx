import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart3, Users, Building2, BookOpen, LogOut, TrendingUp, Download, Edit, Trash2, Brain, Settings } from 'lucide-react';
import StatsOverview from './admin/StatsOverview';
import TraineeAnalysis from './admin/TraineeAnalysis';
import CentreAnalysis from './admin/CentreAnalysis';
import PredictiveAnalytics from './admin/PredictiveAnalytics';

type ActiveView = 'overview' | 'trainees' | 'centres' | 'predictive' | null;

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, centres, trainers, trainees, courses } = useAppContext();
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [showSettings, setShowSettings] = useState(false);

  // Notifications
  const lowUtilCentres = centres.filter(c => c.capacity > 0 && trainees.filter(t => t.assignedCentre === c.id).length / c.capacity < 0.5);
  const highDropout = trainees.filter(t => t.employment === 'unemployed').length / (trainees.length || 1) > 0.5;

  // Settings state (simple demo)
  const [branding, setBranding] = useState('BICTDA Digital Literacy');
  const [contact, setContact] = useState('info@bictda.bo.gov.ng');

  // Export helpers
  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => row[k]).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Placeholder edit/delete handlers
  const handleEdit = (type: string, id: string) => alert(`Edit ${type} ${id}`);
  const handleDelete = (type: string, id: string) => alert(`Delete ${type} ${id}`);

  const menuItems = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3, description: 'Key metrics and charts', color: 'from-blue-500 to-blue-600' },
    { id: 'trainees' as const, label: 'Trainee Analysis', icon: Users, description: 'Demographics and performance', color: 'from-indigo-500 to-indigo-600' },
    { id: 'centres' as const, label: 'Centre Analysis', icon: Building2, description: 'Location and capacity data', color: 'from-purple-500 to-purple-600' },
    { id: 'predictive' as const, label: 'Predictive Analytics', icon: Brain, description: 'AI-powered insights and forecasting', color: 'from-emerald-500 to-emerald-600' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <StatsOverview />;
      case 'trainees': return <TraineeAnalysis />;
      case 'centres': return <CentreAnalysis />;
      case 'predictive': return <PredictiveAnalytics />;
      default: return <StatsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/bictda-logo.png" 
                  alt="BICTDA Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 mt-1">Welcome back, {currentUser?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowSettings(true)} 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={logout} 
              variant="outline" 
              className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {(lowUtilCentres.length > 0 || highDropout) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg shadow-sm">
            <h2 className="font-bold text-amber-800 mb-2">⚠️ Notifications</h2>
            {lowUtilCentres.length > 0 && (
              <div className="mb-1 text-amber-700">Low utilization at: {lowUtilCentres.map(c => c.name).join(', ')}</div>
            )}
            {highDropout && (
              <div className="text-amber-700">High dropout/unemployment rate among trainees.</div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button 
            onClick={() => exportCSV(trainees, 'trainees.csv')} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Trainees
          </Button>
          <Button 
            onClick={() => exportCSV(trainers, 'trainers.csv')} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Trainers
          </Button>
          <Button 
            onClick={() => exportCSV(centres, 'centres.csv')} 
            className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Centres
          </Button>
          <Button 
            onClick={() => exportCSV(courses, 'courses.csv')} 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Courses
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Trainees</p>
                  <p className="text-3xl font-bold">{trainees.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Total Trainers</p>
                  <p className="text-3xl font-bold">{trainers.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Centres</p>
                  <p className="text-3xl font-bold">{centres.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold">{courses.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.id} 
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:-translate-y-1 ${
                  activeView === item.id ? 'ring-2 ring-blue-500 bg-gradient-to-r ' + item.color + ' text-white' : 'bg-white'
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      activeView === item.id 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-r ' + item.color + ' group-hover:scale-110'
                    }`}>
                      <Icon className={`w-6 h-6 ${activeView === item.id ? 'text-white' : 'text-white'}`} />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${activeView === item.id ? 'text-white' : 'text-slate-800'}`}>
                        {item.label}
                      </CardTitle>
                      <CardDescription className={activeView === item.id ? 'text-blue-100' : 'text-slate-600'}>
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
          {renderView()}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Branding</label>
                  <input
                    type="text"
                    value={branding}
                    onChange={e => setBranding(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Contact Email</label>
                  <input
                    type="email"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => setShowSettings(false)} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Save
                  </Button>
                  <Button 
                    onClick={() => setShowSettings(false)} 
                    variant="outline" 
                    className="flex-1 border-slate-300 text-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;