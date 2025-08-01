import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart3, Users, LogOut, TrendingUp, Download, Edit, Trash2, Brain, Settings, Megaphone } from 'lucide-react';
import StatsOverview from './admin/StatsOverview';
import TraineeAnalysis from './admin/TraineeAnalysis';
import CentreAnalysis from './admin/CentreAnalysis';
import PredictiveAnalytics from './admin/PredictiveAnalytics';

type ActiveView = 'overview' | 'trainees' | 'centres' | 'predictive' | null;

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, trainees, loading } = useAppContext();
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Notifications
  const centreStats = trainees.reduce((acc, trainee) => {
    acc[trainee.centre_name] = (acc[trainee.centre_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lowUtilCentres = Object.entries(centreStats).filter(([_, count]) => count < 5);
  const highDropout = trainees.filter(t => t.employment_status === 'unemployed').length / (trainees.length || 1) > 0.5;

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

  // Announcements
  const handleAnnounce = () => {
    if (announcement.trim()) {
      setAnnouncements(a => [announcement, ...a]);
      setAnnouncement('');
    }
  };

  const menuItems = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3, description: 'Key metrics and charts', color: 'from-blue-500 to-blue-600' },
    { id: 'trainees' as const, label: 'Trainee Analysis', icon: Users, description: 'Demographics and performance', color: 'from-indigo-500 to-indigo-600' },
    { id: 'centres' as const, label: 'Centre Analysis', icon: Brain, description: 'Location and capacity data', color: 'from-purple-500 to-purple-600' },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading data...</p>
        </div>
      </div>
    );
  }

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
          <div className="mb-8 space-y-4">
            {lowUtilCentres.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">Low Utilization Alert</p>
                      <p className="text-amber-700 text-sm">
                        {lowUtilCentres.length} centre(s) have less than 5 trainees
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {highDropout && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">High Unemployment Rate</p>
                      <p className="text-red-700 text-sm">
                        Over 50% of trainees are unemployed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Announcements - Admin Only */}
        <Card className="mb-8 border-slate-200 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-slate-800">Send Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Type announcement for all instructors..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button 
                onClick={handleAnnounce} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
              >
                Send
              </Button>
            </div>
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <div key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-lg text-slate-800">
                  <div className="flex justify-between items-start">
                    <span>{a}</span>
                    <span className="text-xs text-slate-500">Sent by Admin</span>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="text-center py-4 text-slate-500">
                  <p>No announcements sent yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-r ${item.color} text-white`}
              onClick={() => setActiveView(item.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
          {renderView()}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-auto shadow-lg">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Branding</label>
                  <input
                    type="text"
                    value={branding}
                    onChange={(e) => setBranding(e.target.value)}
                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <input
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setShowSettings(false)} className="flex-1">
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
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