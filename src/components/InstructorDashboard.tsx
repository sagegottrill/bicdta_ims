import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, LogOut, BarChart3, Download, Megaphone, Globe, Plus, TrendingUp, Building, GraduationCap, Target, Award, Activity, Clock, CheckCircle } from 'lucide-react';
import TraineeForm from './forms/TraineeForm';
import ExportModal from './ExportModal';

const InstructorDashboard: React.FC = () => {
  const { currentUser, logout, trainees, loading } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [showTraineeForm, setShowTraineeForm] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([
    "Welcome to BICTDA Information Management System! All instructors are required to attend the training session on Friday.",
    "New trainees enrollment is now open for Cohort 4. Please ensure all documentation is complete.",
    "Monthly progress reports are due by the end of this week. Please submit your center's data."
  ]);
  const [selectedCentre, setSelectedCentre] = useState<string>('all');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  // Analytics
  const genderStats = [
    { label: 'Male', count: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'male' || gender === 'm';
    }).length },
    { label: 'Female', count: trainees.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'female' || gender === 'f';
    }).length },
  ];
  
  const centreStats = trainees.reduce((acc, trainee) => {
    const centreName = trainee.centre_name?.toUpperCase() || 'UNKNOWN CENTRE';
    acc[centreName] = (acc[centreName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cohortStats = trainees.reduce((acc, trainee) => {
    const cohortNum = trainee.cohort_number || 0;
    if (cohortNum > 0) {
      acc[cohortNum.toString()] = (acc[cohortNum.toString()] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Filtered trainees based on selected filters
  const filteredTrainees = trainees.filter(trainee => {
    const centreMatch = selectedCentre === 'all' || trainee.centre_name?.toUpperCase() === selectedCentre;
    const cohortMatch = selectedCohort === 'all' || trainee.cohort_number.toString() === selectedCohort;
    return centreMatch && cohortMatch;
  });

  // Get unique centres and cohorts for filter dropdowns
  const uniqueCentres = [
    "IKWA DIGITAL LITERACY CENTRE",
    "GAJIRAM ICT CENTER", 
    "GUBIO DIGITAL LITERACY CENTRE",
    "KAGA DIGITAL LITERACY CENTRE",
    "MONGUNO DIGITAL LITERACY CENTRE",
    "MAFA DIGITAL LITERACY CENTRE",
    "DAMASAK DIGITAL LITERACY CENTER",
    "BAYO DIGITAL LITERACY CENTER"
  ];
  const uniqueCohorts = [...new Set(trainees.map(t => t.cohort_number?.toString() || ''))].filter(cohort => cohort && cohort !== '0').sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Premium Header */}
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
                    BICTDA Digital Literacy Program
                </h1>
                  <p className="text-slate-600 text-sm">Instructor Management Dashboard</p>
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">{currentUser?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500">Instructor</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-3">Welcome back, {currentUser?.name} 👋</h2>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => setShowTraineeForm(true)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Enroll Trainee</p>
                  <p className="text-2xl font-bold">Add New</p>
                  <p className="text-blue-100 text-xs mt-2">Register trainee</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">Export Data</p>
                  <p className="text-2xl font-bold">Download</p>
                  <p className="text-emerald-100 text-xs mt-2">CSV reports</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">View Analytics</p>
                  <p className="text-2xl font-bold">Reports</p>
                  <p className="text-purple-100 text-xs mt-2">Performance data</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">System Status</p>
                  <p className="text-2xl font-bold">Online</p>
                  <p className="text-orange-100 text-xs mt-2">All systems operational</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-800 text-xl">Official Announcements</CardTitle>
                <p className="text-slate-600 text-sm">Important updates from BICTDA Administration</p>
            </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {announcements.length > 0 ? (
                  announcements.map((a, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm border-l-4 border-amber-400 p-4 rounded-xl text-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{a}</p>
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                            <span>Sent by Administrator</span>
                            <span>•</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                          </p>
                        </div>
                      </div>
            </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Megaphone className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p>No new announcements from administration</p>
                </div>
                )}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Trainee Management Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-8 border-b border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Trainee Management</h2>
                <p className="text-slate-600 text-lg">Manage and monitor your digital literacy trainees</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowTraineeForm(true)} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Enroll New Trainee
                </Button>
                <ExportModal 
                  trainees={filteredTrainees}
                  trigger={
                <Button 
                  variant="outline" 
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 shadow-lg px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                      <Download className="w-5 h-5 mr-2" />
                      Export Data
                </Button>
                  }
                />
              </div>
            </div>
            
            {/* Advanced Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Training Centre</label>
                <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                  <SelectTrigger className="bg-white/80 border-slate-200 rounded-xl h-12">
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Training Centres</SelectItem>
                    {uniqueCentres.map(centre => (
                      <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Cohort</label>
                <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                  <SelectTrigger className="bg-white/80 border-slate-200 rounded-xl h-12">
                    <SelectValue placeholder="Select Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cohorts</SelectItem>
                    {uniqueCohorts.map(cohort => (
                      <SelectItem key={cohort} value={cohort}>Cohort {cohort}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Results</label>
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                  <p className="text-blue-800 font-bold text-xl">{filteredTrainees.length}</p>
                  <p className="text-blue-600 text-sm">Trainees Found</p>
                  <p className="text-blue-500 text-xs">Based on selected filters</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50 text-slate-800">
                  <th className="py-4 px-6 text-left font-semibold">Full Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Gender</th>
                  <th className="py-4 px-6 text-left font-semibold">Age</th>
                  <th className="py-4 px-6 text-left font-semibold">Training Centre</th>
                  <th className="py-4 px-6 text-left font-semibold">Cohort</th>
                  <th className="py-4 px-6 text-left font-semibold">Employment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainees.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{t.full_name}</td>
                    <td className="py-4 px-6 text-slate-600 capitalize">
                      {t.gender?.toLowerCase() === 'm' ? 'Male' : 
                       t.gender?.toLowerCase() === 'f' ? 'Female' : 
                       t.gender}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{t.age}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{t.centre_name?.toUpperCase()}</td>
                    <td className="py-4 px-6 text-slate-600">{t.cohort_number}</td>
                    <td className="py-4 px-6 text-slate-600 capitalize">{t.employment_status}</td>
                  </tr>
                ))}
                {filteredTrainees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-slate-400" />
                        <p>No trainees found for selected filters</p>
                        <p className="text-sm text-slate-400">Try adjusting your filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trainee Form Modal */}
        {showTraineeForm && <TraineeForm onClose={() => setShowTraineeForm(false)} availableCentres={uniqueCentres} />}

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Centre Performance */}
          <Card className="border-0 shadow-xl">
                <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Building className="w-5 h-5 text-blue-600" />
                Centre Performance Overview
              </CardTitle>
                </CardHeader>
                <CardContent>
              <div className="space-y-4">
                {Object.entries(centreStats).map(([centre, count]) => (
                  <div key={centre} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-slate-800">{centre}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{count}</p>
                      <p className="text-sm text-slate-500">Trainees</p>
                    </div>
                  </div>
                ))}
              </div>
                </CardContent>
              </Card>

          {/* Gender Distribution */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="w-5 h-5 text-emerald-600" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {genderStats.map(gs => (
                  <div key={gs.label} className="bg-gradient-to-r from-slate-50 to-emerald-50 border border-slate-200/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{gs.count}</div>
                    <div className="text-sm text-slate-600">{gs.label}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {trainees.length > 0 ? ((gs.count / trainees.length) * 100).toFixed(1) : 0}% of total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cohort Performance */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Cohort Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(cohortStats).map(([cohort, count]) => (
                  <div key={cohort} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-slate-200/50">
                    <span className="font-medium text-slate-800">Cohort {cohort}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{count}</div>
                      <div className="text-sm text-slate-500">trainees</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employment Status */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Activity className="w-5 h-5 text-emerald-600" />
                Employment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <span className="font-medium text-slate-800">Employed</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {trainees.filter(t => ['employed', 'emp'].includes(t.employment_status?.toLowerCase() || '')).length}
                    </div>
                    <div className="text-sm text-slate-500">trainees</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <span className="font-medium text-slate-800">Unemployed</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {trainees.filter(t => ['unemployed', 'unemp'].includes(t.employment_status?.toLowerCase() || '')).length}
                    </div>
                    <div className="text-sm text-slate-500">trainees</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Background */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Target className="w-5 h-5 text-blue-600" />
                Education Background
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <span className="font-medium text-slate-800">Primary</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {trainees.filter(t => t.educational_background?.toLowerCase().includes('primary')).length}
                    </div>
                    <div className="text-sm text-slate-500">trainees</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <span className="font-medium text-slate-800">Secondary</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {trainees.filter(t => t.educational_background?.toLowerCase().includes('secondary') || t.educational_background?.toLowerCase().includes('ssce')).length}
                    </div>
                    <div className="text-sm text-slate-500">trainees</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <span className="font-medium text-slate-800">Tertiary</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {trainees.filter(t => t.educational_background?.toLowerCase().includes('tertiary') || t.educational_background?.toLowerCase().includes('ond') || t.educational_background?.toLowerCase().includes('bsc')).length}
                    </div>
                    <div className="text-sm text-slate-500">trainees</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Centres */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Award className="w-5 h-5 text-emerald-600" />
                Top Performing Centres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(centreStats)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([centre, count], index) => (
                    <div key={centre} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-800">{centre}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{count}</p>
                        <p className="text-sm text-slate-500">trainees</p>
                      </div>
              </div>
            ))}
          </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-800">New trainees enrolled</div>
                    <div className="text-sm text-slate-500">15 new trainees added this week</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-800">Training sessions completed</div>
                    <div className="text-sm text-slate-500">25 sessions conducted this month</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-800">Progress reports updated</div>
                    <div className="text-sm text-slate-500">All centre reports submitted</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;