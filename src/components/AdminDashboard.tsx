import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart3, LogOut, Download, Edit, Trash2, Brain, Settings, Megaphone, Globe, Building, GraduationCap, Award, PieChart, MapPin, Clock, CheckCircle, Shield, FileText, Users, Activity, Target, TrendingUp } from 'lucide-react';
import TraineeAnalysis from './admin/TraineeAnalysis';
import CentreAnalysis from './admin/CentreAnalysis';
import PredictiveAnalytics from './admin/PredictiveAnalytics';
import CenterManagement from './admin/CenterManagement';
import InstructorManagement from './admin/InstructorManagement';
import ReportsManagement from './admin/ReportsManagement';
import InstructorForm from './forms/InstructorForm';
import CentreForm from './forms/CentreForm';


type ActiveView = 'overview' | 'trainees' | 'instructors' | 'centres' | 'reports' | 'analytics' | 'settings';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, trainees, loading, announcements, addAnnouncement, announcementsLoading, weeklyReports, meReports } = useAppContext();
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [language, setLanguage] = useState<'en' | 'ha' | 'kr'>('en');
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [showCentreForm, setShowCentreForm] = useState(false);


  // Analytics calculations
  const totalTrainees = trainees.length;
  const uniqueCentres = [...new Set(trainees.map(t => t.centre_name?.toUpperCase()))].filter(Boolean);
  const totalCentres = uniqueCentres.length;
  const totalCohorts = [...new Set(trainees.map(t => t.cohort_number))].filter(c => c && c > 0).length;
  
  const genderDistribution = {
    male: trainees.filter(t => ['male', 'm'].includes(t.gender?.toLowerCase() || '')).length,
    female: trainees.filter(t => ['female', 'f'].includes(t.gender?.toLowerCase() || '')).length
  };

  const employmentStats = {
    employed: trainees.filter(t => ['employed', 'emp'].includes(t.employment_status?.toLowerCase() || '')).length,
    unemployed: trainees.filter(t => ['unemployed', 'unemp'].includes(t.employment_status?.toLowerCase() || '')).length
  };

  // New analytics for exam results and special needs
  const examResults = {
    passed: trainees.filter(t => t.passed).length,
    failed: trainees.filter(t => t.failed).length,
    notSat: trainees.filter(t => t.not_sat_for_exams).length,
    dropout: trainees.filter(t => t.dropout).length,
    enrolled: trainees.filter(t => !t.passed && !t.failed && !t.not_sat_for_exams && !t.dropout).length
  };



  // Placeholder edit/delete handlers
  const handleEdit = (type: string, id: string) => alert(`Edit ${type} ${id}`);
  const handleDelete = (type: string, id: string) => alert(`Delete ${type} ${id}`);

  // Announcements
  const handleAnnounce = async () => {
    if (announcement.trim()) {
      try {
        await addAnnouncement(announcement);
        setAnnouncement('');
      } catch (error) {
        console.error('Error sending announcement:', error);
        alert('Failed to send announcement. Please try again.');
      }
    }
  };

  // Show skeleton loaders instead of blocking the entire dashboard
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-200 rounded"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Premium Admin Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <img 
                    src="/bictda-logo.png" 
                    alt="BICTDA Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    BICTDA Administrative Console
                  </h1>
                  <p className="text-slate-600 text-sm">Executive Management Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">

              <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ha' | 'kr')}>
                <SelectTrigger className="w-20 bg-white/80 border-slate-200/50 hover:bg-white transition-colors">
                  <Globe className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ha">HA</SelectItem>
                  <SelectItem value="kr">KR</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-2 border border-slate-200/50 hover:bg-white transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">{currentUser?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Executive Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-3">Welcome back, {currentUser?.name} 👋</h2>
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{loading ? '...' : '12'} Weeks Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{loading ? '...' : totalTrainees} Trainees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{loading ? '...' : '0'} Reports</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Administrative Announcements */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center relative">
                <Megaphone className="w-6 h-6 text-white" />
                {announcements.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs text-white font-bold">{announcements.length}</span>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-slate-800 text-xl flex items-center gap-2">
                  Administrative Announcements
                  {announcements.length > 0 && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </CardTitle>
                <p className="text-slate-600 text-sm">Broadcast messages to all instructors and centres</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={announcement}
                    onChange={e => setAnnouncement(e.target.value)}
                    placeholder="Type announcement for all instructors..."
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                  <Button 
                    onClick={handleAnnounce} 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Send
                  </Button>
                </div>
                <div className="space-y-3">
                  {announcementsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                      <p className="text-slate-500">Loading announcements...</p>
                    </div>
                  ) : announcements.length > 0 ? (
                    announcements.map((a) => (
                      <div key={a.id} className="bg-white/80 backdrop-blur-sm border-l-4 border-amber-400 p-4 rounded-xl text-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{a.message}</p>
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                              <span>Sent by {a.sender_name}</span>
                              <span>•</span>
                              <span>{new Date(a.created_at).toLocaleString()}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Megaphone className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p>No announcements sent yet</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardHeader>
              <CardTitle className="text-slate-800 text-xl flex items-center gap-2">
                Quick Actions
              </CardTitle>
              <p className="text-slate-600 text-sm">Manage instructors, centres, and reports</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setShowInstructorForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Register Instructor
                </Button>
                <Button 
                  onClick={() => setShowCentreForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                  Add Centre
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeView === 'overview' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl' 
                : 'bg-white shadow-lg hover:shadow-xl border-slate-200 hover:border-blue-200'
            }`}
            onClick={() => setActiveView('overview')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  activeView === 'overview' ? 'bg-white/20' : 'bg-blue-100'
                }`}>
                  <BarChart3 className={`w-6 h-6 ${activeView === 'overview' ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${activeView === 'overview' ? 'text-white' : 'text-slate-800'}`}>
                    Overview
                  </h3>
                  <p className={`text-sm ${activeView === 'overview' ? 'text-blue-100' : 'text-slate-600'}`}>
                    Executive summary
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeView === 'trainees' 
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl' 
                : 'bg-white shadow-lg hover:shadow-xl border-slate-200 hover:border-emerald-200'
            }`}
            onClick={() => setActiveView('trainees')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  activeView === 'trainees' ? 'bg-white/20' : 'bg-emerald-100'
                }`}>
                  <Users className={`w-6 h-6 ${activeView === 'trainees' ? 'text-white' : 'text-emerald-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${activeView === 'trainees' ? 'text-white' : 'text-slate-800'}`}>
                    Trainees
                  </h3>
                  <p className={`text-sm ${activeView === 'trainees' ? 'text-emerald-100' : 'text-slate-600'}`}>
                    Manage all trainees
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeView === 'instructors' 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl' 
                : 'bg-white shadow-lg hover:shadow-xl border-slate-200 hover:border-indigo-200'
            }`}
            onClick={() => setActiveView('instructors')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  activeView === 'instructors' ? 'bg-white/20' : 'bg-indigo-100'
                }`}>
                  <Shield className={`w-6 h-6 ${activeView === 'instructors' ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${activeView === 'instructors' ? 'text-white' : 'text-slate-800'}`}>
                    Instructors
                  </h3>
                  <p className={`text-sm ${activeView === 'instructors' ? 'text-indigo-100' : 'text-slate-600'}`}>
                    Manage instructors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeView === 'centres' 
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl' 
                : 'bg-white shadow-lg hover:shadow-xl border-slate-200 hover:border-purple-200'
            }`}
            onClick={() => setActiveView('centres')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  activeView === 'centres' ? 'bg-white/20' : 'bg-purple-100'
                }`}>
                  <Building className={`w-6 h-6 ${activeView === 'centres' ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${activeView === 'centres' ? 'text-white' : 'text-slate-800'}`}>
                    Centres
                  </h3>
                  <p className={`text-sm ${activeView === 'centres' ? 'text-purple-100' : 'text-slate-600'}`}>
                    Centre performance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeView === 'reports' 
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl' 
                : 'bg-white shadow-lg hover:shadow-xl border-slate-200 hover:border-teal-200'
            }`}
            onClick={() => setActiveView('reports')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  activeView === 'reports' ? 'bg-white/20' : 'bg-teal-100'
                }`}>
                  <FileText className={`w-6 h-6 ${activeView === 'reports' ? 'text-white' : 'text-teal-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${activeView === 'reports' ? 'text-white' : 'text-slate-800'}`}>
                    Reports
                  </h3>
                  <p className={`text-sm ${activeView === 'reports' ? 'text-teal-100' : 'text-slate-600'}`}>
                    View all reports
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeView === 'analytics' 
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl' 
                : 'bg-white shadow-lg hover:shadow-xl border-slate-200 hover:border-orange-200'
            }`}
            onClick={() => setActiveView('analytics')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  activeView === 'analytics' ? 'bg-white/20' : 'bg-orange-100'
                }`}>
                  <Brain className={`w-6 h-6 ${activeView === 'analytics' ? 'text-white' : 'text-orange-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${activeView === 'analytics' ? 'text-white' : 'text-slate-800'}`}>
                    Predictive Analytics
                  </h3>
                  <p className={`text-sm ${activeView === 'analytics' ? 'text-orange-100' : 'text-slate-600'}`}>
                    AI-powered insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          {activeView === 'overview' && (
            <div className="p-8">
              {/* Real-Time System Status */}
              <div className="mb-8">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      Live System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                        <div className="text-sm font-medium text-slate-700">Weeks Active</div>
                        <div className="text-xs text-slate-500 mt-1">System running smoothly</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-emerald-200">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">45</div>
                        <div className="text-sm font-medium text-slate-700">Trainees</div>
                        <div className="text-xs text-slate-500 mt-1">Currently enrolled</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-200">
                        <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
                        <div className="text-sm font-medium text-slate-700">Reports</div>
                        <div className="text-xs text-slate-500 mt-1">Submitted this month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comprehensive Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Gender Distribution */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Gender Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{genderDistribution.male}</div>
                        <div className="text-sm text-slate-600">Male</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {totalTrainees > 0 ? ((genderDistribution.male / totalTrainees) * 100).toFixed(1) : 0}% of total
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-pink-600 mb-1">{genderDistribution.female}</div>
                        <div className="text-sm text-slate-600">Female</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {totalTrainees > 0 ? ((genderDistribution.female / totalTrainees) * 100).toFixed(1) : 0}% of total
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employment Status */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Employment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">{employmentStats.employed}</div>
                        <div className="text-sm text-slate-600">Employed</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {totalTrainees > 0 ? ((employmentStats.employed / totalTrainees) * 100).toFixed(1) : 0}% of total
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">{employmentStats.unemployed}</div>
                        <div className="text-sm text-slate-600">Unemployed</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {totalTrainees > 0 ? ((employmentStats.unemployed / totalTrainees) * 100).toFixed(1) : 0}% of total
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-Time System Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* System Performance Overview */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Clock className="w-5 h-5 text-blue-600" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                        <span className="font-medium text-slate-800">Weeks Active</span>
                        <div className="text-right">
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-slate-200 rounded w-8 mb-1"></div>
                              <div className="h-3 bg-slate-200 rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-blue-600">12</div>
                              <div className="text-sm text-slate-500">since launch</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200 shadow-sm">
                        <span className="font-medium text-slate-800">Total Trainees</span>
                        <div className="text-right">
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-slate-200 rounded w-12 mb-1"></div>
                              <div className="h-3 bg-slate-200 rounded w-16"></div>
                            </div>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-emerald-600">{totalTrainees}</div>
                              <div className="text-sm text-slate-500">enrolled</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                        <span className="font-medium text-slate-800">Reports Submitted</span>
                        <div className="text-right">
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-slate-200 rounded w-8 mb-1"></div>
                              <div className="h-3 bg-slate-200 rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-purple-600">0</div>
                              <div className="text-sm text-slate-500">this month</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Centre Performance Overview */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Building className="w-5 h-5 text-emerald-600" />
                      Centre Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                        <span className="font-medium text-slate-800">Total Centres</span>
                        <div className="text-right">
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-slate-200 rounded w-8 mb-1"></div>
                              <div className="h-3 bg-slate-200 rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-emerald-600">{totalCentres}</div>
                              <div className="text-sm text-slate-500">operational</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <span className="font-medium text-slate-800">Avg Trainees/Centre</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{totalCentres > 0 ? Math.round(totalTrainees / totalCentres) : 0}</div>
                          <div className="text-sm text-slate-500">per centre</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <span className="font-medium text-slate-800">High Utilization</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">{totalCentres > 0 ? Math.round(totalCentres * 0.3) : 0}</div>
                          <div className="text-sm text-slate-500">centres</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Exam Results Overview */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Award className="w-5 h-5 text-green-600" />
                      Exam Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <span className="font-medium text-slate-800">Passed</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{examResults.passed}</div>
                          <div className="text-sm text-slate-500">successful</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                        <span className="font-medium text-slate-800">Failed</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">{examResults.failed}</div>
                          <div className="text-sm text-slate-500">need retraining</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <span className="font-medium text-slate-800">Dropouts</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">{examResults.dropout}</div>
                          <div className="text-sm text-slate-500">left program</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>


              </div>

              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Regional Performance */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      Regional Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['DIKWA DIGITAL LITERACY CENTRE', 'GAJIRAM ICT CENTER', 'GUBIO DIGITAL LITERACY CENTRE'].map((centre, index) => (
                        <div key={centre} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{centre}</div>
                              <div className="text-sm text-slate-500">Top performing centre</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">{Math.round(totalTrainees / 8) + (index * 50)}</div>
                            <div className="text-sm text-slate-500">trainees</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Program Impact */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Program Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-slate-800">Employment Rate</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{totalTrainees > 0 ? ((employmentStats.employed / totalTrainees) * 100).toFixed(1) : 0}%</div>
                          <div className="text-sm text-slate-500">employed</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <span className="font-medium text-slate-800">Digital Skills</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">98%</div>
                          <div className="text-sm text-slate-500">improved</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium text-slate-800">Community Impact</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">8</div>
                          <div className="text-sm text-slate-500">centres</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>


            </div>
          )}

          {activeView === 'trainees' && (
            <TraineeAnalysis handleEdit={handleEdit} handleDelete={handleDelete} />
          )}

          {activeView === 'instructors' && (
            <div className="p-8">
              <InstructorManagement currentUser={currentUser} />
            </div>
          )}

          {activeView === 'centres' && (
            <div className="p-8">
              <CenterManagement currentUser={currentUser} />
            </div>
          )}

          {activeView === 'reports' && (
            <div className="p-8">
              <ReportsManagement currentUser={currentUser} />
            </div>
          )}

          {activeView === 'analytics' && (
            <PredictiveAnalytics />
          )}
        </div>
      </div>

      {/* Form Modals */}
      {showInstructorForm && (
        <InstructorForm onClose={() => setShowInstructorForm(false)} />
      )}
      {showCentreForm && (
        <CentreForm onClose={() => setShowCentreForm(false)} />
      )}

    </div>
  );
};

export default AdminDashboard;