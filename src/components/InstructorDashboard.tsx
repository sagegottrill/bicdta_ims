import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, LogOut, BarChart3, Download, Megaphone, Globe, Plus, TrendingUp, Building, GraduationCap, Target, Award, Activity, Clock, CheckCircle, X, User, Edit, XCircle, UserX, FileText, Calendar, BarChart } from 'lucide-react';
import TraineeForm from './forms/TraineeForm';
import ExportModal from './ExportModal';
import CombinedReportsForm from './forms/CombinedReportsForm';
import WeeklyReportForm from './forms/WeeklyReportForm';
import MEReportForm from './forms/MEReportForm';
import MonitoringEvaluationForm from './forms/MonitoringEvaluationForm';
import InstructorProfile from './InstructorProfile';

const InstructorDashboard: React.FC = () => {
  const { currentUser, logout, trainees, loading, announcements, announcementsLoading } = useAppContext();
  const { t, language, setLanguage } = useLanguage();
  const [showTraineeForm, setShowTraineeForm] = useState(false);
  const [showReportsForm, setShowReportsForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWeeklyReportForm, setShowWeeklyReportForm] = useState(false);
  const [showMEReportForm, setShowMEReportForm] = useState(false);
  const [showMonitoringEvaluationForm, setShowMonitoringEvaluationForm] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  const [selectedCentre, setSelectedCentre] = useState<string>(
    currentUser?.role === 'instructor' && currentUser.centre_name 
      ? currentUser.centre_name.toUpperCase() 
      : 'all'
  );
  const [selectedCohort, setSelectedCohort] = useState<string>('all');

  // Real-time Analytics
  const genderStats = [
    { label: 'MALE', count: trainees?.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'male' || gender === 'm';
    }).length || 0 },
    { label: 'FEMALE', count: trainees?.filter(t => {
      const gender = t.gender?.toLowerCase();
      return gender === 'female' || gender === 'f';
    }).length || 0 },
  ];
  
  const centreStats = trainees?.reduce((acc, trainee) => {
    const centreName = trainee.centre_name?.toUpperCase() || 'UNKNOWN CENTRE';
    acc[centreName] = (acc[centreName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const cohortStats = trainees?.reduce((acc, trainee) => {
    const cohortNum = trainee.cohort_number || 0;
    if (cohortNum > 0) {
      acc[cohortNum.toString()] = (acc[cohortNum.toString()] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  // Real-time filtered trainees based on instructor's center and selected filters
  const filteredTrainees = trainees?.filter(trainee => {
    // First filter by instructor's center
    if (currentUser?.role === 'instructor' && currentUser.centre_name) {
      if (!trainee.centre_name?.toLowerCase().includes(currentUser.centre_name.toLowerCase())) {
        return false;
      }
    }
    
    // Then apply additional filters
    const centreMatch = selectedCentre === 'all' || trainee.centre_name?.toUpperCase() === selectedCentre;
    const cohortMatch = selectedCohort === 'all' || trainee.cohort_number?.toString() === selectedCohort;
    return centreMatch && cohortMatch;
  }) || [];

  // Get unique centres and cohorts for filter dropdowns
  const uniqueCentres = currentUser?.role === 'instructor' && currentUser.centre_name 
    ? [currentUser.centre_name.toUpperCase()]
    : [
        "DIKWA DIGITAL LITERACY CENTRE",
        "GAJIRAM ICT CENTER", 
        "GUBIO DIGITAL LITERACY CENTRE",
        "KAGA DIGITAL LITERACY CENTRE",
        "MONGUNO DIGITAL LITERACY CENTRE",
        "MAFA DIGITAL LITERACY CENTRE",
        "DAMASAK DIGITAL LITERACY CENTER",
        "BAYO DIGITAL LITERACY CENTER"
      ];
  const uniqueCohorts = [...new Set(trainees?.map(t => t.cohort_number?.toString() || '') || [])].filter(cohort => cohort && cohort !== '0').sort();

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
                <div className="flex gap-1">
                  <Button 
                    onClick={() => setShowProfile(true)} 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                  </Button>
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

        {/* Statistics Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Trainees</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-white/30 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-white/30 rounded w-24"></div>
                      </div>
                    ) : (
                      <>
                    <p className="text-3xl font-bold">{filteredTrainees.length}</p>
                    <p className="text-blue-100 text-xs mt-2">Across all centres</p>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Passed</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-white/30 rounded w-12 mb-2"></div>
                        <div className="h-3 bg-white/30 rounded w-28"></div>
                      </div>
                    ) : (
                      <>
                    <p className="text-3xl font-bold">{filteredTrainees.filter(t => t.passed).length}</p>
                    <p className="text-green-100 text-xs mt-2">Successful trainees</p>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium mb-1">Failed</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-white/30 rounded w-12 mb-2"></div>
                        <div className="h-3 bg-white/30 rounded w-24"></div>
                      </div>
                    ) : (
                      <>
                    <p className="text-3xl font-bold">{filteredTrainees.filter(t => t.failed).length}</p>
                    <p className="text-red-100 text-xs mt-2">Need retraining</p>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium mb-1">Special Needs</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-white/30 rounded w-12 mb-2"></div>
                        <div className="h-3 bg-white/30 rounded w-20"></div>
                      </div>
                    ) : (
                      <>
                    <p className="text-3xl font-bold">{filteredTrainees.filter(t => t.people_with_special_needs).length}</p>
                    <p className="text-orange-100 text-xs mt-2">PWD trainees</p>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
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
          
          <ExportModal 
            trainees={filteredTrainees}
            trigger={
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
            }
          />
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => setShowReportsForm(true)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Reports</p>
                  <p className="text-2xl font-bold">Submit</p>
                  <p className="text-purple-100 text-xs mt-2">Weekly & Monthly</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => setShowWeeklyReportForm(true)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Weekly Report</p>
                  <p className="text-2xl font-bold">Submit</p>
                  <p className="text-blue-100 text-xs mt-2">With photos & videos</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => setShowMEReportForm(true)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">M&E Report</p>
                  <p className="text-2xl font-bold">Submit</p>
                  <p className="text-green-100 text-xs mt-2">Monthly evaluation</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => setShowMonitoringEvaluationForm(true)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Monitoring & Evaluation</p>
                  <p className="text-2xl font-bold">Submit</p>
                  <p className="text-purple-100 text-xs mt-2">Comprehensive assessment</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          

        </div>

        {/* Announcements Section */}
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
                  Official Announcements
                  {announcements.length > 0 && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </CardTitle>
                <p className="text-slate-600 text-sm">Important updates from BICTDA Administration</p>
              </div>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
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


              </div>
            </div>
            
            {/* Advanced Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Training Centre</label>
                {currentUser?.role === 'instructor' && currentUser.centre_name ? (
                  // Locked for instructors - show only their centre
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                    <p className="text-blue-800 font-bold text-lg">{currentUser.centre_name}</p>
                    <p className="text-blue-600 text-sm">Your assigned centre</p>
                    <p className="text-blue-500 text-xs">Access restricted to this centre</p>
                  </div>
                ) : (
                  // Full access for admins
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
                )}
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
                  <th className="py-4 px-6 text-left font-semibold">S/N</th>
                  <th className="py-4 px-6 text-left font-semibold">ID Number</th>
                  <th className="py-4 px-6 text-left font-semibold">Full Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Gender</th>
                  <th className="py-4 px-6 text-left font-semibold">Date of Birth</th>
                  <th className="py-4 px-6 text-left font-semibold">Educational Background</th>
                  <th className="py-4 px-6 text-left font-semibold">Employment Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Centre</th>
                  <th className="py-4 px-6 text-left font-semibold">NIN</th>
                  <th className="py-4 px-6 text-left font-semibold">Phone</th>
                  <th className="py-4 px-6 text-left font-semibold">Cohort</th>
                  <th className="py-4 px-6 text-left font-semibold">Learner Group</th>
                  <th className="py-4 px-6 text-left font-semibold">Email</th>
                  <th className="py-4 px-6 text-left font-semibold">LGA</th>
                  <th className="py-4 px-6 text-left font-semibold">Exam Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Special Needs</th>
                  <th className="py-4 px-6 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Show skeleton rows while loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-slate-100">
                      {Array.from({ length: 17 }).map((_, cellIndex) => (
                        <td key={`skeleton-cell-${cellIndex}`} className="py-4 px-6">
                          <div className="animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-16"></div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  filteredTrainees.map((t, index) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-600">{t.serial_number || index + 1}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{t.id_number}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{t.full_name}</td>
                    <td className="py-4 px-6 text-slate-600 capitalize">
                      {t.gender?.toLowerCase() === 'm' ? 'MALE' : 
                       t.gender?.toLowerCase() === 'f' ? 'FEMALE' : 
                       t.gender}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{t.date_of_birth || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">{t.educational_background || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {t.employment_status ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full capitalize">
                          {t.employment_status.toLowerCase()}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{t.centre_name?.toUpperCase()}</td>
                    <td className="py-4 px-6 text-slate-600">{t.nin || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">{t.phone_number || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">{t.cohort_number}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {t.learner_category ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                          {t.learner_category.toLowerCase()}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{t.email || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">{t.lga || '-'}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {t.passed && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Passed</span>
                        )}
                        {t.failed && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>
                        )}
                        {t.not_sat_for_exams && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Not Sat</span>
                        )}
                        {t.dropout && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Dropout</span>
                        )}
                        {!t.passed && !t.failed && !t.not_sat_for_exams && !t.dropout && (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {t.people_with_special_needs ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">PWD</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTrainee(t);
                          setShowEditModal(true);
                        }}
                        className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
                )}
                {filteredTrainees.length === 0 && (
                  <tr>
                    <td colSpan={18} className="text-center py-12 text-slate-500">
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


                    </div>

      {/* Form Modals */}
      {showTraineeForm && (
        <TraineeForm onClose={() => setShowTraineeForm(false)} availableCentres={uniqueCentres} />
      )}
      {showReportsForm && (
        <CombinedReportsForm onClose={() => setShowReportsForm(false)} />
      )}
      {showProfile && (
        <InstructorProfile onClose={() => setShowProfile(false)} />
      )}

      {/* Report Form Modals */}
      {showWeeklyReportForm && (
        <WeeklyReportForm onClose={() => setShowWeeklyReportForm(false)} />
      )}
      {showMEReportForm && (
        <MEReportForm onClose={() => setShowMEReportForm(false)} />
      )}
      {showMonitoringEvaluationForm && (
        <MonitoringEvaluationForm onClose={() => setShowMonitoringEvaluationForm(false)} />
      )}

      {/* Edit Exam Status Modal */}
      {showEditModal && selectedTrainee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                          <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Edit Learner Group</h3>
                  <p className="text-slate-600 text-sm mt-1">{selectedTrainee.full_name}</p>
                    </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
        </div>

              <div className="space-y-4">
              {/* Exam Status Selection */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Exam Status</label>
                <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedTrainee.passed ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTrainee({
                      ...selectedTrainee,
                      passed: !selectedTrainee.passed,
                      failed: false,
                      not_sat_for_exams: false,
                      dropout: false
                    });
                  }}
                  className={`flex items-center gap-2 ${selectedTrainee.passed ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Passed
                </Button>

                <Button
                  variant={selectedTrainee.failed ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTrainee({
                      ...selectedTrainee,
                      passed: false,
                      failed: !selectedTrainee.failed,
                      not_sat_for_exams: false,
                      dropout: false
                    });
                  }}
                  className={`flex items-center gap-2 ${selectedTrainee.failed ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                >
                  <XCircle className="w-4 h-4" />
                  Failed
                </Button>

                <Button
                  variant={selectedTrainee.not_sat_for_exams ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTrainee({
                      ...selectedTrainee,
                      passed: false,
                      failed: false,
                      not_sat_for_exams: !selectedTrainee.not_sat_for_exams,
                      dropout: false
                    });
                  }}
                  className={`flex items-center gap-2 ${selectedTrainee.not_sat_for_exams ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'}`}
                >
                  <Clock className="w-4 h-4" />
                  Not Sat
                </Button>

                <Button
                  variant={selectedTrainee.dropout ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTrainee({
                      ...selectedTrainee,
                      passed: false,
                      failed: false,
                      not_sat_for_exams: false,
                      dropout: !selectedTrainee.dropout
                    });
                  }}
                  className={`flex items-center gap-2 ${selectedTrainee.dropout ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
                >
                  <UserX className="w-4 h-4" />
                  Dropout
                </Button>
              </div>
        </div>

            <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Here you would typically update the trainee in the database
                    // For now, we'll just close the modal
                    setShowEditModal(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;